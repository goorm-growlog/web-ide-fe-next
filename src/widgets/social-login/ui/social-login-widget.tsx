'use client'

import { GitHubLoginButton, KakaoLoginButton } from '@/features/auth/social'

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
