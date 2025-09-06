'use client'

import { signOut } from 'next-auth/react'
import { useCallback } from 'react'
import { mutate } from 'swr'
import { api, apiHelpers } from '@/shared/api/ky-client'
import type { ApiResponse } from '@/shared/types/api'

export const useLogout = () => {
  const logout = useCallback(async () => {
    try {
      // 1) 백엔드 로그아웃: Redis의 RefreshToken 제거 및 쿠키 삭제
      const response = await api.post('auth/logout').json<ApiResponse<null>>()
      apiHelpers.checkSuccess(response)
    } catch (_error) {
      // 서버 로그아웃 실패 시에도 클라이언트 세션 정리는 진행
    } finally {
      // 2) 로그아웃 시 모든 캐시 클리어
      mutate(() => true, undefined, { revalidate: false })

      // 3) NextAuth 세션 종료 및 리다이렉트
      await signOut({ callbackUrl: '/signin' })
    }
  }, [])

  return { logout }
}
