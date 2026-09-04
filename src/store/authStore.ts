import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthState, Role } from '@/types/auth.types'

interface AuthStore extends AuthState {
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user: User) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false })
    }),
    {
      name: 'badminton-auth'
    }
  )
)
