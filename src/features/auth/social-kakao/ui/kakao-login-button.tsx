'use client'

import { useKakaoLogin } from '@/features/auth/social-kakao/model/use-kakao-login'
import SocialButton from '@/features/auth/ui/social-button'

/**
 * Kakao 소셜 로그인 버튼
 */
const KakaoLoginButton = () => {
  const { login } = useKakaoLogin()

  return <SocialButton provider="kakao" onClick={login} />
}

export default KakaoLoginButton
