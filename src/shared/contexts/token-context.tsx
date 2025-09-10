'use client'

import { useSession } from 'next-auth/react'
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface TokenContextValue {
  accessToken: string | null
  isTokenReady: boolean
}

const TokenContext = createContext<TokenContextValue | null>(null)

interface TokenProviderProps {
  children: ReactNode
}

export function TokenProvider({ children }: TokenProviderProps) {
  const { data: session, status } = useSession()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isTokenReady, setIsTokenReady] = useState(false)

  useEffect(() => {
    if (status === 'loading') {
      setIsTokenReady(false)
      return
    }

    // 세션이 있으면 토큰 설정, 없으면 null
    const token = session?.accessToken || null
    setAccessToken(token)
    setIsTokenReady(true)

    console.log('🔑 Token updated:', {
      hasToken: !!token,
      status,
      timestamp: new Date().toISOString(),
    })
  }, [session, status])

  // 토큰 업데이트 이벤트 리스너
  useEffect(() => {
    const handleTokenUpdate = (event: CustomEvent<{ accessToken: string }>) => {
      console.log('🔄 Token updated via event:', event.detail.accessToken)
      setAccessToken(event.detail.accessToken)
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
  }, [])

  return (
    <TokenContext.Provider value={{ accessToken, isTokenReady }}>
      {children}
    </TokenContext.Provider>
  )
}

export function useToken() {
  const context = useContext(TokenContext)
  if (!context) {
    throw new Error('useToken must be used within TokenProvider')
  }
  return context
}
