'use client'

import { signOut } from 'next-auth/react'
import { useCallback } from 'react'
import { logoutApi } from '@/entities/auth'

export const useLogout = () => {
  const logout = useCallback(async () => {
    try {
      // 1) 백엔드 로그아웃: Redis의 RefreshToken 제거 및 쿠키 삭제
      await logoutApi()
    } catch (_error) {
      // 서버 로그아웃 실패 시에도 클라이언트 세션 정리는 진행
    }

    // 2) NextAuth 세션 종료 및 리다이렉트 (캐시 클리어 없이 바로 리다이렉트)
    await signOut({
      callbackUrl: '/signin',
    })

    // signOut은 리다이렉트를 수행하므로 이후 코드는 실행되지 않음
    // SWR 캐시는 새로운 페이지에서 자연스럽게 초기화됨
  }, [])

  return { logout }
}
