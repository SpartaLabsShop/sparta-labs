import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getPayloadUser } from '@/lib/auth/getPayloadUser'

export async function GET() {
  const user = await getPayloadUser()
  if (!user || !['admin', 'staff'].includes(user.role as string)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config: configPromise })

  try {
    // Run all counts in parallel for performance
    const [ordersRes, affiliatesRes, reviewsRes] = await Promise.all([
      payload.count({
        collection: 'orders',
        where: { status: { equals: 'pending' } },
        overrideAccess: true,
      }),
      payload.count({
        collection: 'affiliate-applications',
        where: { status: { equals: 'pending' } },
        overrideAccess: true,
      }),
      payload.count({
        collection: 'reviews',
        where: { status: { equals: 'pending' } },
        overrideAccess: true,
      }),
    ])

    return NextResponse.json({
      orders: ordersRes.totalDocs,
      affiliates: affiliatesRes.totalDocs,
      reviews: reviewsRes.totalDocs,
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}
