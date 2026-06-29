import React from 'react'
import { OrderDetailClient } from './OrderDetailClient'
import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound, redirect } from 'next/navigation'

export const metadata = {
  title: 'Order Details | Sparta Labs',
}

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const user = await getPayloadUser()
  if (!user) redirect('/login?redirect=/account/orders/' + id)

  const payload = await getPayload({ config })
  
  let order;
  try {
    const { docs } = await payload.find({
      collection: 'orders',
      where: {
        orderNumber: { equals: id }
      },
      depth: 2,
      overrideAccess: true,
    })

    if (docs.length > 0) {
      order = docs[0]
    } else {
      const numericId = parseInt(id, 10)
      order = await payload.findByID({
        collection: 'orders',
        id: isNaN(numericId) ? id : numericId,
        depth: 2,
        overrideAccess: true,
      })
    }
  } catch (error) {
    return notFound()
  }

  if (!order) return notFound()

  // Verify ownership
    const ownerId = typeof order.owner === 'object' ? order.owner?.id : order.owner
    if (ownerId !== user.id && order.guestEmail !== user.email) {
      return notFound()
    }

    return <OrderDetailClient order={order} />
}
