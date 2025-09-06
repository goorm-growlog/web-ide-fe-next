'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

/**
 * 토큰 갱신 이벤트를 감지하여 NextAuth 세션을 동기화하는 훅
 * FSD: features/auth 레이어에서 인증 도메인 로직 관리
 */
export const useSessionSync = () => {
  const { update } = useSession()

  useEffect(() => {
    const handleTokenUpdate = (event: Event) => {
      const custom = event as CustomEvent<{ accessToken?: string }>
      const newToken = custom.detail?.accessToken
      if (!newToken) return

      void update({ accessToken: newToken })
    }

    window.addEventListener(
      'auth:access-token-updated',
      handleTokenUpdate as EventListener,
    )
    return () => {
      window.removeEventListener(
        'auth:access-token-updated',
        handleTokenUpdate as EventListener,
      )
    }
  }, [update])
}
