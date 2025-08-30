'use client'

import { signIn } from 'next-auth/react'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { getErrorMessage } from '@/shared/types/error'

/**
 * GitHub 소셜 로그인 액션 훅
 */
export const useGitHubLogin = () => {
  const login = useCallback(async () => {
    try {
      await signIn('github', { callbackUrl: '/project' })
    } catch (error) {
      const errorMsg = getErrorMessage(error) || 'GitHub 로그인 실패'
      toast.error(errorMsg)
    }
  }, [])

  return {
    login,
  }
}
