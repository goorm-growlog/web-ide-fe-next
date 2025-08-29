import { useAuthStore } from '@/entities/auth/model/store'
import { handleApiError } from '@/shared/lib/api-error'
import { refreshToken } from '../../features/auth/refresh/api/refresh'

/**
 * 통합 API 클라이언트 (인증 + 비인증)
 * - 자동 토큰 관리 (Authorization 헤더)
 * - 401 에러 시 자동 토큰 갱신 (인증 API만)
 * - 일관된 에러 처리
 * - JSON 응답 자동 파싱
 */
export const fetchWithAuth = async <T = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> => {
  const { accessToken } = useAuthStore.getState()

  // 헤더 생성 helper
  const createHeaders = (token?: string | null) => {
    const headers = new Headers(init?.headers)
    headers.set('Accept', 'application/json')
    if (typeof init?.body === 'string') {
      headers.set('Content-Type', 'application/json')
    }
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  }

  // 최초 요청
  let response = await fetch(input, {
    ...init,
    headers: createHeaders(accessToken),
  })

  // 401 에러 시 토큰 갱신 시도
  if (response.status === 401) {
    try {
      const newAccessToken = await refreshToken()
      useAuthStore.getState().setAccessToken(newAccessToken)

      // 새 토큰으로 재요청
      response = await fetch(input, {
        ...init,
        headers: createHeaders(newAccessToken),
      })

      // 재요청도 401이면 로그아웃
      if (response.status === 401) {
        useAuthStore.getState().clearAuth()
      }
    } catch {
      useAuthStore.getState().clearAuth()
    }
  }

  // 에러 처리 및 JSON 파싱
  if (!response.ok) {
    await handleApiError(response, 'API request failed')
  }

  return response.json()
}
