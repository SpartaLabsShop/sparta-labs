import { NextRequest, NextResponse } from 'next/server'
import { verifyTurnstile } from '@/lib/turnstile'
import { getPayload } from 'payload'
import config from '@payload-config'
import { passwordResetLimiter, getIp } from '@/lib/ratelimit'

export async function POST(request: NextRequest) {
  if (passwordResetLimiter) {
    const { success } = await passwordResetLimiter.limit(getIp(request.headers))
    if (!success) {
      return NextResponse.json(
        { errors: [{ message: 'Too many attempts. Please try again later.' }] },
        { status: 429 },
      )
    }
  }

  const body = await request.json()
  const { turnstileToken, email } = body

  const valid = await verifyTurnstile(turnstileToken)
  if (!valid) {
    return NextResponse.json(
      { errors: [{ message: 'Bot verification failed. Please try again.' }] },
      { status: 403 },
    )
  }

  try {
    const payload = await getPayload({ config })
    await payload.forgotPassword({ collection: 'users', data: { email } })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { errors: [{ message: err.message || 'Something went wrong.' }] },
      { status: 400 },
    )
  }
}
