import { useAuthStore } from '@/entities/auth/model/store'
import { refreshToken } from '@/features/auth/refresh/api/refresh'
import { tokenStorage } from '@/shared/lib/token-storage'

/**
 * 인증 미들웨어: AccessToken 만료 시 자동 갱신 후 재요청
 */
export const fetchWithAuth = async (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  const store = useAuthStore.getState()
  const accessToken = store.accessToken

  // 1. 헤더 안전 병합 (Headers 인스턴스 지원)
  const headers = new Headers(init?.headers)
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  // 2. 최초 요청
  let response = await fetch(input, { ...init, headers })

  // 3. 401 에러 시 토큰 갱신 시도 (한 번만)
  if (response.status === 401) {
    try {
      const newAccessToken = await refreshToken()
      // 스토어와 스토리지 모두 업데이트
      store.setAccessToken(newAccessToken)
      tokenStorage.setAccessToken(newAccessToken)

      // 새 토큰으로 재요청
      const retryHeaders = new Headers(init?.headers)
      retryHeaders.set('Authorization', `Bearer ${newAccessToken}`)

      response = await fetch(input, {
        ...init,
        headers: retryHeaders,
      })

      // 재요청도 401이면 로그아웃
      if (response.status === 401) {
        store.clearAuth()
        tokenStorage.clearAll()
      }
    } catch (_error) {
      // refreshToken 실패 시 로그아웃
      store.clearAuth()
      tokenStorage.clearAll()
    }
  }

  return response
}
