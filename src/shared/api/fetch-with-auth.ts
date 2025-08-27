import { useAuthStore } from '@/entities/auth/model/store'
import { refreshToken } from '@/features/auth/refresh/api/refresh'

/**
 * 인증 미들웨어: AccessToken 만료 시 자동 갱신 후 fetch
 */
export const fetchWithAuth = async (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  const store = useAuthStore.getState()
  const accessToken = store.accessToken

  // 1. 헤더에 현재 accessToken 추가
  const authInit = {
    ...init,
    headers: {
      ...init?.headers,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  }

  // 2. 최초 요청
  let response = await fetch(input, authInit)

  // 3. 401 에러 발생 시 토큰 갱신 시도
  if (response.status === 401) {
    try {
      const newAccessToken = await refreshToken()

      // Zustand 스토어 상태 업데이트
      store.setAccessToken(newAccessToken)

      // 새로운 accessToken으로 헤더 업데이트
      const updatedInit = {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      }

      // 갱신 성공 시 재요청
      response = await fetch(input, updatedInit)

      // 재요청도 실패하면 최종적으로 인증 만료 처리
      if (response.status === 401) {
        store.clearAuth()
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.')
      }
    } catch (_error) {
      // refreshToken 호출 실패 시 인증 정보 초기화
      store.clearAuth()
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      throw new Error('토큰 갱신에 실패했습니다. 다시 로그인해주세요.')
    }
  }

  return response
}
