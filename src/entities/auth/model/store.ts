'use client'

import { create } from 'zustand'
import type { User } from '@/features/auth/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isRestored: boolean
  setAuth: (user: User, accessToken: string) => void
  setAccessToken: (accessToken: string | null) => void
  markRestored: () => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isRestored: false,
  setAuth: (user: User, accessToken: string) =>
    set({ user, accessToken, isAuthenticated: true }),
  setAccessToken: (accessToken: string | null) =>
    set({ accessToken, isAuthenticated: Boolean(accessToken) }),
  markRestored: () => set({ isRestored: true }),
  clearAuth: () =>
    set({ user: null, accessToken: null, isAuthenticated: false }),
}))
