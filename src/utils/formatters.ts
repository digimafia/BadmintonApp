// Utility functions for formatting data
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString()
}
