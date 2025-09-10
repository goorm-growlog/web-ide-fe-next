'use client'

import SocialButton from '@/shared/ui/auth/social-button'
import { useKakaoLogin } from '../model/use-kakao-login'

/**
 * Kakao 소셜 로그인 버튼
 */
const KakaoLoginButton = () => {
  const { login } = useKakaoLogin()

  return <SocialButton provider="kakao" onClick={login} />
}

export default KakaoLoginButton
