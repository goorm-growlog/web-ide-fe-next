/**
 * 백엔드 로그아웃 API를 호출합니다.
 * Redis의 RefreshToken 삭제 및 쿠키 삭제 처리
 */
export const logoutApi = async (): Promise<void> => {
  // 프록시 라우트를 통해 호출 (쿠키 삭제 처리 포함)
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData?.error?.message || 'Logout failed')
  }

  const data = await response.json()
  if (!data.success) {
    throw new Error('Logout failed')
  }
}
