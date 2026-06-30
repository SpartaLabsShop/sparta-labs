import { NextResponse } from 'next/server'
import { processPendingCommissions } from '@/lib/affiliates/processPending'

// Set standard max duration if you are on Vercel Pro/Enterprise, else default is usually fine
// export const maxDuration = 300; 

export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const result = await processPendingCommissions()
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error in CRON process-commissions:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
