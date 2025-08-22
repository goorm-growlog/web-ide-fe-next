import { useEffect } from 'react'
import { useAuthStore } from '@/shared/store/auth-store'

// 서버에서 토큰 검증 및 유저 정보 동기화 API
async function fetchUserInfo(token: string) {
  const res = await fetch('https://growlog-web-ide.duckdns.org/users/me', {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Invalid token')
  const body = await res.json()
  if (!body.success || !body.data) throw new Error('Invalid user')
  return {
    id: body.data.userId?.toString() ?? '',
    email: body.data.email,
    name: body.data.name,
  }
}

/**
 * 앱 진입/새로고침 시 localStorage에서 토큰을 읽고,
 * 서버에 토큰을 검증 요청하여 유저 정보를 동기화합니다.
 */
export const useAuthRestore = () => {
  const setAuth = useAuthStore(state => state.setAuth)
  const clearAuth = useAuthStore(state => state.clearAuth)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return clearAuth()
    fetchUserInfo(token)
      .then(user => {
        setAuth(token, user)
        localStorage.setItem('user', JSON.stringify(user))
      })
      .catch(() => {
        clearAuth()
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
      })
  }, [setAuth, clearAuth])
}
