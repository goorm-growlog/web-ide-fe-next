import ky from 'ky'
import { getSession, signOut } from 'next-auth/react'
import { handleApiError } from '@/shared/lib/api-error'
import type { ApiResponse } from '@/shared/types/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// 토큰 갱신 동시성 처리를 위한 Promise 캐시
let refreshPromise: Promise<string> | null = null

// 간단한 세션 캐시 (짧은 TTL)
let sessionCache: { session: unknown; timestamp: number } | null = null
const SESSION_CACHE_TTL = 5000 // 5초 (짧게 설정)

async function getCachedSession(): Promise<any> {
  const now = Date.now()

  if (sessionCache && now - sessionCache.timestamp < SESSION_CACHE_TTL) {
    return sessionCache.session
  }

  const session = await getSession()
  sessionCache = { session, timestamp: now }
  return session
}

/**
 * 기본 API 클라이언트 (인증 불필요)
 */
export const api = ky.create({
  prefixUrl: BASE_URL,
  credentials: 'include',
  timeout: 10000,
  retry: { limit: 1 },
  hooks: {
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          await handleApiError(response, 'API request failed')
        }
        return response
      },
    ],
  },
})

/**
 * 인증 API 클라이언트
 */
export const authApi = ky.create({
  prefixUrl: BASE_URL,
  credentials: 'include',
  timeout: 10000,
  retry: { limit: 1 },
  hooks: {
    beforeRequest: [
      async request => {
        const session = await getCachedSession()
        if (session?.accessToken) {
          request.headers.set('Authorization', `Bearer ${session.accessToken}`)
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        // 401이면 토큰 갱신 시도 (동시성 처리 포함)
        if (response.status === 401 && typeof window !== 'undefined') {
          try {
            let newAccessToken: string

            // 이미 갱신 중인 요청이 있다면 기다리기
            if (refreshPromise) {
              newAccessToken = await refreshPromise
            } else {
              // 새로운 토큰 갱신 시작
              refreshPromise = ky
                .post('/api/auth/refresh')
                .json<{ accessToken: string }>()
                .then(({ accessToken }) => {
                  // NextAuth 세션에 새 토큰 반영
                  window.dispatchEvent(
                    new CustomEvent('session-token-refresh', {
                      detail: { accessToken },
                    }),
                  )
                  return accessToken
                })
                .finally(() => {
                  // 갱신 완료 후 Promise 초기화
                  refreshPromise = null
                })

              newAccessToken = await refreshPromise
            }

            // 새 토큰으로 원래 요청 재시도
            const originalRequest = request.clone()
            originalRequest.headers.set(
              'Authorization',
              `Bearer ${newAccessToken}`,
            )
            return ky(originalRequest)
          } catch {
            // 토큰 갱신 실패 시 로그아웃
            refreshPromise = null // 실패 시에도 Promise 초기화
            await signOut({ callbackUrl: '/signin?error=SessionExpired' })
            return response
          }
        }

        if (!response.ok) {
          await handleApiError(response, 'API request failed')
        }
        return response
      },
    ],
  },
})

/**
 * API 응답 헬퍼
 */
export const apiHelpers = {
  extractData: <T>(response: ApiResponse<T>): T => {
    if (!response.success || !response.data) {
      throw new Error(response.error || 'API request failed')
    }
    return response.data
  },
  checkSuccess: (response: {
    success: boolean
    error?: string | null
  }): void => {
    if (!response.success) {
      throw new Error(response.error || 'API request failed')
    }
  },
}
