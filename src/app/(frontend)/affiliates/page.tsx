import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { AffiliatesLandingClient, UserAffiliateStatus } from './AffiliatesLandingClient'

export const metadata = {
  title: 'Affiliate Program | Sparta Labs',
  description: 'Join our affiliate program and earn 15% commission on all referrals.',
}

export default async function AffiliatesLandingPage() {
  const user = await getPayloadUser()
  let status: UserAffiliateStatus = 'guest'

  if (user) {
    status = 'user'
    const payload = await getPayload({ config })

    // 1. Check if they are an active affiliate
    const { docs: affiliates } = await payload.find({
      collection: 'affiliates',
      where: { user: { equals: user.id } },
      limit: 1,
      overrideAccess: true,
    })

    if (affiliates.length > 0) {
      status = `affiliate_${affiliates[0].status}` as UserAffiliateStatus
    } else {
      // 2. Check if they have a pending application
      const { docs: applications } = await payload.find({
        collection: 'affiliate-applications',
        where: { user: { equals: user.id } },
        limit: 1,
        overrideAccess: true,
      })

      if (applications.length > 0) {
        if (applications[0].status === 'pending') {
          status = 'pending_application'
        } else if (applications[0].status === 'rejected') {
          status = 'affiliate_rejected'
        }
      }
    }
  }

  return <AffiliatesLandingClient userStatus={status} />
}
