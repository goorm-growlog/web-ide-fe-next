'use client'

import ky from 'ky'
import { getSession, signOut } from 'next-auth/react'
import { handleApiError } from '@/shared/lib/api-error'

// NextAuth 세션 강제 업데이트 함수
let updateSession: ((data?: unknown) => Promise<unknown>) | null = null

// 세션 업데이트 함수 등록 (React 컴포넌트에서 호출)
export const setSessionUpdater = (
  updater: (data?: unknown) => Promise<unknown>,
) => {
  updateSession = updater
}

// 토큰 갱신 동시성 처리를 위한 Promise 캐시
let refreshPromise: Promise<string> | null = null

// 세션 캐시 (짧은 TTL) + Promise 기반 중복 방지
interface SessionData {
  accessToken?: string
}

let sessionCache: { session: SessionData | null; timestamp: number } | null =
  null
let sessionPromise: Promise<SessionData | null> | null = null
const SESSION_CACHE_TTL = 5000 // 5초

export const clearKySessionCache = () => {
  sessionCache = null
  sessionPromise = null
}

async function getCachedSession(): Promise<SessionData | null> {
  const now = Date.now()

  // 1단계: 캐시된 세션 체크 (가장 빠른 경로)
  if (sessionCache && now - sessionCache.timestamp < SESSION_CACHE_TTL) {
    return sessionCache.session
  }

  // 2단계: 진행 중인 요청이 있으면 해당 Promise 반환 (Race Condition 방지)
  if (sessionPromise) {
    return await sessionPromise
  }

  // 3단계: 새로운 세션 요청 시작
  sessionPromise = getSession() as Promise<SessionData | null>

  try {
    const session = await sessionPromise
    // 성공 시 캐시 업데이트
    sessionCache = { session, timestamp: now }
    return session
  } finally {
    // 완료 후 Promise 캐시 정리 (성공/실패 관계없이)
    sessionPromise = null
  }
}

/**
 * 기본 API 클라이언트 (인증 불필요)
 */
export const api = ky.create({
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
        // 401 또는 403이면 토큰 갱신 시도
        if (
          (response.status === 401 || response.status === 403) &&
          typeof window !== 'undefined'
        ) {
          try {
            let newAccessToken: string

            if (refreshPromise) {
              newAccessToken = await refreshPromise
            } else {
              // 새로운 토큰 갱신 시작
              refreshPromise = (async () => {
                const refreshResponse = await fetch('/auth/refresh', {
                  method: 'POST',
                  credentials: 'include',
                })

                if (!refreshResponse.ok) {
                  throw new Error(
                    `Token refresh failed with status: ${refreshResponse.status}`,
                  )
                }

                const data: { data: { accessToken: string } } =
                  await refreshResponse.json()
                const accessToken = data.data.accessToken

                // NextAuth 세션에 새 토큰 반영 (이중 갱신)
                window.dispatchEvent(
                  new CustomEvent('session-token-refresh', {
                    detail: { accessToken },
                  }),
                )

                if (updateSession) {
                  updateSession({ accessToken }).catch(err => {
                    console.warn('Failed to update NextAuth session:', err)
                  })
                }

                // 세션 캐시 즉시 갱신
                sessionCache = {
                  session: { accessToken },
                  timestamp: Date.now(),
                }

                return accessToken
              })()
                .catch(err => {
                  console.error('Token refresh process failed:', err)
                  throw new Error('Token refresh failed')
                })
                .finally(() => {
                  refreshPromise = null
                })

              newAccessToken = await refreshPromise
            }

            // 브라우저 쿠키 처리 시간 확보
            await new Promise(resolve => setTimeout(resolve, 100))

            // 새 토큰으로 원래 요청 재시도
            const originalRequest = request.clone()
            originalRequest.headers.set(
              'Authorization',
              `Bearer ${newAccessToken}`,
            )
            return ky(originalRequest)
          } catch (err) {
            // 토큰 갱신 실패 시 로그아웃
            console.error('Signing out due to refresh failure:', err)
            refreshPromise = null
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
// export const apiHelpers = {
//   extractData: <T>(response: ApiResponse<T>): T => {
//     if (!response.success || !response.data) {
//       throw new Error(response.error || 'API request failed')
//     }
//     return response.data
//   },
//   checkSuccess: (response: {
//     success: boolean
//     error?: string | null
//   }): void => {
//     if (!response.success) {
//       throw new Error(response.error || 'API request failed')
//     }
//   },
// }
