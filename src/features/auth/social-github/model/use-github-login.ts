'use client'

import { signIn } from 'next-auth/react'
import { useCallback, useEffect } from 'react'
import { toast } from 'sonner'

/**
 * GitHub 소셜 로그인 액션 훅
 */
export const useGitHubLogin = () => {
  // URL 파라미터에서 에러 감지
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')

    if (error === 'AccessDenied') {
      toast.error('fail to github login.')
      // URL에서 에러 파라미터 제거
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('error')
      window.history.replaceState({}, '', newUrl.pathname)
    }
  }, [])

  const login = useCallback(async () => {
    // 일반적인 NextAuth 리디렉션 방식 사용
    await signIn('github', {
      callbackUrl: '/project',
    })
  }, [])

  return { login }
}
