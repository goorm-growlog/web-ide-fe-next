'use client'

import { useGitHubLogin } from '@/features/auth/social/use-github-login'
import { useKakaoLogin } from '@/features/auth/social/use-kakao-login'
import SocialButton from '@/shared/ui/auth/social-button'

interface SocialLoginButtonsProps {
  className?: string
}

/**
 * 통합 소셜 로그인 버튼 컴포넌트
 * 기존 SocialButton 컴포넌트를 활용하여 GitHub과 Kakao 로그인 제공
 */
const SocialLoginButtons = ({ className }: SocialLoginButtonsProps) => {
  const { loginWithGitHub } = useGitHubLogin()
  const { loginWithKakao } = useKakaoLogin()

  return (
    <div className={`flex justify-center gap-4 ${className || ''}`}>
      {/* GitHub 로그인 버튼 (NextAuth 방식) */}
      <SocialButton provider="github" onClick={loginWithGitHub} />

      {/* Kakao 로그인 버튼 (백엔드 직접 방식) */}
      <SocialButton provider="kakao" onClick={loginWithKakao} />
    </div>
  )
}

export default SocialLoginButtons
