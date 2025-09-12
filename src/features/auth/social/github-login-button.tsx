'use client'

import SocialButton from '@/shared/ui/auth/social-button'
import { useGitHubLogin } from './use-github-login'

/**
 * GitHub 소셜 로그인 버튼
 */
const GitHubLoginButton = () => {
  const { loginWithGitHub } = useGitHubLogin()

  return <SocialButton provider="github" onClick={loginWithGitHub} />
}

export default GitHubLoginButton
