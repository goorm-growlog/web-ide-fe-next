'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/types/error'

/**
 * Kakao 소셜 로그인 액션 훅
 *
 * @note 카카오는 백엔드에서 OAuth 처리를 완료하고
 *       성공 페이지로 리다이렉트하는 방식 사용
 */
export const useKakaoLogin = () => {
  const login = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      if (!baseUrl) {
        throw new Error('API base URL 미설정 (NEXT_PUBLIC_API_BASE_URL)')
      }

      // 백엔드가 카카오 OAuth 처리를 완료하고 성공 페이지로 리다이렉트
      // 성공 페이지에서 entities API를 통해 토큰 처리
      window.location.href = `${baseUrl}/auth/kakao`
    } catch (error) {
      const errorMsg = getErrorMessage(error) || 'Kakao 로그인 실패'
      toast.error(errorMsg)
    }
  }, [])

  return {
    login,
  }
}
