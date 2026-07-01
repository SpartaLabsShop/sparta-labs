'use client'

// Clears both auth systems: the legacy Payload cookie (set directly by the
// Google OAuth callback route) and the NextAuth session. Calling next-auth's
// signOut() alone leaves payload-token behind, so payload.auth() call sites
// keep treating the user as logged in after they sign out.
export async function signOutEverywhere(callbackUrl = '/') {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
  } catch {
    // Non-fatal: still proceed to clear the NextAuth session below.
  }
  const { signOut } = await import('next-auth/react')
  await signOut({ callbackUrl })
}
