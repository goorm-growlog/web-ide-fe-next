'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

interface ProvidersProps {
  children: ReactNode
}

function SessionSyncListener() {
  const { update } = useSession()

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ accessToken?: string }>
      const newToken = custom.detail?.accessToken
      if (!newToken) return
      // NextAuth 세션에 accessToken만 부분 업데이트
      void update({ accessToken: newToken })
    }

    window.addEventListener(
      'auth:access-token-updated',
      handler as EventListener,
    )
    return () => {
      window.removeEventListener(
        'auth:access-token-updated',
        handler as EventListener,
      )
    }
  }, [update])

  return null
}

export const Providers = ({ children }: ProvidersProps) => (
  <SessionProvider>
    <SessionSyncListener />
    {children}
  </SessionProvider>
)
