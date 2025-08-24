import { useAuthStore } from '@/entities/auth/model/store'
import { refreshAccessToken } from '@/features/auth/refresh/api/refresh'

/**
 * 인증 미들웨어: AccessToken 만료 시 자동 갱신 후 fetch
 */
export const fetchWithAuth = async (
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> => {
  // 쿠키 기반 인증: 토큰은 브라우저가 자동으로 포함
  // 1. 최초 요청
  let response = await fetch(input, init)

  // 2. 401 에러 발생 시 토큰 갱신 시도
  if (response.status === 401) {
    try {
      await refreshAccessToken() // 쿠키 기반이므로 별도 토큰 저장 불필요
      // 갱신 성공 시 재요청
      response = await fetch(input, init)
      // 그래도 401이면 인증 만료 처리
      if (response.status === 401) {
        useAuthStore.getState().clearAuth()
        throw new Error('세션이 만료되었습니다. 다시 로그인 해주세요.')
      }
    } catch {
      useAuthStore.getState().clearAuth()
      throw new Error('세션이 만료되었습니다. 다시 로그인 해주세요.')
    }
  }

  return response
}
