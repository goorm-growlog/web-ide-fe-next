import ky from 'ky'
import { getSession, signOut } from 'next-auth/react'
import { handleApiError } from '@/shared/lib/api-error'
import type { ApiResponse } from '@/shared/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

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
  retry: 0, // 재시도는 아래 afterResponse에서 직접 제어
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
      async (request, _options, response) => {
        if (response.status === 401 && typeof window !== 'undefined') {
          try {
            // 1. 토큰 갱신 API 호출
            const { accessToken: newAccessToken } = await ky
              .post('/api/auth/refresh')
              .json<{ accessToken: string }>()

            // 2. 세션 업데이트를 위해 커스텀 이벤트 발생
            window.dispatchEvent(
              new CustomEvent('session-token-update', {
                detail: { accessToken: newAccessToken },
              }),
            )

            // 3. 새 토큰으로 원래 요청 재시도
            request.headers.set('Authorization', `Bearer ${newAccessToken}`)
            return ky(request)
          } catch (_error) {
            // 토큰 갱신 실패 시 로그아웃 처리
            await signOut({ callbackUrl: '/signin?error=SessionExpired' })
            return response // 원래의 401 응답 반환
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
