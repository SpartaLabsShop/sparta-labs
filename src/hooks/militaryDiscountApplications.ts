import type { CollectionAfterChangeHook } from 'payload'
import { generateMilitaryAdminEmail } from '@/lib/emails/generateMilitaryAdminEmail'
import { generateMilitaryApprovalEmail } from '@/lib/emails/generateMilitaryApprovalEmail'

function generateMilCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let suffix = ''
  for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
  return `MIL-${suffix}`
}

export const afterMilitaryApplicationChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop'
  const adminUrl = `${serverUrl}/admin/collections/military-discount-applications/${doc.id}`

  // On create — notify admin
  if (operation === 'create') {
    try {
      let documentUrl: string | undefined
      let documentTitle: string | undefined

      if (doc.idProof) {
        const docId = typeof doc.idProof === 'object' ? doc.idProof.id : doc.idProof
        try {
          const docRecord = await req.payload.findByID({ collection: 'documents', id: docId, depth: 0 })
          documentUrl = (docRecord as any)?.url
          documentTitle = (docRecord as any)?.title || (docRecord as any)?.filename
        } catch {}
      }

      const html = generateMilitaryAdminEmail({
        firstName: doc.firstName,
        lastName: doc.lastName,
        email: doc.email,
        branch: doc.branch,
        serviceStatus: doc.serviceStatus,
        documentUrl,
        documentTitle,
        adminUrl,
      })

      await req.payload.sendEmail({
        to: 'support@spartalabs.shop',
        subject: `[Military Discount] New Application from ${doc.firstName} ${doc.lastName}`,
        html,
      })
    } catch (err) {
      req.payload.logger.error({ err }, 'Failed to send military admin notification email')
    }
    return doc
  }

  // On approval — create coupon and notify user
  const justApproved =
    operation === 'update' &&
    doc.status === 'approved' &&
    previousDoc?.status !== 'approved' &&
    !doc.couponCode

  if (!justApproved) return doc

  try {
    const discountPercent = doc.discountPercent || 15

    // Generate unique coupon code
    let code = generateMilCode()
    let attempts = 0
    while (attempts < 5) {
      const existing = await req.payload.find({
        collection: 'coupons',
        where: { code: { equals: code } },
        limit: 1,
      })
      if (existing.docs.length === 0) break
      code = generateMilCode()
      attempts++
    }

    // Create coupon locked to the applicant's email
    const newCoupon = await req.payload.create({
      collection: 'coupons',
      data: {
        code,
        type: 'percentage',
        value: discountPercent,
        appliesTo: 'all',
        applicableProductTypes: 'all',
        freeShipping: false,
        stackable: false,
        excludeSaleItems: false,
        autoApply: false,
        usageLimit: 10,
        lockedEmails: [{ email: doc.email }],
      } as any,
      req,
    })

    // Save coupon code back to the application
    await req.payload.update({
      collection: 'military-discount-applications',
      id: doc.id,
      data: { couponCode: code, coupon: newCoupon.id } as any,
      req: { ...req, context: { ...req.context, disableHooks: true } } as any,
    })

    // Email the user their coupon code
    const html = generateMilitaryApprovalEmail({
      firstName: doc.firstName,
      couponCode: code,
      discountPercent,
      serverUrl,
    })

    await req.payload.sendEmail({
      to: doc.email,
      subject: `Your Military Discount Code — ${code}`,
      html,
    })

    req.payload.logger.info(`Military discount approved for ${doc.email}, coupon: ${code}`)

    return { ...doc, couponCode: code, coupon: newCoupon.id }
  } catch (err) {
    req.payload.logger.error({ err }, 'Failed to process military discount approval')
  }

  return doc
}
