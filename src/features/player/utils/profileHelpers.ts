import { PlayerProfile } from '@/features/player/types/player.types'

export const calculateAge = (dobString: string): number => {
  const dob = new Date(dobString)
  const today = new Date()

  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  return age
}

export const calculateExperience = (playingSince: number): number => {
  const currentYear = new Date().getFullYear()
  if (playingSince > currentYear) {
    return 0 // or throw? but we'll validate in form to not allow future
  }
  return currentYear - playingSince
}

export const isPlayerProfileComplete = (profile: PlayerProfile): boolean => {
  if (!profile.fullName || !profile.dob || !profile.mobile || !profile.location || profile.playingSince === null || profile.playingSince === undefined) {
    return false
  }
  if (profile.regularPlayer && (!profile.courtAcademy || profile.courtAcademy.trim() === '')) {
    return false
  }
  return true
}