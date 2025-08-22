import { create } from 'zustand'

export interface User {
  id: string
  email: string
  name?: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>(
  (set: (state: Partial<AuthState>) => void) => ({
    token: null,
    user: null,
    isAuthenticated: false,
    setAuth: (token: string, user: User) =>
      set({ token, user, isAuthenticated: true }),
    clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
  }),
)
