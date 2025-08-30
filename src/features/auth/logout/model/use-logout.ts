'use client'

import { signOut } from 'next-auth/react'
import { useCallback } from 'react'

export const useLogout = () => {
  const logout = useCallback(async () => {
    // NextAuth signOut이 모든 정리 작업을 처리
    // - 클라이언트 세션 정리
    // - JWT 토큰 무효화
    // - 리다이렉트
    await signOut({ callbackUrl: '/signin' })
  }, [])

  return { logout }
}
