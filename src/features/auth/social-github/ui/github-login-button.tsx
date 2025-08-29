'use client'

import SocialButton from '@/features/auth/ui/social-button'
import { useGitHubLogin } from '../model/use-github-login'

/**
 * GitHub 소셜 로그인 버튼
 */
const GitHubLoginButton = () => {
  const { login } = useGitHubLogin()

  return <SocialButton provider="github" onClick={login} />
}

export default GitHubLoginButton
