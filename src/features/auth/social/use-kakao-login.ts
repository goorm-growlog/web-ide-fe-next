'use client'

import { useCallback } from 'react'
import { useLoadingState } from '@/shared/hooks/use-loading-state'
import { handleAuthError } from '@/shared/lib/error-handler'

/**
 * Kakao 소셜 로그인 훅
 * 백엔드 직접 연동 방식 - NextAuth Provider 사용하지 않음
 *
 * 플로우:
 * 1. 백엔드 /auth/kakao로 리다이렉트
 * 2. 백엔드에서 Kakao OAuth 처리
 * 3. /auth/kakao/success 페이지로 리다이렉트 (토큰 포함)
 * 4. success 페이지에서 kakaoLoginApi 호출하여 토큰 처리
 */
export const useKakaoLogin = () => {
  const { isLoading, withLoading } = useLoadingState()

  const loginWithKakao = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      if (!baseUrl) {
        throw new Error('API base URL 미설정 (NEXT_PUBLIC_API_BASE_URL)')
      }

      // 백엔드로 직접 리다이렉트 (NextAuth 사용하지 않음)
      window.location.href = `${baseUrl}/auth/kakao`
    } catch (error) {
      handleAuthError(error)
    }
  }, [])

  return {
    loginWithKakao: () => withLoading(loginWithKakao),
    isLoading,
  }
}
