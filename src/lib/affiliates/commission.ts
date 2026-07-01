import { getPayload } from 'payload'
import config from '@payload-config'
import type { Order, Affiliate, AffiliateClick } from '@/payload-types'
import { generateAdminAffiliateConversionEmail } from '@/lib/emails/generateAdminAffiliateConversionEmail'

export async function computeCommission(order: Order, affiliateId: string | number): Promise<number> {
  const payload = await getPayload({ config })
  const affiliate = await payload.findByID({
    collection: 'affiliates',
    id: affiliateId,
  }) as Affiliate

  const settings = await payload.findGlobal({
    slug: 'affiliate-settings',
  }) as any // Cast since types might not be generated yet

  // The affiliate coupon discount (they gave away X% so don't earn on the discount amount)
  const affiliateCouponDiscount = order.couponCode === affiliate.couponCode ? (order.discountTotal ?? 0) : 0

  const commissionOn = affiliate.commissionOn ?? settings?.defaultCommissionOn ?? 'subtotal_after_coupon'
  const eligibleSubtotal = commissionOn === 'subtotal_after_coupon'
    ? (order.subtotal || 0) - affiliateCouponDiscount
    : (order.subtotal || 0)

  const eligibleSubtotalCents = Math.round(eligibleSubtotal * 100)

  const rate = affiliate.commissionRate ?? settings?.defaultCommissionRate ?? 10
  const type = affiliate.commissionType ?? settings?.defaultCommissionType ?? 'percentage'

  if (type === 'fixed_amount') {
    return rate // rate is actually the fixed amount in cents
  }

  // Floor to avoid floating point issues (everything in cents)
  return Math.floor((eligibleSubtotalCents * rate) / 100)
}

export async function attributeOrder(
  order: Order,
  cookieAffiliateId: string | null,
  couponCode: string | null,
  cookieClickId: string | null
): Promise<void> {
  const payload = await getPayload({ config })
  
  let couponAffiliate: Affiliate | null = null
  if (couponCode) {
    const res = await payload.find({
      collection: 'affiliates',
      where: { couponCode: { like: couponCode } },
      limit: 1,
    })
    couponAffiliate = res.docs[0] as unknown as Affiliate || null
  }

  let cookieAffiliate: Affiliate | null = null
  if (cookieAffiliateId) {
    try {
      cookieAffiliate = await payload.findByID({
        collection: 'affiliates',
        id: isNaN(Number(cookieAffiliateId)) ? cookieAffiliateId : Number(cookieAffiliateId),
      }) as Affiliate
    } catch (e) {
      console.error('Error finding cookie affiliate:', e)
    }
  }

  const affiliate = couponAffiliate ?? cookieAffiliate
  if (!affiliate) return

  const source = (couponAffiliate && cookieAffiliate && couponAffiliate.id === cookieAffiliate.id)
    ? 'both'
    : couponAffiliate ? 'coupon_code' : 'referral_link'

  const commissionAmount = await computeCommission(order, affiliate.id)

  // Basic fraud checks
  const customerEmail = (typeof order.owner === 'object' && order.owner !== null ? order.owner.email : order.guestEmail) || ''
  let isSelfReferral = false
  
  // Check if affiliate's user email matches customer email
  if (typeof affiliate.user === 'object' && affiliate.user !== null && 'email' in affiliate.user) {
     if (String(affiliate.user.email).toLowerCase() === customerEmail.toLowerCase()) {
       isSelfReferral = true
     }
  }

  const isVoid = isSelfReferral
  const status = isVoid ? 'voided' : 'pending'
  const fraudNotes = isSelfReferral ? 'self_referral' : ''
  
  // Also fallback to global settings for pending period
  const settings = await payload.findGlobal({ slug: 'affiliate-settings' }) as any
  const pendingPeriodDays = affiliate.pendingPeriodDays ?? settings?.defaultPendingPeriodDays ?? 30
  
  const pendingUntil = new Date()
  pendingUntil.setDate(pendingUntil.getDate() + pendingPeriodDays)

  await payload.create({
    collection: 'affiliate-conversions',
    data: {
      affiliate: affiliate.id,
      order: order.id,
      customerEmail,
      attributionSource: source,
      attributionClick: cookieClickId ? (isNaN(Number(cookieClickId)) ? cookieClickId : Number(cookieClickId)) : undefined,
      cookieAgeDays: 0, // Should be computed based on click date
      couponCodeUsed: couponCode || '',
      orderSubtotal: Math.round((order.subtotal || 0) * 100),
      orderDiscount: Math.round((order.discountTotal || 0) * 100),
      eligibleSubtotal: Math.round((order.subtotal || 0) * 100), // simplified
      commissionRate: affiliate.commissionRate ?? settings?.defaultCommissionRate ?? 10,
      commissionAmount: isVoid ? 0 : commissionAmount,
      status,
      pendingUntil: pendingUntil.toISOString(),
      selfReferralDetected: isSelfReferral,
      fraudScore: isSelfReferral ? 100 : 0,
      flaggedForReview: isSelfReferral,
      fraudNotes,
    } as any, // Typecast due to dynamically generated types possibly missing fields
    overrideAccess: true,
  })

  // Send admin notification
  try {
    const adminHtml = generateAdminAffiliateConversionEmail(order, affiliate, isVoid ? 0 : commissionAmount)
    await payload.sendEmail({
      to: process.env.SUPPORT_EMAIL || 'support@spartalabs.shop',
      subject: `New Affiliate Sale! ${affiliate.displayName} made a conversion`,
      html: adminHtml,
    })
  } catch (err) {
    console.error('Failed to send admin affiliate conversion email', err)
  }
}
