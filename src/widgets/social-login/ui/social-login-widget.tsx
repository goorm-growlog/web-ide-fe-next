'use client'

import { GitHubLoginButton } from '@/features/social-auth/social-github'
import { KakaoLoginButton } from '@/features/social-auth/social-kakao'

/**
 * ?�셜 로그???�젯
 * GitHub�?Kakao 로그??버튼???�함???�셜 로그??UI
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
