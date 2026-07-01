import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getPayloadUser } from '@/lib/auth/getPayloadUser'
import { escapeHtml } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Auth check
    const user = await getPayloadUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id
    
    // Get affiliate profile
    const affiliates = await payload.find({
      collection: 'affiliates',
      where: { user: { equals: userId } },
      limit: 1,
    })
    
    const affiliate = affiliates.docs[0]
    if (!affiliate) {
      return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
    }

    const body = await request.json()
    const { amount, method, details } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const requestedCents = Math.round(amount * 100)
    
    // Validate balance
    const approved = affiliate.totalCommissionApproved || 0
    const requested = affiliate.totalCommissionRequested || 0
    const available = approved - requested
    
    if (requestedCents > available) {
      return NextResponse.json({ error: 'Amount exceeds available balance' }, { status: 400 })
    }

    // Create the request
    await payload.create({
      collection: 'payout-requests',
      data: {
        affiliate: affiliate.id,
        amountCents: requestedCents,
        payoutMethod: method,
        payoutDetails: details,
        status: 'pending',
      },
      overrideAccess: true, // Internal creation
    })

    // Send email to admin
    try {
      const { adminEmail, infoTable, ctaButton } = await import('@/lib/emails/emailLayout')
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop'
      const adminPayoutUrl = `${serverUrl}/admin/collections/payout-requests`
      const affiliateLabel = escapeHtml(affiliate.displayName || affiliate.referralSlug || 'Unknown')
      const emailHtml = adminEmail(`
        <tr><td style="padding:32px 32px 24px;">
          <p style="margin:0 0 6px;font-size:20px;font-weight:800;color:#111827;">Affiliate Payout Request</p>
          <p style="margin:0;font-size:13px;color:#6B7280;">An affiliate has requested a payout from their earned commissions.</p>
        </td></tr>
        <tr><td style="padding:0 32px 24px;">
          <div style="background:#FFF5F5;border-radius:10px;padding:20px 24px;border:1px solid #FEE2E2;text-align:center;margin-bottom:20px;">
            <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px;">Requested Amount</p>
            <p style="margin:0;font-size:32px;font-weight:800;color:#E61C24;">$${amount.toFixed(2)}</p>
          </div>
          ${infoTable([
            ['Affiliate', affiliateLabel],
            ['Email', escapeHtml(user.email || '')],
            ['Payout Method', escapeHtml((method || '').toUpperCase())],
            ['Payout Details', `<code style="background:#F3F4F6;padding:2px 6px;border-radius:4px;font-size:12px;">${escapeHtml(details || '')}</code>`],
          ])}
        </td></tr>
        <tr><td align="center" style="padding:0 32px 36px;">${ctaButton(adminPayoutUrl, 'Review in Admin Panel')}</td></tr>
      `, 'Affiliate Payout Request')
      await payload.sendEmail({
        to: process.env.SUPPORT_EMAIL || 'support@spartalabs.shop',
        subject: `Payout Request — $${amount.toFixed(2)} from ${affiliate.displayName || affiliate.referralSlug}`,
        html: emailHtml,
      })
    } catch (emailError) {
      console.error('Failed to send payout request email:', emailError)
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Payout Request Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
