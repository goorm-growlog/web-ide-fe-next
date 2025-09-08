'use client'

import { signOut } from 'next-auth/react'
import { useCallback } from 'react'
import { authApi } from '@/shared/api/ky-client'
import type { ApiResponse } from '@/shared/types/api'

export const useLogout = () => {
  const logout = useCallback(async () => {
    // 백엔드 로그아웃 (비동기로 실행하되 기다리지 않음)
    authApi
      .post('auth/logout')
      .json<ApiResponse<null>>()
      .catch(() => void 0) // 의도적으로 에러 무시

    // 즉시 리다이렉트
    await signOut({ callbackUrl: '/signin', redirect: true })
  }, [])

  return { logout }
}
