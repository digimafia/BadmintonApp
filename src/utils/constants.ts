// Application constants
export const APP_NAME = 'Badminton Tournament Management Platform'
export const API_VERSION = 'v1'

// Role constants
export const ROLES = {
  PLAYER: 'PLAYER' as const,
  ORGANIZER: 'ORGANIZER' as const,
  ADMIN: 'ADMIN' as const
}

export type Role = typeof ROLES[keyof typeof ROLES]
