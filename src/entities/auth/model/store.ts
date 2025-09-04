'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/shared/types/user'

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, accessToken: string) => void
  setAccessToken: (accessToken: string | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user: User, accessToken: string) =>
        set({ user, accessToken, isAuthenticated: true }),
      setAccessToken: (accessToken: string | null) =>
        set({ accessToken, isAuthenticated: Boolean(accessToken) }),
      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
      }), // 필요한 부분만 persist
    },
  ),
)
