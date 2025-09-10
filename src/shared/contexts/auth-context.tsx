'use client'

import { createContext, type ReactNode, useContext } from 'react'
import { useAuthProvider } from '@/shared/hooks/use-auth-provider'
import type { User } from '@/shared/types/user'

interface AuthContextValue {
  user: User | undefined
  isLoading: boolean
  isAuthenticated: boolean
  isSocialLogin: boolean
  isCredentialsLogin: boolean
  provider: string | undefined
  userError: string | null
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

/**
 * 인증 상태를 전역으로 공유하는 Context Provider
 * 한 번만 useSession을 호출하여 모든 하위 컴포넌트에서 공유
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const authState = useAuthProvider()

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  )
}

/**
 * 인증 상태를 사용하는 훅 (기존 useAuthProvider 대체)
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
