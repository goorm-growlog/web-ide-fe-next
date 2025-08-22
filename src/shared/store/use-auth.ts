import type { User } from './auth-store'
import { useAuthStore } from './auth-store'

export function useAuthActions() {
  const setAuth = useAuthStore(state => state.setAuth)
  const clearAuth = useAuthStore(state => state.clearAuth)

  const saveAuth = (token: string, user: User) => {
    setAuth(token, user)
    localStorage.setItem('accessToken', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const logout = () => {
    clearAuth()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  return { saveAuth, logout }
}
