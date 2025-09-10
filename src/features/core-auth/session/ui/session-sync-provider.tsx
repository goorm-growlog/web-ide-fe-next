'use client'

import { memo, type ReactNode } from 'react'
import { useSessionSync } from '../model/use-session-sync'

interface SessionSyncProviderProps {
  children: ReactNode
}

/**
 * 세션 동기화 기능을 제공하는 Provider
 * FSD: 인증 기능에 특화된 UI 레이어
 *
 * 토큰 갱신 이벤트를 감지하여 NextAuth 세션을 자동으로 동기화합니다.
 * React.memo로 최적화하여 불필요한 리렌더링 방지
 */
export const SessionSyncProvider = memo(
  ({ children }: SessionSyncProviderProps) => {
    useSessionSync() // 세션 동기화 훅 실행
    return <>{children}</>
  },
)

SessionSyncProvider.displayName = 'SessionSyncProvider'
