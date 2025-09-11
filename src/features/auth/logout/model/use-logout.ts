'use client'

import { signOut } from 'next-auth/react'
import { useCallback } from 'react'
import { authApi } from '@/shared/api/ky-client'
import type { ApiResponse } from '@/shared/types/api'

export const useLogout = () => {
  const logout = useCallback(async () => {
    try {
      // 백엔드 로그아웃
      await authApi.post('auth/logout').json<ApiResponse<null>>()
    } catch {
      // 백엔드 실패해도 클라이언트 로그아웃은 진행
    }

    try {
      // NextAuth signOut - 메인 페이지로 리다이렉트
      await signOut({
        callbackUrl: '/',
        redirect: true,
      })
    } catch {
      // 수동 리다이렉트
      window.location.href = '/'
    }
  }, [])

  return { logout }
}
