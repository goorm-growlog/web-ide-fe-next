'use client'

import { login as loginApi } from '@/features/auth/login/api/login'
import { logout as logoutApi } from '@/features/auth/logout/api/logout'
import { refreshToken as refreshTokenApi } from '@/features/auth/refresh/api/refresh'
import type { User } from '@/features/auth/types'
import { tokenStorage } from '@/shared/lib/token-storage'
import { useAuthStore } from './store'

/**
 * 인증 관련 액션들을 제공하는 훅
 */
export const useAuthActions = () => {
  const setAuth = useAuthStore(state => state.setAuth)
  const clearAuth = useAuthStore(state => state.clearAuth)
  const setAccessToken = useAuthStore(state => state.setAccessToken)

  const syncToStorage = (user: User | null, accessToken: string | null) => {
    if (user && accessToken) {
      tokenStorage.setUser(user)
      tokenStorage.setAccessToken(accessToken)
    } else {
      tokenStorage.clearAll()
    }
  }

  const saveAuth = (user: User, accessToken: string) => {
    setAuth(user, accessToken)
    syncToStorage(user, accessToken)
  }

  const login = async (email: string, password: string) => {
    const { user, accessToken } = await loginApi({ email, password })
    saveAuth(user, accessToken)
    return user
  }

  const logout = async () => {
    try {
      await logoutApi()
    } catch {
      // 로그아웃 API 실패는 조용히 처리
    }

    // 클라이언트 상태 정리 (스토어 + 스토리지)
    clearAuth()
    tokenStorage.clearAll()
  }

  const refreshTokens = async () => {
    const newAccessToken = await refreshTokenApi()
    setAccessToken(newAccessToken)
    tokenStorage.setAccessToken(newAccessToken)
    return newAccessToken
  }

  return { saveAuth, setAccessToken, login, logout, refreshTokens }
}
