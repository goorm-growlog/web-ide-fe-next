/**
 * 로그아웃을 수행합니다.
 * @throws 로그아웃 실패 시 에러
 */
export const logout = async (): Promise<void> => {
  // 서버에 로그아웃 요청 (서버에서 refreshToken 쿠키 삭제)
  const response = await fetch(`/auth/logout`, {
    method: 'POST',
    credentials: 'include', // refreshToken 쿠키 자동 전송
  })

  if (!response.ok) {
    throw new Error('Logout failed')
  }

  // LocalStorage에서 accessToken 제거
  localStorage.removeItem('accessToken')
}
