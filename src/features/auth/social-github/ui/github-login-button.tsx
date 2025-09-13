'use client'

import { useGitHubLogin } from '@/features/auth/social-github/model/use-github-login'
import SocialButton from '@/features/auth/ui/social-button'

/**
 * GitHub 소셜 로그인 버튼
 */
const GitHubLoginButton = () => {
  const { login } = useGitHubLogin()

  return <SocialButton provider="github" onClick={login} />
}

export default GitHubLoginButton
