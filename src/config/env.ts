const getApiBaseUrl = (): string => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  if (!apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is not defined')
  }
  return apiBaseUrl
}

export { getApiBaseUrl }
export type { } // Export to make it a module
