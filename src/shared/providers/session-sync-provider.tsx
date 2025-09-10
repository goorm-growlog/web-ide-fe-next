'use client'

import { useSession } from 'next-auth/react'
import { type ReactNode, useEffect } from 'react'

interface SessionSyncProviderProps {
  children: ReactNode
}

/**
 * 세션 상태를 감지하고 토큰 변경 이벤트를 발생시키는 Provider
 * 메인 브랜치의 단순한 방식을 따름
 */
export function SessionSyncProvider({ children }: SessionSyncProviderProps) {
  const { data: session, status } = useSession()

  useEffect(() => {
    // 세션 상태가 로딩 중이 아닐 때만 이벤트 발생
    if (status === 'loading') return

    // 토큰 변경 이벤트 발생 (메인 브랜치 방식)
    const event = new CustomEvent('token-changed', {
      detail: {
        accessToken: session?.accessToken || null,
        isAuthenticated: !!session,
        status,
      },
    })

    window.dispatchEvent(event)
  }, [session, status])

  return <>{children}</>
}
