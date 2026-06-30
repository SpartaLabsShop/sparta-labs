import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const redirectTo = searchParams.get('redirect') || '/account'

  const state = crypto.randomBytes(32).toString('hex')
  const statePayload = JSON.stringify({ token: state, redirect: redirectTo })
  const encodedState = Buffer.from(statePayload).toString('base64url')

  const origin = process.env.NEXT_PUBLIC_SERVER_URL || new URL(request.url).origin
  const callbackUrl = `${origin}/api/auth/google/callback`

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: 'openid email profile',
    state: encodedState,
    access_type: 'offline',
    prompt: 'select_account',
  })

  const response = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`, { status: 302 })
  response.cookies.set('google_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })

  return response
}
