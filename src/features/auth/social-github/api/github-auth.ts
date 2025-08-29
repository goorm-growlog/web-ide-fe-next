/**
 * GitHub 소셜 로그인 API
 */
export const initiateGitHubAuth = async (): Promise<void> => {
  // GitHub OAuth 로그인 페이지로 리다이렉트
  window.location.href = '/auth/social/github'
}

/**
 * GitHub 소셜 로그인 콜백 처리
 */
export const handleGitHubCallback = async (code: string) => {
  // TODO: GitHub 콜백 처리 로직
  const response = await fetch('/api/auth/github/callback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('GitHub login failed')
  }

  return response.json()
}
