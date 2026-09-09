import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PlayerProfile } from '@/features/player/types/player.types'

const normalizeMobile = (mobile: string): string => {
  const digits = mobile.replace(/\D/g, '')
  if (digits.length > 10) {
    return digits.slice(-10)
  }
  return digits
}

interface PlayerDirectoryState {
  profiles: PlayerProfile[]
  upsertProfile: (profile: PlayerProfile) => void
  ensureDemoProfiles: () => void
  searchProfiles: (query: string) => PlayerProfile[]
  getProfileById: (id: string) => PlayerProfile | undefined
  getProfileByMobileExact: (mobile: string) => PlayerProfile | undefined
}

export const demoPlayerProfiles: PlayerProfile[] = [
  { id: 'demo-rizky', playerCode: 'PLR000101', userId: 'demo-rizky', fullName: 'Rizky Pratama', gender: 'MALE', dob: '1996-06-14', age: 28, mobile: '9876500001', location: 'Chennai, Tamil Nadu', playingSince: 2015, experienceYears: 10, regularPlayer: true, courtAcademy: 'Smash Arena', profilePhoto: null, profileStatus: 'ACTIVE', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
  { id: 'demo-arun', playerCode: 'PLR000102', userId: 'demo-arun', fullName: 'Arun Kumar', gender: 'MALE', dob: '1997-03-20', age: 27, mobile: '9876500002', location: 'Chennai, Tamil Nadu', playingSince: 2017, experienceYears: 8, regularPlayer: true, courtAcademy: 'Riverside Sports Center', profilePhoto: null, profileStatus: 'ACTIVE', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
  { id: 'demo-priya', playerCode: 'PLR000103', userId: 'demo-priya', fullName: 'Priya S', gender: 'FEMALE', dob: '1998-10-09', age: 26, mobile: '9876500003', location: 'Chennai, Tamil Nadu', playingSince: 2018, experienceYears: 7, regularPlayer: true, courtAcademy: 'Smash Arena', profilePhoto: null, profileStatus: 'ACTIVE', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
  { id: 'demo-vignesh', playerCode: 'PLR000104', userId: 'demo-vignesh', fullName: 'Vignesh R', gender: 'MALE', dob: '1995-01-24', age: 30, mobile: '9876500004', location: 'Chennai, Tamil Nadu', playingSince: 2014, experienceYears: 11, regularPlayer: false, courtAcademy: null, profilePhoto: null, profileStatus: 'ACTIVE', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
  { id: 'demo-sneha', playerCode: 'PLR000105', userId: 'demo-sneha', fullName: 'Sneha K', gender: 'FEMALE', dob: '1999-08-12', age: 25, mobile: '9876500005', location: 'Chennai, Tamil Nadu', playingSince: 2019, experienceYears: 6, regularPlayer: false, courtAcademy: null, profilePhoto: null, profileStatus: 'ACTIVE', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
  { id: 'demo-karthik', playerCode: 'PLR000106', userId: 'demo-karthik', fullName: 'Karthik M', gender: 'MALE', dob: '1994-11-02', age: 30, mobile: '9876500006', location: 'Chennai, Tamil Nadu', playingSince: 2013, experienceYears: 12, regularPlayer: true, courtAcademy: 'Velachery Courts', profilePhoto: null, profileStatus: 'ACTIVE', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
  { id: 'demo-divya', playerCode: 'PLR000107', userId: 'demo-divya', fullName: 'Divya R', gender: 'FEMALE', dob: '2000-04-28', age: 24, mobile: '9876500007', location: 'Chennai, Tamil Nadu', playingSince: 2020, experienceYears: 5, regularPlayer: false, courtAcademy: null, profilePhoto: null, profileStatus: 'ACTIVE', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
]

export const usePlayerDirectoryStore = create<PlayerDirectoryState>()(
  persist(
    (set, get) => ({
      profiles: [],
      ensureDemoProfiles: () => {
        set(state => {
          const existingIds = new Set(state.profiles.map(profile => profile.id))
          const missingProfiles = demoPlayerProfiles.filter(profile => !existingIds.has(profile.id))
          return missingProfiles.length ? { profiles: [...state.profiles, ...missingProfiles] } : state
        })
      },
      upsertProfile: (profile) => {
        set((state) => {
          const existingIndex = state.profiles.findIndex((p) => p.id === profile.id)
          if (existingIndex >= 0) {
            const newProfiles = [...state.profiles]
            newProfiles[existingIndex] = profile
            return { profiles: newProfiles }
          } else {
            return { profiles: [...state.profiles, profile] }
          }
        })
      },
      searchProfiles: (query) => {
        const { profiles } = get()
        if (!query) return []
        const lowerQuery = query.toLowerCase()
        return profiles.filter(
          (profile) =>
            profile.profileStatus === 'ACTIVE' &&
            (profile.fullName.toLowerCase().includes(lowerQuery) ||
              profile.playerCode.toLowerCase().includes(lowerQuery) ||
              profile.mobile.toLowerCase().includes(lowerQuery))
        )
      },
      getProfileById: (id) => {
        return get().profiles.find((p) => p.id === id)
      },
      getProfileByMobileExact: (mobile) => {
        const normalizedQuery = normalizeMobile(mobile)
        return get().profiles.find(
          (p) =>
            p.profileStatus === 'ACTIVE' && normalizeMobile(p.mobile) === normalizedQuery
        )
      },
    }),
    {
      name: 'badminton-player-directory'
    }
  )
)