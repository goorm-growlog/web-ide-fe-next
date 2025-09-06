'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { swrConfig } from '@/shared/config/swr'

interface ProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => (
  <SessionProvider>
    <SWRConfig value={swrConfig}>{children}</SWRConfig>
  </SessionProvider>
)
