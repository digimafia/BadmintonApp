import { PlayerProfile, PlayerProfileFormValues } from '@/features/player/types/player.types'
import { calculateAge, calculateExperience, isPlayerProfileComplete } from '@/features/player/utils/profileHelpers'
import { generateId } from '@/utils/helpers'

// Mock player code generator
let mockPlayerCodeCounter = 1000 // start from 1000 so first is PLR001000

const generateMockPlayerCode = (): string => {
  mockPlayerCodeCounter++
  return `PLR${String(mockPlayerCodeCounter).padStart(6, '0')}`
}

// Mock delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const getPlayerProfile = async (): Promise<PlayerProfile | null> => {
  await delay(500)
  // In a real app, this would fetch from backend
  // For now, return null to indicate no profile exists
  return null
}

export const createPlayerProfile = async (formValues: PlayerProfileFormValues, userId: string, mobile: string): Promise<PlayerProfile> => {
  await delay(800)

  const { fullName, gender, dob, location, playingSince, regularPlayer, courtAcademy } = formValues

  // Calculate derived values
  const age = calculateAge(dob)
  const experienceYears = calculateExperience(playingSince)
  const playerCode = generateMockPlayerCode()

  const profile: PlayerProfile = {
    id: generateId(),
    playerCode,
    userId,
    fullName,
    gender,
    dob,
    age,
    mobile, // from auth state
    location,
    playingSince,
    experienceYears,
    regularPlayer: Boolean(regularPlayer), // ensure boolean
    courtAcademy: regularPlayer ? courtAcademy : null,
    profilePhoto: null, // Not stored in Phase 3
    profileStatus: isPlayerProfileComplete({
      id: '',
      playerCode,
      userId,
      fullName,
      dob,
      age,
      mobile,
      location,
      playingSince,
      experienceYears,
      regularPlayer: Boolean(regularPlayer),
      courtAcademy: regularPlayer ? courtAcademy : null,
      profilePhoto: null,
      profileStatus: 'ACTIVE', // placeholder, will be overwritten
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }) ? 'ACTIVE' : 'INCOMPLETE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  return profile
}

export const updatePlayerProfile = async (formValues: PlayerProfileFormValues, existingProfile: PlayerProfile): Promise<PlayerProfile> => {
  await delay(800)

  const { fullName, gender, dob, location, playingSince, regularPlayer, courtAcademy } = formValues

  // Calculate derived values
  const age = calculateAge(dob)
  const experienceYears = calculateExperience(playingSince)

  // Preserve immutable fields and update mutable ones
  const updatedProfile: PlayerProfile = {
    ...existingProfile, // copy all existing fields
    fullName,
    gender,
    dob,
    age,
    location,
    playingSince,
    experienceYears,
    regularPlayer: Boolean(regularPlayer), // ensure boolean
    courtAcademy: regularPlayer ? courtAcademy : null,
    profilePhoto: null, // Not stored in Phase 3
    profileStatus: isPlayerProfileComplete({
      ...existingProfile,
      fullName,
      dob,
      age,
      location,
      playingSince,
      experienceYears,
      regularPlayer: Boolean(regularPlayer),
      courtAcademy: regularPlayer ? courtAcademy : null,
      profilePhoto: null
    }) ? 'ACTIVE' : 'INCOMPLETE',
    updatedAt: new Date().toISOString()
  }

  return updatedProfile
}
