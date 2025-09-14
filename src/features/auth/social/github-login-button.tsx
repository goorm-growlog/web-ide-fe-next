'use client'

import { useGitHubLogin } from '@/features/auth/social/use-github-login'
import SocialButton from '@/shared/ui/auth/social-button'

/**
 * GitHub 소셜 로그인 버튼
 */
const GitHubLoginButton = () => {
  const { loginWithGitHub } = useGitHubLogin()

  return <SocialButton provider="github" onClick={loginWithGitHub} />
}

export default GitHubLoginButton
