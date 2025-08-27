'use client'

import { useEffect } from 'react'
import type { User } from '@/features/auth/types'
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
      const storedUserRaw = localStorage.getItem('user')
      const accessToken = localStorage.getItem('accessToken')

      let storedUser: User | null = null
      if (storedUserRaw) {
        try {
          storedUser = JSON.parse(storedUserRaw) as User
        } catch {
          storedUser = null
        }
      }

      // accessToken이 있으면 인증 상태 복원
      if (storedUser && accessToken) {
        setAuth(storedUser, accessToken)
      } else {
        clearAuth()
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
      }

      markRestored()
    }

    void restore()
  }, [setAuth, clearAuth, markRestored])
}
