'use client'

import { useEffect } from 'react'
import { tokenStorage } from '@/shared/lib/token-storage'
import { useAuthStore } from './store'

/**
 * 앱 진입/새로고침 시 LocalStorage에서 인증 상태를 복원합니다.
 */
export const useAuthRestore = () => {
  const setAuth = useAuthStore(state => state.setAuth)
  const clearAuth = useAuthStore(state => state.clearAuth)
  const markRestored = useAuthStore(state => state.markRestored)

  useEffect(() => {
    const restore = async () => {
      const storedUser = tokenStorage.getUser()
      const accessToken = tokenStorage.getAccessToken()

      // accessToken이 있으면 인증 상태 복원
      if (storedUser && accessToken) {
        setAuth(storedUser, accessToken)
      } else {
        clearAuth()
        tokenStorage.clearAll()
      }

      markRestored()
    }

    void restore()
  }, [setAuth, clearAuth, markRestored])
}
