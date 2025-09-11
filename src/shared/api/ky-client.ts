import ky, { type KyResponse } from 'ky'
import { getSession, signOut } from 'next-auth/react'
import { handleApiError } from '@/shared/lib/api-error'
import type { ApiResponse } from '@/shared/types/api'

// 토큰 갱신 상태 관리
let isRefreshing = false
let refreshPromise: Promise<string> | null = null

/**
 * 토큰 갱신 함수 (동시성 처리 포함)
 */
async function refreshToken(): Promise<string> {
  if (isRefreshing && refreshPromise) return refreshPromise

  isRefreshing = true
  refreshPromise = ky
    .post('/api/auth/refresh')
    .json<{ accessToken: string }>()
    .then(({ accessToken }) => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('session-token-update', { detail: { accessToken } }),
        )
      }
      return accessToken
    })
    .catch(async error => {
      await signOut({ callbackUrl: '/signin?error=SessionExpired' })
      throw error
    })
    .finally(() => {
      isRefreshing = false
      refreshPromise = null
    })

  return refreshPromise
}

// 공통 afterResponse 핸들러
const handleResponse = async (
  _request: Request,
  _options: unknown,
  response: KyResponse,
): Promise<KyResponse> => {
  if (!response.ok) {
    await handleApiError(response, 'API request failed')
  }
  return response
}

// 인증 afterResponse 핸들러
const handleAuthResponse = async (
  request: Request,
  _options: unknown,
  response: KyResponse,
): Promise<KyResponse> => {
  if (response.status === 401 && typeof window !== 'undefined') {
    try {
      const newAccessToken = await refreshToken()
      const originalRequest = request.clone()
      originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`)
      return ky(originalRequest)
    } catch {
      return new Response(JSON.stringify({ error: 'Session expired' }), {
        status: 401,
      })
    }
  }
  return handleResponse(request, _options, response)
}

/**
 * 기본 API 클라이언트 (인증 불필요)
 */
export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  credentials: 'include',
  timeout: 10000,
  retry: { limit: 1 },
  hooks: { afterResponse: [handleResponse] },
})

/**
 * 인증이 필요한 API 클라이언트
 */
export const authApi = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  credentials: 'include',
  timeout: 10000,
  retry: 0,
  hooks: {
    beforeRequest: [
      async request => {
        const session = await getSession()
        if (session?.accessToken) {
          request.headers.set('Authorization', `Bearer ${session.accessToken}`)
        }
      },
    ],
    afterResponse: [handleAuthResponse],
  },
})

/**
 * API 응답 처리 헬퍼 함수들
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
