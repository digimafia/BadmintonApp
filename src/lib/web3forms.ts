export async function submitToWeb3Forms(
  accessKey: string | undefined,
  subject: string,
  fields: Record<string, string>,
): Promise<boolean> {
  if (!accessKey) return false
  try {
    const formData = new FormData()
    formData.append('access_key', accessKey)
    formData.append('subject', subject)
    for (const [key, value] of Object.entries(fields)) {
      formData.append(key, value)
    }

    // Deliberately no Content-Type header: letting the browser set the
    // multipart boundary keeps this a CORS "simple request" and avoids a
    // preflight — Web3Forms doesn't return CORS headers on the OPTIONS
    // preflight response, so a JSON body gets blocked by the browser.
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    })
    const data = await res.json().catch(() => null)
    return res.ok && data?.success === true
  } catch {
    return false
  }
}
