import React from 'react'
import { AddressesClient, AddressItem } from './AddressesClient'
import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Saved Addresses | Sparta Labs',
}

export default async function AddressesPage() {
  const user = await getPayloadUser()
  if (!user) redirect('/login')

  const payload = await getPayload({ config })

  const { docs: addresses } = await payload.find({
    collection: 'addresses',
    where: { user: { equals: user.id } },
    sort: '-updatedAt',
    overrideAccess: true,
  })

  const addressItems: AddressItem[] = addresses.map(addr => ({
    id: String(addr.id),
    firstName: addr.firstName,
    lastName: addr.lastName,
    line1: addr.line1,
    line2: addr.line2,
    city: addr.city,
    state: addr.state,
    postalCode: addr.postalCode,
    country: addr.country,
    phone: addr.phone,
    isDefault: addr.isDefaultShipping || false,
  }))

  return <AddressesClient addresses={addressItems} />
}
