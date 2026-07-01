import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/nextauth'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { User } from '@/payload-types'
import { cache } from 'react'

export const getPayloadUser = cache(async (): Promise<User | null> => {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.payloadUserId) return null

    const payload = await getPayload({ config })
    const user = await payload.findByID({
      collection: 'users',
      id: session.user.payloadUserId,
      overrideAccess: true,
    })
    return (user as User) || null
  } catch {
    return null
  }
})
