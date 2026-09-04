import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PlayerProfile } from '@/features/player/types/player.types'

interface PlayerProfileState {
  profile: PlayerProfile | null
  hasProfile: boolean
  createProfile: (profile: PlayerProfile) => void
  updateProfile: (profile: PlayerProfile) => void
  clearProfile: () => void
}

export const usePlayerProfileStore = create<PlayerProfileState>()(
  persist(
    (set) => ({
      profile: null,
      hasProfile: false,
      createProfile: (profile: PlayerProfile) => set({ profile, hasProfile: true }),
      updateProfile: (profile: PlayerProfile) => set({ profile }),
      clearProfile: () => set({ profile: null, hasProfile: false })
    }),
    {
      name: 'badminton-player-profile'
    }
  )
)
