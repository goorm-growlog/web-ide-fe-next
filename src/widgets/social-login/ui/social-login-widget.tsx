'use client'

import { GitHubLoginButton } from '@/features/auth/social-github'
import { KakaoLoginButton } from '@/features/auth/social-kakao'

/**
 * 소셜 로그인 위젯
 * GitHub과 Kakao 로그인 버튼을 포함한 소셜 로그인 UI
 */
const SocialLoginWidget = () => {
  return (
    <div className="flex justify-center gap-4">
      <GitHubLoginButton />
      <KakaoLoginButton />
    </div>
  )
}

export default SocialLoginWidget
