import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { LinksClient } from './LinksClient'

export const metadata = {
  title: 'Links & Creatives | Affiliate Dashboard',
}

export default async function AffiliateLinksPage() {
  const user = await getPayloadUser()
  
  if (!user) {
    redirect('/login')
  }

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'affiliates',
    where: { user: { equals: user.id } },
    limit: 1,
    overrideAccess: true,
  })

  const affiliate = result.docs[0]
  if (!affiliate || affiliate.status !== 'approved') {
    redirect('/affiliates/dashboard')
  }

  const referralLink = `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop'}/ref/${affiliate.referralSlug}`

  return (
    <LinksClient 
      referralLink={referralLink}
      couponCode={affiliate.couponCode || ''}
      customerDiscount={affiliate.customerDiscount || 10}
      commissionRate={affiliate.commissionRate || 10}
    />
  )
}
