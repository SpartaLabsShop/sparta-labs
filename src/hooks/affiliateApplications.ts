import type { CollectionAfterChangeHook } from 'payload'
import slugify from 'slugify'
import { generateAffiliateWelcomeEmail } from '@/lib/emails/generateAffiliateWelcomeEmail'
import { generateAdminAffiliateNotificationEmail } from '@/lib/emails/generateAdminAffiliateNotificationEmail'

function generateRandomString(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const afterAffiliateApplicationChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  // Proceed if status is 'approved' and there is no linked affiliate yet
  if (
    (operation === 'create' || operation === 'update') &&
    doc.status === 'approved' &&
    (!previousDoc || previousDoc.status !== 'approved') &&
    !doc.linkedAffiliate
  ) {
    try {
      // 0. Fetch Global Affiliate Settings
      const settings = await req.payload.findGlobal({
        slug: 'affiliate-settings',
        depth: 0,
      })
      const commissionRate = settings?.defaultCommissionRate || 10
      const cookieDuration = settings?.defaultCookieDurationDays || 30
      const pendingPeriod = settings?.defaultPendingPeriodDays || 30
      const commissionOn = settings?.defaultCommissionOn || 'subtotal_after_coupon'
      const commissionType = settings?.defaultCommissionType || 'percentage'

      const displayName = doc.displayName || 'affiliate'
      
      // 1. Generate unique Coupon Code
      const baseCode = (displayName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() + commissionRate).substring(0, 15)
      let finalCode = baseCode
      
      // Ensure code is unique (simple retry logic)
      let isUnique = false
      let attempts = 0
      while (!isUnique && attempts < 5) {
        const existingCoupon = await req.payload.find({
          collection: 'coupons',
          where: { code: { equals: finalCode } },
          limit: 1,
        })
        if (existingCoupon.docs.length === 0) {
          isUnique = true
        } else {
          finalCode = `${baseCode}${generateRandomString(3)}`
          attempts++
        }
      }

      // Create the coupon
      const newCoupon = await req.payload.create({
        collection: 'coupons',
        data: {
          code: finalCode,
          type: 'percentage',
          value: commissionRate,
          appliesTo: 'all',
          freeShipping: false,
          stackable: false,
          excludeSaleItems: false,
          autoApply: false,
        } as any,
        req,
      })

      // 2. Generate Referral Slug
      const baseSlug = slugify(displayName, { lower: true, strict: true })
      let finalSlug = baseSlug
      let slugUnique = false
      let slugAttempts = 0
      
      while (!slugUnique && slugAttempts < 5) {
        const existingAffiliate = await req.payload.find({
          collection: 'affiliates',
          where: { referralSlug: { equals: finalSlug } },
          limit: 1,
        })
        if (existingAffiliate.docs.length === 0) {
          slugUnique = true
        } else {
          finalSlug = `${baseSlug}-${Math.floor(Math.random() * 1000)}`
          slugAttempts++
        }
      }

      // 3. Create Affiliate Profile
      const newAffiliate = await req.payload.create({
        collection: 'affiliates',
        data: {
          user: typeof doc.user === 'object' && doc.user !== null ? doc.user.id : doc.user,
          status: 'approved',
          applicationDate: doc.createdAt,
          approvedAt: new Date().toISOString(),
          approvedBy: req.user ? req.user.id : undefined,
          displayName: doc.displayName,
          websiteUrl: doc.websiteUrl,
          socialLinks: doc.socialLinks,
          referralSlug: finalSlug,
          couponCode: finalCode,
          coupon: newCoupon.id,
          cookieDurationDays: cookieDuration,
          commissionRate: commissionRate,
          commissionType: commissionType,
          customerDiscount: commissionRate,
          pendingPeriodDays: pendingPeriod,
          commissionOn: commissionOn,
          tier: 'standard',
          minimumPayoutThreshold: 5000,
          payoutCurrency: 'USD',
        } as any,
        req,
      })

      // 4. Update the Application to link the Affiliate
      await req.payload.update({
        collection: 'affiliate-applications',
        id: doc.id,
        data: {
          linkedAffiliate: newAffiliate.id,
        } as any,
        // use internal API context to avoid triggering loops
        req: { ...req, context: { ...req.context, disableHooks: true } } as any,
      })

      // 5. Send Welcome & Admin Emails
      try {
        const userId = typeof doc.user === 'object' && doc.user !== null ? doc.user.id : doc.user
        const userDoc = await req.payload.findByID({
          collection: 'users',
          id: userId,
          depth: 0,
        })
        
        if (userDoc && userDoc.email) {
          // Send Welcome Email to Affiliate
          const welcomeHtml = await generateAffiliateWelcomeEmail(newAffiliate, userDoc)
          await req.payload.sendEmail({
            to: userDoc.email,
            subject: 'Welcome to the Partner Program! 🎉',
            html: welcomeHtml,
          })
          req.payload.logger.info(`Sent welcome email to ${userDoc.email}`)
          
          // Send Notification Email to Admin
          const adminHtml = generateAdminAffiliateNotificationEmail(doc, newAffiliate, userDoc)
          await req.payload.sendEmail({
            to: 'support@spartalabs.com',
            subject: `New Affiliate Registered: ${newAffiliate.displayName}`,
            html: adminHtml,
          })
          req.payload.logger.info(`Sent admin notification to support@spartalabs.com`)
        }
      } catch (emailErr) {
        req.payload.logger.error({ err: emailErr }, 'Error sending affiliate emails')
      }

      req.payload.logger.info(`Successfully approved application and created affiliate for user ${doc.user}`)
      
      // Update the current doc memory so it returns the latest state to the admin
      return {
        ...doc,
        linkedAffiliate: newAffiliate.id,
      }

    } catch (err) {
      req.payload.logger.error({ err }, 'Error generating affiliate on application approval')
    }
  }

  return doc
}
