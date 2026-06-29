import React from 'react'
import { redirect } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { AffiliateSidebar } from '@/components/affiliates/AffiliateSidebar'
import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { getPayload } from 'payload'
import config from '@payload-config'

export const metadata = {
  title: 'Affiliate Dashboard | Sparta Labs',
}

export default async function AffiliateDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getPayloadUser()
  if (!user) redirect('/login')

  const payload = await getPayload({ config })
  
  // Fetch Affiliate Data
  const { docs: affiliates } = await payload.find({
    collection: 'affiliates',
    where: { user: { equals: user.id } },
    limit: 1,
    overrideAccess: true,
  })

  // If no affiliate record or not approved, redirect to apply
  if (affiliates.length === 0 || affiliates[0].status !== 'approved') {
    redirect('/affiliates')
  }

  const affiliate = affiliates[0]
  const userName = affiliate.displayName || user?.firstName || user?.email?.split('@')[0] || 'Partner'
  const tier = affiliate.tier || 'standard'

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0 border-r border-gray-100 bg-[#FAFCFC]">
          <AffiliateSidebar userName={userName} tier={tier} />
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
