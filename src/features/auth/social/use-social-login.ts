'use client'

import { useGitHubLogin } from './use-github-login'
import { useKakaoLogin } from './use-kakao-login'

/**
 * 통합 소셜 로그인 훅
 * 서로 다른 방식의 소셜 로그인을 통합하여 제공
 *
 * - GitHub: NextAuth Provider 방식
 * - Kakao: 백엔드 직접 연동 방식
 */
export const useSocialLogin = () => {
  const githubLogin = useGitHubLogin()
  const kakaoLogin = useKakaoLogin()

  return {
    // GitHub 로그인 (NextAuth 방식)
    loginWithGitHub: githubLogin.loginWithGitHub,
    isGitHubLoading: githubLogin.isLoading,

    // Kakao 로그인 (백엔드 직접 방식)
    loginWithKakao: kakaoLogin.loginWithKakao,
    isKakaoLoading: kakaoLogin.isLoading,

    // 전체 로딩 상태
    isLoading: githubLogin.isLoading || kakaoLogin.isLoading,
  }
}
