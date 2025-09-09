import ky from 'ky'
import { getSession, signOut } from 'next-auth/react'
import { auth } from '@/shared/config/auth'
import { handleApiError } from '@/shared/lib/api-error'
import type { ApiResponse } from '@/shared/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// 토큰 갱신 상태 관리 (간단한 락)
let isRefreshing = false
let refreshPromise: Promise<string | null> | null = null

// 토큰 갱신 함수 (동시 요청 방지)
async function refreshToken(): Promise<string | null> {
  // 이미 갱신 중이면 기존 Promise 대기
  if (isRefreshing && refreshPromise) {
    return await refreshPromise
  }

  // 새로운 갱신 시작
  isRefreshing = true
  refreshPromise = performRefresh()

  try {
    return await refreshPromise
  } finally {
    isRefreshing = false
    refreshPromise = null
  }
}

async function performRefresh(): Promise<string | null> {
  try {
    const response = await ky
      .post(`${API_BASE_URL}/auth/refresh`, {
        credentials: 'include',
      })
      .json<ApiResponse<{ accessToken: string }>>()

    if (response.success && response.data?.accessToken) {
      // NextAuth 세션 업데이트
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('auth:access-token-updated', {
            detail: { accessToken: response.data.accessToken },
          }),
        )
      }
      return response.data.accessToken
    }
    return null
  } catch (error) {
    console.error('Token refresh failed:', error)
    return null
  }
}

// 기본 API 클라이언트 (인증 불필요)
export const api = ky.create({
  prefixUrl: API_BASE_URL,
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

// 인증이 필요한 API 클라이언트
export const authApi = ky.create({
  prefixUrl: API_BASE_URL,
  credentials: 'include',
  timeout: 10000,
  retry: { limit: 1 },
  hooks: {
    beforeRequest: [
      async request => {
        // NextAuth 세션에서 토큰 가져오기
        const session =
          typeof window === 'undefined' ? await auth() : await getSession()
        if (session?.accessToken) {
          request.headers.set('Authorization', `Bearer ${session.accessToken}`)
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        // 401, 403 에러 시 토큰 갱신 후 재시도
        if (
          (response.status === 401 || response.status === 403) &&
          typeof window !== 'undefined'
        ) {
          const newToken = await refreshToken()
          if (newToken) {
            // 새 토큰으로 재시도 (fetch 사용 - 훅 우회)
            const newHeaders = new Headers(request.headers)
            newHeaders.set('Authorization', `Bearer ${newToken}`)
            return fetch(request.url, {
              method: request.method,
              headers: newHeaders,
              body: request.body,
              credentials: 'include',
            })
          } else {
            // 갱신 실패 시 로그아웃
            await signOut({ callbackUrl: '/signin' })
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

// API 응답 처리 헬퍼
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
