/*
 * Who has signed in to the private preview, remembered per browser. The credentials are kept as a
 * SHA-256 hash of "<access id, lower-case>:<password>". Front-end only: see Gate.tsx.
 */
export const ACCESS_HASH = '3edd8af052e2eeff27ceeb7e6aaea4d65ffcb75776a285e3945d4d5ec49ba13c'
const STORE_KEY = 'trahdo-preview-access'
export const SIGN_OUT_EVENT = 'trahdo:sign-out'

export function hasAccess() {
  try {
    return localStorage.getItem(STORE_KEY) === ACCESS_HASH
  } catch {
    return false
  }
}

export function grantAccess() {
  try {
    localStorage.setItem(STORE_KEY, ACCESS_HASH)
  } catch {
    /* private window: access lasts for this visit only */
  }
}

/** Forgets this browser's access and sends the visitor back to the sign-in page. */
export function signOut() {
  try {
    localStorage.removeItem(STORE_KEY)
  } catch {
    /* nothing stored */
  }
  window.dispatchEvent(new Event(SIGN_OUT_EVENT))
}

export async function digest(id: string, password: string) {
  const bytes = new TextEncoder().encode(`${id.trim().toLowerCase()}:${password}`)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
