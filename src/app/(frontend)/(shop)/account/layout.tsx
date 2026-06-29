import React from 'react'
import { Container } from '@/components/ui/container'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '700'] })

import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { getPayload } from 'payload'
import config from '@payload-config'

export const metadata = {
  title: 'My Account | Sparta Labs',
}

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getPayloadUser()
  const userName = user?.firstName || user?.email?.split('@')[0] || 'User'
  const maxxPoints = user?.maxxPoints || 0

  let affiliateStatus: 'none' | 'pending' | 'approved' | 'rejected' | 'suspended' = 'none'
  if (user) {
    const payload = await getPayload({ config })
    const { docs: affiliates } = await payload.find({
      collection: 'affiliates',
      where: { user: { equals: user.id } },
      limit: 1,
      overrideAccess: true,
    })
    if (affiliates.length > 0) {
      affiliateStatus = affiliates[0].status || 'pending'
    }
  }

  return (
    <div className="min-h-screen bg-white pt-24 lg:pt-28">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0 border-r border-gray-100 bg-[#FAFCFC]">
          <AccountSidebar userName={userName} maxxPoints={maxxPoints} affiliateStatus={affiliateStatus} />
        </div>
        <div className="flex-1 p-6 md:p-12 lg:p-16 bg-white">
          <div className="max-w-[1000px] mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
