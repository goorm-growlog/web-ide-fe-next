/**
 * 토큰을 갱신합니다.
 * @returns 새로운 access token
 * @throws 토큰 갱신 실패 시 에러
 */
export const refreshToken = async (): Promise<string> => {
  // 프록시를 통해 same-origin으로 요청
  const response = await fetch(`/auth/refresh`, {
    method: 'POST',
    credentials: 'include', // refreshToken 쿠키 자동 전송
  })

  if (!response.ok) {
    throw new Error('Token refresh failed')
  }

  const data = await response.json()

  if (!data.success || !data.data) {
    throw new Error(data.error?.message || 'Token refresh failed')
  }

  const { accessToken } = data.data

  // 새로운 accessToken을 LocalStorage에 저장
  localStorage.setItem('accessToken', accessToken)

  return accessToken
}
