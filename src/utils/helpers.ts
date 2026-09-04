// Utility helper functions
export const isAuthenticated = (): boolean => {
  // This would check auth state in a real implementation
  // For now, returning false as placeholder
  return false
}

export const getUserRole = (): 'PLAYER' | 'ORGANIZER' | 'ADMIN' | null => {
  // This would get role from auth state in a real implementation
  // For now, returning null as placeholder
  return null
}

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}
