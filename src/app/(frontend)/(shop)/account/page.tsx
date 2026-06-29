import React from 'react'
import { AccountOverviewClient } from './AccountOverviewClient'
import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import type { Order, Address } from '@/payload-types'

export const metadata = {
  title: 'Account Overview | Sparta Labs',
}

export default async function AccountOverviewPage() {
  const user = await getPayloadUser()
  if (!user) redirect('/login')

  const payload = await getPayload({ config })

  // 1. Fetch Orders
  const { docs: orders, totalDocs: ordersPlaced } = await payload.find({
    collection: 'orders',
    where: { owner: { equals: user.id } },
    sort: '-createdAt',
    limit: 3, // Recent orders
    overrideAccess: true,
  })

  // 2. Fetch Wishlist count
  const { docs: wishlists } = await payload.find({
    collection: 'wishlists',
    where: { user: { equals: user.id } },
    limit: 1,
    overrideAccess: true,
  })
  const wishlistCount = wishlists[0]?.items?.length || 0

  // 3. Fetch Default Address
  const { docs: addresses } = await payload.find({
    collection: 'addresses',
    where: { user: { equals: user.id } },
    sort: '-updatedAt',
    overrideAccess: true,
  })
  
  const defaultAddressDoc = addresses.find(a => a.isDefaultShipping) || addresses[0] || null

  // 4. Fetch Affiliate Status
  const { docs: affiliates } = await payload.find({
    collection: 'affiliates',
    where: { user: { equals: user.id } },
    limit: 1,
    overrideAccess: true,
  })
  const affiliateStatus = affiliates.length > 0 ? (affiliates[0].status || 'pending') : 'none'

  const stats = {
    ordersPlaced,
    wishlistCount,
    maxxPoints: user.maxxPoints || 0,
    memberSince: new Date(user.createdAt).getFullYear().toString()
  }

  // Map to simple types for client component to keep it clean
  const recentOrders = orders.map(order => ({
    id: String(order.id), // Payload IDs can be number or string, we convert to string for safety in URLs
    orderNumber: order.orderNumber || String(order.id),
    date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: order.status,
    total: order.total
  }))

  const defaultAddress = defaultAddressDoc ? {
    name: `${defaultAddressDoc.firstName} ${defaultAddressDoc.lastName}`,
    street: `${defaultAddressDoc.line1}${defaultAddressDoc.line2 ? `, ${defaultAddressDoc.line2}` : ''}`,
    city: defaultAddressDoc.city,
    state: defaultAddressDoc.state,
    zip: defaultAddressDoc.postalCode,
    country: defaultAddressDoc.country,
  } : null

  return (
    <AccountOverviewClient 
      stats={stats} 
      recentOrders={recentOrders} 
      defaultAddress={defaultAddress} 
      affiliateStatus={affiliateStatus}
    />
  )
}
