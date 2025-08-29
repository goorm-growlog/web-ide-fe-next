/**
 * Kakao 소셜 로그인 API
 */
export const initiateKakaoAuth = async (): Promise<void> => {
  // Kakao OAuth 로그인 페이지로 리다이렉트
  window.location.href = '/auth/social/kakao'
}

/**
 * Kakao 소셜 로그인 콜백 처리
 */
export const handleKakaoCallback = async (code: string) => {
  // TODO: Kakao 콜백 처리 로직
  const response = await fetch('/api/auth/kakao/callback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Kakao login failed')
  }

  return response.json()
}
