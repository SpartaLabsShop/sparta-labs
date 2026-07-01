import { NextRequest, NextResponse } from 'next/server'
import { verifyTurnstile } from '@/lib/turnstile'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cookies } from 'next/headers'
import { loginLimiter, getIp } from '@/lib/ratelimit'

export async function POST(request: NextRequest) {
  if (loginLimiter) {
    const { success } = await loginLimiter.limit(getIp(request.headers))
    if (!success) {
      return NextResponse.json(
        { errors: [{ message: 'Too many attempts. Please try again later.' }] },
        { status: 429 },
      )
    }
  }

  const body = await request.json()
  const { turnstileToken, email, password } = body

  const valid = await verifyTurnstile(turnstileToken)
  if (!valid) {
    return NextResponse.json(
      { errors: [{ message: 'Bot verification failed. Please try again.' }] },
      { status: 403 },
    )
  }

  try {
    const payload = await getPayload({ config })
    const result = await payload.login({ collection: 'users', data: { email, password } })

    const cookieStore = await cookies()
    cookieStore.set('payload-token', result.token as string, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ user: result.user })
  } catch (err: any) {
    return NextResponse.json(
      { errors: [{ message: err.message || 'Invalid email or password.' }] },
      { status: 401 },
    )
  }
}
