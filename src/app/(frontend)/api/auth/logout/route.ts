import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })

  // Explicitly clear the payload-token cookie
  response.cookies.set('payload-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  })

  return response
}
