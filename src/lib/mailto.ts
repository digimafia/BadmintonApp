export function buildMailto(to: string, subject: string, fields: Record<string, string>) {
  const body = Object.entries(fields)
    .filter(([, value]) => value && value.trim().length > 0)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')

  const params = new URLSearchParams({ subject, body })
  return `mailto:${to}?${params.toString().replace(/\+/g, '%20')}`
}
