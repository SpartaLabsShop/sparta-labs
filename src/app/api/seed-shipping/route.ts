import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getPayloadUser } from '@/lib/auth/getPayloadUser'

export async function GET() {
  const user = await getPayloadUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config: configPromise })

  const existing = await payload.find({
    collection: 'shippingzones',
    where: { name: { equals: 'Domestic (US Only)' } },
    overrideAccess: true,
  })

  if (existing.totalDocs === 0) {
    await payload.create({
      collection: 'shippingzones',
      data: {
        name: 'Domestic (US Only)',
        methods: [
          { method: 'Standard Shipping', price: 500, estimatedDays: 5 },
          { method: 'Express Shipping', price: 1500, estimatedDays: 2 }
        ]
      },
      overrideAccess: true,
    })
    return NextResponse.json({ success: true, message: 'Seeded Domestic US shipping zone' })
  } else {
    return NextResponse.json({ success: true, message: 'Shipping zone already exists' })
  }
}
