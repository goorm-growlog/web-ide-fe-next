'use client'

import { useKakaoLogin } from '@/features/auth/social/use-kakao-login'
import SocialButton from '@/shared/ui/auth/social-button'

export function KakaoLoginButton() {
  const { loginWithKakao, isLoading } = useKakaoLogin()

  const handleClick = () => {
    if (!isLoading) {
      loginWithKakao()
    }
  }

  return (
    <SocialButton
      provider="kakao"
      onClick={handleClick}
      className={isLoading ? 'cursor-not-allowed opacity-50' : ''}
    />
  )
}
