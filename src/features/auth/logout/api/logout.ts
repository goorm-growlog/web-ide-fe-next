import { fetchWithAuth } from '@/shared/api/fetch-with-auth'

/**
 * 로그아웃을 수행합니다.
 * 로그아웃은 인증된 사용자만 할 수 있으므로 fetchWithAuth 직접 사용
 * @throws 로그아웃 실패 시 에러
 */
export const logout = async (): Promise<void> => {
  await fetchWithAuth('/auth/logout', {
    method: 'POST',
    credentials: 'include', // refreshToken 쿠키 자동 전송
  })
}
