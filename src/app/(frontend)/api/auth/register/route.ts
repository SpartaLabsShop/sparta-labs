import { NextRequest, NextResponse } from 'next/server'
import { verifyTurnstile } from '@/lib/turnstile'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sign as jwtSign } from 'jsonwebtoken'
import { registerLimiter, getIp } from '@/lib/ratelimit'

export async function POST(request: NextRequest) {
  if (registerLimiter) {
    const { success } = await registerLimiter.limit(getIp(request.headers))
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
    await payload.create({ collection: 'users', data: { email, password } })

    // Short-lived server-signed token that allows one auto-login without a second Turnstile
    const autoLoginToken = jwtSign(
      { email: email.toLowerCase(), sub: 'auto-login' },
      process.env.PAYLOAD_SECRET!,
      { expiresIn: '5m' },
    )

    return NextResponse.json({ success: true, autoLoginToken })
  } catch (err: any) {
    return NextResponse.json(
      { errors: [{ message: err.message || 'Could not create account.' }] },
      { status: 400 },
    )
  }
}
