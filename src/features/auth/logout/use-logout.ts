'use client'

import { signOut } from 'next-auth/react'
import { useCallback } from 'react'
import { mutate } from 'swr'
import { logoutApi } from '@/entities/auth'
import { tokenManager } from '../lib/token-manager'

export const useLogout = () => {
  const logout = useCallback(async () => {
    try {
      // 1. 백엔드 로그아웃 API 호출 (현재 토큰으로)
      const currentToken = await tokenManager.getAccessToken()
      if (currentToken) {
        await logoutApi()
      }
    } catch (error) {
      console.warn('백엔드 로그아웃 실패:', error)
      // 백엔드 실패해도 클라이언트 정리는 진행
    } finally {
      // 2. 토큰 정리 (백엔드 중심)
      tokenManager.clearTokens()

      // 3. SWR 캐시 정리
      mutate(() => true, undefined, { revalidate: false })

      // 4. NextAuth 세션 종료
      try {
        await signOut({
          callbackUrl: '/signin',
          redirect: true,
        })
      } catch (error) {
        console.warn('NextAuth 로그아웃 실패:', error)
        // 수동 리다이렉트
        window.location.href = '/signin'
      }
    }
  }, [])

  return { logout }
}
