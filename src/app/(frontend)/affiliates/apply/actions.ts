'use server'

import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'
import { verifyTurnstile } from '@/lib/turnstile'

export async function submitAffiliateApplication(formData: FormData) {
  try {
    const turnstileToken = formData.get('turnstileToken') as string
    const valid = await verifyTurnstile(turnstileToken)
    if (!valid) return { success: false, error: 'Bot verification failed. Please try again.' }

    const user = await getPayloadUser()
    if (!user) {
      return { success: false, error: 'You must be logged in to apply.' }
    }

    const payload = await getPayload({ config })

    // Check if they already applied
    const existing = await payload.find({
      collection: 'affiliate-applications',
      where: { user: { equals: user.id } },
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      return { success: false, error: 'You have already submitted an application.' }
    }

    // Extract basic fields
    const displayName = formData.get('displayName') as string
    const websiteUrl = formData.get('websiteUrl') as string
    const promotionMethods = formData.get('promotionMethods') as string
    const estimatedMonthlyReach = formData.get('estimatedMonthlyReach') as string
    const niche = formData.get('niche') as string
    const whyJoin = formData.get('whyJoin') as string
    const agreedToTerms = formData.get('agreedToTerms') === 'on'

    if (!displayName || !promotionMethods || !agreedToTerms) {
      return { success: false, error: 'Please fill in all required fields and agree to the terms.' }
    }

    // Process social links
    const socialLinks = []
    const platforms = ['instagram', 'youtube', 'tiktok', 'twitter', 'reddit']
    for (const platform of platforms) {
      const url = formData.get(`social_${platform}`) as string
      if (url) {
        socialLinks.push({ platform, url })
      }
    }

    // Create application
    await payload.create({
      collection: 'affiliate-applications',
      data: {
        user: user.id,
        status: 'pending',
        displayName,
        websiteUrl,
        promotionMethods,
        estimatedMonthlyReach: (estimatedMonthlyReach || '<1k') as any,
        niche,
        whyJoin,
        agreedToTerms,
        socialLinks: socialLinks as any,
      },
      overrideAccess: true,
    })

    revalidatePath('/affiliates/apply')
    return { success: true }
  } catch (error: any) {
    console.error('Error submitting application:', error)
    return { success: false, error: error.message || 'An unexpected error occurred.' }
  }
}
