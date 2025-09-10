import ky from 'ky'
import { signOut } from 'next-auth/react'
import { tokenManager } from '@/features/auth/lib/token-manager'
import { handleApiError } from '@/shared/lib/api-error'
import type { ApiResponse } from '@/shared/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

/**
 * 토큰 가져오기 - 백엔드 중심 방식
 */
async function getToken(): Promise<string | null> {
  return await tokenManager.getAccessToken()
}

/**
 * 토큰 초기화 (로그아웃 시)
 */
function clearToken() {
  console.log('🧹 토큰 초기화')
  tokenManager.clearTokens()
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
        const token = await getToken()
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      async (request, _options, response) => {
        if (
          (response.status === 401 || response.status === 403) &&
          typeof window !== 'undefined'
        ) {
          console.log('🔒 토큰 만료, 갱신 또는 로그아웃 처리...')

          // 토큰 재발급 시도 (TokenManager가 내부적으로 처리)
          const newToken = await tokenManager.getAccessToken()

          if (newToken) {
            // 새 토큰으로 재시도
            const newHeaders = new Headers(request.headers)
            newHeaders.set('Authorization', `Bearer ${newToken}`)
            return fetch(request.url, {
              method: request.method,
              headers: newHeaders,
              body: request.body,
              credentials: 'include',
            })
          } else {
            console.log('🚪 로그아웃 처리')
            clearToken()
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
