'use client'

import SocialButton from '@/shared/ui/auth/social-button'
import { useKakaoLogin } from './use-kakao-login'

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
