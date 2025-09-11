'use client'

import { useSession } from 'next-auth/react'

/**
 * 사용자의 로그인 방식을 확인하는 공통 훅
 * shared 레이어에서 NextAuth 의존성 관리
 */
export const useAuthProvider = () => {
  const { data: session, status } = useSession()

  const provider = session?.provider as
    | 'github'
    | 'kakao'
    | 'credentials'
    | undefined
  const isSocialLogin = provider === 'github' || provider === 'kakao'
  const isCredentialsLogin = provider === 'credentials'

  return {
    provider,
    isSocialLogin,
    isCredentialsLogin,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  }
}
