import React from 'react'
import { OrdersClient, OrderItem } from './OrdersClient'
import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Order History | Sparta Labs',
}

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const user = await getPayloadUser()
  if (!user) redirect('/login')

  const payload = await getPayload({ config })

  const { docs: orders } = await payload.find({
    collection: 'orders',
    where: {
      or: [
        { owner: { equals: user.id } },
        { guestEmail: { equals: user.email } }
      ]
    },
    sort: '-createdAt',
    limit: 100, // Fetch up to 100 orders
    overrideAccess: true,
  })

  const orderItems: OrderItem[] = orders.map(order => ({
    id: order.orderNumber || String(order.id),
    date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: order.status,
    total: order.total,
    itemCount: order.items?.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) || 0
  }))

  return <OrdersClient orders={orderItems} />
}
