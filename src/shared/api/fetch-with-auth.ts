import { useAuthStore } from '@/entities/auth/model/store'
import { refreshToken } from '@/features/auth/refresh/api/refresh'

/**
 * 인증 미들웨어: AccessToken 만료 시 자동 갱신 후 재요청
 */
export const fetchWithAuth = async (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  const store = useAuthStore.getState()
  const accessToken = store.accessToken

  // 1. 헤더에 현재 accessToken 추가
  const authHeaders = {
    ...init?.headers,
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  }

  // 2. 최초 요청
  let response = await fetch(input, { ...init, headers: authHeaders })

  // 3. 401 에러 시 토큰 갱신 시도 (한 번만)
  if (response.status === 401) {
    try {
      const newAccessToken = await refreshToken()
      store.setAccessToken(newAccessToken)

      // 새 토큰으로 재요청
      response = await fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      })

      // 재요청도 401이면 로그아웃
      if (response.status === 401) {
        store.clearAuth()
      }
    } catch (_error) {
      // refreshToken 실패 시 로그아웃
      store.clearAuth()
    }
  }

  return response
}
