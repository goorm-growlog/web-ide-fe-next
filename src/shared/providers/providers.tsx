'use client'

import { CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { SWRConfig } from 'swr'
import { AuthProvider } from '@/app/providers/auth-provider'
import { swrConfig } from '@/shared/config/swr'

interface ProvidersProps {
  children: ReactNode
}

// Material Design Icons를 위한 기본 테마 생성
const muiTheme = createTheme({
  typography: {
    fontWeightBold: 700,
  },
})

// 클라이언트 전용 CssBaseline 컴포넌트
const ClientOnlyCssBaseline = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return <CssBaseline />
}

export const Providers = ({ children }: ProvidersProps) => (
  <SessionProvider
    // 메인 브랜치 방식: 기본 설정 사용 (단순함)
    refetchInterval={0}
    refetchOnWindowFocus={false}
    refetchWhenOffline={false}
  >
    <SWRConfig value={swrConfig}>
      <ThemeProvider theme={muiTheme}>
        <ClientOnlyCssBaseline />
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </SWRConfig>
  </SessionProvider>
)
