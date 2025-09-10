'use client'

import { signIn } from 'next-auth/react'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { useLoadingState } from '@/shared/hooks/use-loading-state'
import { getErrorMessage } from '@/shared/types/error'

/**
 * GitHub 소셜 로그인 훅
 * NextAuth Provider를 사용하여 OAuth 처리
 * signIn 콜백에서 자동으로 백엔드 연동 및 토큰 저장됨
 */
export const useGitHubLogin = () => {
  const { isLoading, withLoading } = useLoadingState()

  const loginWithGitHub = useCallback(async () => {
    try {
      await signIn('github', {
        callbackUrl: '/project',
        redirect: true,
      })
    } catch (error) {
      const errorMessage = getErrorMessage(error) || 'GitHub 로그인 실패'
      toast.error(errorMessage)
    }
  }, [])

  return {
    loginWithGitHub: () => withLoading(loginWithGitHub),
    isLoading,
  }
}
