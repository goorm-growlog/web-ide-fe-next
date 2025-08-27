import { useAuthStore } from '@/entities/auth/model/store'
import { refreshToken } from '@/features/auth/refresh/api/refresh'

/**
 * 인증 미들웨어: AccessToken 만료 시 자동 갱신 후 fetch
 * @param input - fetch 요청 URL
 * @param init - fetch 옵션
 * @param isRetry - 재시도 여부 (무한 루프 방지용)
 */
export const fetchWithAuth = async (
  input: RequestInfo,
  init?: RequestInit,
  isRetry = false,
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

  // 3. 401 또는 403 에러 발생 시 토큰 갱신 시도 (단, 재시도가 아닌 경우만)
  if ((response.status === 401 || response.status === 403) && !isRetry) {
    try {
      const newAccessToken = await refreshToken()

      // Zustand 스토어 상태 업데이트 (localStorage는 refresh.ts에서 처리됨)
      store.setAccessToken(newAccessToken)

      // 새로운 accessToken으로 헤더 업데이트
      const updatedInit = {
        ...init,
        headers: {
          ...init?.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      }

      // 갱신 성공 시 재요청 (재시도 플래그 설정)
      response = await fetchWithAuth(input, updatedInit, true)

      // 재요청도 실패하면 최종적으로 인증 만료 처리
      if (response.status === 401 || response.status === 403) {
        store.clearAuth()
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.')
      }
    } catch (error) {
      // refreshToken 호출 실패 시 인증 정보 초기화
      store.clearAuth()
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')

      // 상세한 에러 메시지 제공
      const message =
        error instanceof Error
          ? error.message
          : '토큰 갱신에 실패했습니다. 다시 로그인해주세요.'
      throw new Error(message)
    }
  }

  return response
}
