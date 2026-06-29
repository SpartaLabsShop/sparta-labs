import React from 'react'
import { redirect } from 'next/navigation'
import { DashboardClient } from './DashboardClient'
import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { getPayload } from 'payload'
import config from '@payload-config'

export const metadata = {
  title: 'Affiliate Dashboard | Sparta Labs',
}

export default async function AffiliateDashboardOverview() {
  const user = await getPayloadUser()
  if (!user) redirect('/login')

  const payload = await getPayload({ config })
  
  // 1. Fetch Affiliate Record
  const { docs: affiliates } = await payload.find({
    collection: 'affiliates',
    where: { user: { equals: user.id } },
    limit: 1,
    overrideAccess: true,
  })

  if (affiliates.length === 0 || affiliates[0].status !== 'approved') {
    redirect('/affiliates')
  }

  const affiliate = affiliates[0]

  // 2. Fetch Recent Conversions
  const { docs: conversions } = await payload.find({
    collection: 'affiliate-conversions',
    where: { affiliate: { equals: affiliate.id } },
    sort: '-createdAt',
    limit: 5,
    overrideAccess: true,
  })

  // 3. Format Stats
  const stats = {
    totalClicks: affiliate.totalClicks || 0,
    totalConversions: affiliate.totalConversions || 0,
    conversionRate: affiliate.totalClicks ? `${((affiliate.totalConversions || 0) / affiliate.totalClicks * 100).toFixed(1)}%` : '0.0%',
    totalCommissionPending: affiliate.totalCommissionPending || 0,
    totalCommissionApproved: affiliate.totalCommissionApproved || 0,
    totalCommissionPaid: affiliate.totalCommissionPaid || 0,
    referralSlug: affiliate.referralSlug || '',
    couponCode: affiliate.couponCode || '',
  }

  // 4. Format Recent Conversions
  const recentConversions = conversions.map(conv => ({
    id: String(conv.id),
    date: new Date(conv.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    amount: conv.commissionAmount || 0,
    status: conv.status || 'pending',
  }))

  return (
    <DashboardClient stats={stats} recentConversions={recentConversions} />
  )
}
