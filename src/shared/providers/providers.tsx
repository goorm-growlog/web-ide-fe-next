'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { swrConfig } from '@/shared/config/swr'
import { AuthProvider } from '@/shared/contexts/auth-context'

interface ProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => (
  <SessionProvider
    // 메인 브랜치 방식: 기본 설정 사용 (단순함)
    refetchInterval={0}
    refetchOnWindowFocus={false}
    refetchWhenOffline={false}
  >
    <SWRConfig value={swrConfig}>
      <AuthProvider>{children}</AuthProvider>
    </SWRConfig>
  </SessionProvider>
)
