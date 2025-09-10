import ky from 'ky'
import { getSession, signOut } from 'next-auth/react'
import { handleApiError } from '@/shared/lib/api-error'
import type { ApiResponse } from '@/shared/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

// 메인 브랜치 방식: 단순한 토큰 관리
let currentToken: string | null = null

/**
 * 토큰 가져오기 - 메인 브랜치의 단순한 방식
 */
async function getToken(): Promise<string | null> {
  try {
    // 현재 토큰이 있으면 재사용
    if (currentToken) {
      return currentToken
    }

    // NextAuth에서 세션 가져오기 (필요할 때만)
    console.log('🔄 세션에서 토큰 가져오는 중...')
    const session = await getSession()
    const accessToken = session?.accessToken || null

    // 현재 토큰 업데이트
    currentToken = accessToken
    console.log('✅ 토큰 업데이트:', !!accessToken)

    return accessToken
  } catch (error) {
    console.error('❌ 토큰 가져오기 실패:', error)
    return null
  }
}

/**
 * 토큰 초기화 (로그아웃 시)
 */
function clearToken() {
  console.log('🧹 토큰 초기화')
  currentToken = null
}

/**
 * 토큰 변경 이벤트 처리 - SessionSyncProvider와 연동
 */
if (typeof window !== 'undefined') {
  window.addEventListener('token-changed', (event: Event) => {
    const customEvent = event as CustomEvent
    const { accessToken } = customEvent.detail || {}
    console.log('🔄 토큰 변경 이벤트 수신:', !!accessToken)
    currentToken = accessToken
  })
}

/**
 * 토큰 갱신 - 메인 브랜치의 단순한 방식
 */
async function refreshToken(): Promise<string | null> {
  try {
    console.log('🔄 토큰 갱신 시작...')
    const response = await ky
      .post(`${API_BASE_URL}/auth/refresh`, {
        credentials: 'include',
      })
      .json<ApiResponse<{ accessToken: string }>>()

    if (response.success && response.data?.accessToken) {
      currentToken = response.data.accessToken
      console.log('✅ 토큰 갱신 성공')

      // 토큰 업데이트 이벤트 발생
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('auth:access-token-updated', {
            detail: { accessToken: response.data.accessToken },
          }),
        )
      }
      return response.data.accessToken
    }

    console.log('❌ 토큰 갱신 실패: 응답 데이터 없음')
    return null
  } catch (error) {
    console.error('❌ 토큰 갱신 실패:', error)
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
          console.log('🔒 토큰 만료, 갱신 시도...')
          clearToken()

          const newToken = await refreshToken()
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
