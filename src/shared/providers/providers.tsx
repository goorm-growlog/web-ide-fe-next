'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => (
  <SessionProvider>{children}</SessionProvider>
)
