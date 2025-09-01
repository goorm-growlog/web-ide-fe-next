'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/types/error'

/**
 * Kakao 소셜 로그인 액션 훅
 */
export const useKakaoLogin = () => {
  const login = useCallback(async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      if (!baseUrl) {
        throw new Error('API base URL 미설정 (NEXT_PUBLIC_API_BASE_URL)')
      }
      // 백엔드가 리다이렉트와 콜백 처리를 주도하도록 위임
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
