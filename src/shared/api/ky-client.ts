import ky from 'ky'
import { getSession, signOut } from 'next-auth/react'
import { handleApiError } from '@/shared/lib/api-error'
import type { ApiResponse } from '@/shared/types/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

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
        const session = await getSession()
        if (session?.accessToken) {
          request.headers.set('Authorization', `Bearer ${session.accessToken}`)
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        // 401이면 로그아웃 (NextAuth가 토큰 관리하므로 단순화)
        if (response.status === 401 && typeof window !== 'undefined') {
          await signOut({ callbackUrl: '/signin?error=SessionExpired' })
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
