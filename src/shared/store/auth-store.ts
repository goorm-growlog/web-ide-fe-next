import { create } from 'zustand'
import type { User } from '@/features/auth/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setAuth: (user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>(
  (set: (state: Partial<AuthState>) => void) => ({
    user: null,
    isAuthenticated: false,
    setAuth: (user: User) => set({ user, isAuthenticated: true }),
    clearAuth: () => set({ user: null, isAuthenticated: false }),
  }),
)
