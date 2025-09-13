'use client'

import { useCallback } from 'react'
import { toast } from 'sonner'
import { initiateKakaoAuth } from '@/features/auth/social-kakao/api/kakao-auth'
import { getErrorMessage } from '@/shared/types/error'

/**
 * Kakao 소셜 로그인 액션 훅
 */
export const useKakaoLogin = () => {
  const login = useCallback(async () => {
    try {
      await initiateKakaoAuth()
    } catch (error) {
      const errorMsg = getErrorMessage(error) || 'Kakao 로그인 실패'
      toast.error(errorMsg)
    }
  }, [])

  return {
    login,
  }
}
