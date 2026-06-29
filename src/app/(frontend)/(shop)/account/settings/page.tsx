import React from 'react'
import { SettingsClient } from './SettingsClient'
import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Account Settings | Sparta Labs',
}

export default async function SettingsPage() {
  const user = await getPayloadUser()
  if (!user) redirect('/login')

  const userData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || null,
  }

  return <SettingsClient user={userData} />
}
