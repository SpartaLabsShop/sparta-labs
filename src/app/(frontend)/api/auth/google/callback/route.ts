import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import type { User } from '@/payload-types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const stateParam = searchParams.get('state')
  const error = searchParams.get('error')
  const origin = process.env.NEXT_PUBLIC_SERVER_URL || new URL(request.url).origin

  if (error) {
    return NextResponse.redirect(new URL('/login?error=google_denied', origin), { status: 302 })
  }

  if (!code || !stateParam) {
    return NextResponse.redirect(new URL('/login?error=google_missing_params', origin), { status: 302 })
  }

  const cookieStore = await cookies()
  const storedState = cookieStore.get('google_oauth_state')?.value

  let redirectTo = '/account'
  try {
    const outer = JSON.parse(Buffer.from(stateParam, 'base64url').toString())

    // Verify HMAC signature to prevent state tampering and open redirects
    const expectedSig = crypto
      .createHmac('sha256', process.env.PAYLOAD_SECRET || '')
      .update(outer.d)
      .digest('hex')
    if (outer.s !== expectedSig) {
      return NextResponse.redirect(new URL('/login?error=google_state_invalid', origin), { status: 302 })
    }

    const statePayload = JSON.parse(outer.d)
    if (!storedState || statePayload.token !== storedState) {
      return NextResponse.redirect(new URL('/login?error=google_state_mismatch', origin), { status: 302 })
    }

    // Restrict redirect to relative paths to prevent open redirect attacks
    const rawRedirect = statePayload.redirect || '/account'
    redirectTo = rawRedirect.startsWith('/') ? rawRedirect : '/account'
  } catch {
    return NextResponse.redirect(new URL('/login?error=google_state_invalid', origin), { status: 302 })
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/login?error=google_not_configured', origin), { status: 302 })
  }

  const callbackUrl = `${origin}/api/auth/google/callback`

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) {
      console.error('Google token exchange failed')
      return NextResponse.redirect(new URL('/login?error=google_token_exchange', origin), { status: 302 })
    }

    const tokens = await tokenRes.json()

    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    if (!userInfoRes.ok) {
      return NextResponse.redirect(new URL('/login?error=google_userinfo', origin), { status: 302 })
    }

    const googleUser = await userInfoRes.json()
    const { id: googleId, email, given_name: firstName, family_name: lastName, picture: avatarUrl } = googleUser

    if (!email) {
      return NextResponse.redirect(new URL('/login?error=google_no_email', origin), { status: 302 })
    }

    const payload = await getPayload({ config })
    const collectionConfig = payload.collections['users'].config
    const tokenExpiration = collectionConfig.auth.tokenExpiration

    // Issue a session JWT without needing to know the user's password.
    // This is safe because the user was just verified by Google.
    function issueToken(userId: number | string, userEmail: string): string {
      return jwt.sign(
        { id: userId, email: userEmail, collection: 'users' },
        process.env.PAYLOAD_SECRET as string,
        { expiresIn: tokenExpiration },
      )
    }

    let user: User | null = null
    let loginToken: string | null = null

    const byGoogleId = await payload.find({
      collection: 'users',
      where: { googleId: { equals: googleId } },
      limit: 1,
    })

    if (byGoogleId.docs.length > 0) {
      // Returning Google user — update avatar only, never touch password
      const existing = byGoogleId.docs[0]
      if (avatarUrl && (existing as any).avatarUrl !== avatarUrl) {
        await payload.update({
          collection: 'users',
          id: existing.id,
          data: { avatarUrl },
          overrideAccess: true,
        })
      }
      user = existing as User
      loginToken = issueToken(user.id, user.email)
    } else {
      const byEmail = await payload.find({
        collection: 'users',
        where: { email: { equals: email.toLowerCase() } },
        limit: 1,
      })

      if (byEmail.docs.length > 0) {
        // Existing email/password account — link Google ID without overwriting password
        user = await payload.update({
          collection: 'users',
          id: byEmail.docs[0].id,
          data: {
            googleId,
            authProvider: 'google',
            emailVerified: true,
            ...(firstName && !byEmail.docs[0].firstName ? { firstName } : {}),
            ...(lastName && !byEmail.docs[0].lastName ? { lastName } : {}),
            ...(avatarUrl ? { avatarUrl } : {}),
          },
          overrideAccess: true,
        }) as User
        loginToken = issueToken(user.id, user.email)
      } else {
        // Brand-new Google user — create with temp password, use payload.login() for the token
        const tempPassword = crypto.randomBytes(32).toString('base64') + '!A1a'
        user = await payload.create({
          collection: 'users',
          data: {
            email: email.toLowerCase(),
            password: tempPassword,
            firstName: firstName || '',
            lastName: lastName || '',
            googleId,
            authProvider: 'google',
            emailVerified: true,
            role: 'customer',
            ...(avatarUrl ? { avatarUrl } : {}),
          },
          overrideAccess: true,
        }) as User
        const loginResult = await payload.login({
          collection: 'users',
          data: { email: user.email, password: tempPassword },
        })
        loginToken = loginResult.token || null
      }
    }

    if (!user || !loginToken) {
      return NextResponse.redirect(new URL('/login?error=google_server_error', origin), { status: 302 })
    }

    const redirectUrl = new URL(`/auth-redirect?to=${encodeURIComponent(redirectTo)}`, origin)
    const response = NextResponse.redirect(redirectUrl, { status: 302 })

    response.cookies.set('payload-token', loginToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(Date.now() + tokenExpiration * 1000),
    })

    response.cookies.delete('google_oauth_state')

    return response
  } catch (err) {
    console.error('Google OAuth error')
    return NextResponse.redirect(new URL('/login?error=google_server_error', origin), { status: 302 })
  }
}
