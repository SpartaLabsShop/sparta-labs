import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import crypto from 'crypto'
import type { User } from '@/payload-types'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const stateParam = searchParams.get('state')
  const error = searchParams.get('error')
  const origin = new URL(request.url).origin

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
    const statePayload = JSON.parse(Buffer.from(stateParam, 'base64url').toString())
    if (!storedState || statePayload.token !== storedState) {
      return NextResponse.redirect(new URL('/login?error=google_state_mismatch', origin), { status: 302 })
    }
    redirectTo = statePayload.redirect || '/account'
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
      console.error('Google token exchange failed:', await tokenRes.text())
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
    const { id: googleId, email, given_name: firstName, family_name: lastName } = googleUser

    if (!email) {
      return NextResponse.redirect(new URL('/login?error=google_no_email', origin), { status: 302 })
    }

    const payload = await getPayload({ config })
    const tempPassword = crypto.randomBytes(32).toString('base64') + '!A1a'

    let user: User | null = null

    const byGoogleId = await payload.find({
      collection: 'users',
      where: { googleId: { equals: googleId } },
      limit: 1,
    })

    if (byGoogleId.docs.length > 0) {
      user = await payload.update({
        collection: 'users',
        id: byGoogleId.docs[0].id,
        data: { password: tempPassword },
        overrideAccess: true,
      })
    } else {
      const byEmail = await payload.find({
        collection: 'users',
        where: { email: { equals: email.toLowerCase() } },
        limit: 1,
      })

      if (byEmail.docs.length > 0) {
        user = await payload.update({
          collection: 'users',
          id: byEmail.docs[0].id,
          data: {
            password: tempPassword,
            googleId,
            authProvider: 'google',
            emailVerified: true,
            ...(firstName && !byEmail.docs[0].firstName ? { firstName } : {}),
            ...(lastName && !byEmail.docs[0].lastName ? { lastName } : {}),
          },
          overrideAccess: true,
        })
      } else {
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
          },
          overrideAccess: true,
        })
      }
    }

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=google_server_error', origin), { status: 302 })
    }

    const loginResult = await payload.login({
      collection: 'users',
      data: { email: user.email, password: tempPassword },
    })

    if (!loginResult.token) {
      return NextResponse.redirect(new URL('/login?error=google_login_failed', origin), { status: 302 })
    }

    const redirectUrl = new URL(redirectTo, origin)
    const response = NextResponse.redirect(redirectUrl, { status: 302 })

    const collectionConfig = payload.collections['users'].config
    const tokenExpiration = collectionConfig.auth.tokenExpiration

    response.cookies.set('payload-token', loginResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: new Date(Date.now() + tokenExpiration * 1000),
    })

    response.cookies.delete('google_oauth_state')

    return response
  } catch (err) {
    console.error('Google OAuth error:', err)
    return NextResponse.redirect(new URL('/login?error=google_server_error', origin), { status: 302 })
  }
}
