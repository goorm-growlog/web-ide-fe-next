'use client'

import { useEffect } from 'react'
import { getUser } from '@/entities/users/api/get-user'
import { useAuthStore } from './store'

/**
 * 앱 진입/새로고침 시 쿠키 기반으로 인증 상태를 복원합니다.
 * localStorage에서 사용자 정보를 우선 복원하고, 서버 검증을 통해 동기화합니다.
 */
export const useAuthRestore = () => {
  const setAuth = useAuthStore(state => state.setAuth)
  const clearAuth = useAuthStore(state => state.clearAuth)

  useEffect(() => {
    // localStorage에서 사용자 정보 복원 시도
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setAuth(user)
      } catch {
        // JSON 파싱 실패 시 무시
      }
    }

    // 서버에서 실제 인증 상태 확인
    getUser()
      .then(user => {
        setAuth(user)
        localStorage.setItem('user', JSON.stringify(user))
      })
      .catch(() => {
        clearAuth()
        localStorage.removeItem('user')
      })
  }, [setAuth, clearAuth])
}
