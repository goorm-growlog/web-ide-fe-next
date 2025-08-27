import type { User } from '@/features/auth/types'

/**
 * 토큰 및 사용자 정보 localStorage 관리 유틸리티
 * SSR 안전성을 고려한 중앙화된 스토리지 관리
 */
export const tokenStorage = {
  // AccessToken 관리
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('accessToken')
  },

  setAccessToken: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem('accessToken', token)
  },

  removeAccessToken: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('accessToken')
  },

  // User 정보 관리
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const userRaw = localStorage.getItem('user')
    if (!userRaw) return null

    try {
      return JSON.parse(userRaw) as User
    } catch {
      return null
    }
  },

  setUser: (user: User): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem('user', JSON.stringify(user))
  },

  removeUser: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('user')
  },

  // 전체 클리어
  clearAll: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  },
}
