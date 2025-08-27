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

  const saveAuth = (user: User, accessToken: string) => {
    setAuth(user, accessToken)
    tokenStorage.setUser(user)
    tokenStorage.setAccessToken(accessToken)
  }

  const login = async (email: string, password: string) => {
    const { user, accessToken } = await loginApi({ email, password })
    saveAuth(user, accessToken)
    return user
  }

  const logout = async () => {
    try {
      // 서버에 로그아웃 요청 (쿠키 삭제)
      await logoutApi()
    } catch {
      // 로그아웃 API 실패는 조용히 처리 (클라이언트 상태는 이미 정리됨)
    }

    // API 호출 성공 여부와 관계없이 클라이언트 상태는 정리
    clearAuth()
    tokenStorage.clearAll()
  }

  const refreshTokens = async () => {
    const newAccessToken = await refreshTokenApi()
    // Storage와 store 모두 업데이트
    tokenStorage.setAccessToken(newAccessToken)
    setAccessToken(newAccessToken)
    return newAccessToken
  }

  return { saveAuth, setAccessToken, login, logout, refreshTokens }
}
