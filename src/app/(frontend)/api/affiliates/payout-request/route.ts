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
      const emailHtml = `
        <div style="font-family: sans-serif; color: #111827; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">New Affiliate Payout Request</h2>
          <p><strong>Affiliate:</strong> ${escapeHtml(affiliate.displayName || affiliate.referralSlug || 'Unknown')} (${escapeHtml(user.email || '')})</p>
          <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
          <p><strong>Method:</strong> <span style="text-transform: uppercase;">${escapeHtml(method || '')}</span></p>
          <p><strong>Payout Details:</strong></p>
          <p style="background: #f3f4f6; padding: 12px; border-radius: 6px; font-family: monospace;">${escapeHtml(details || '')}</p>
          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">Please log in to the Payload admin panel to review, approve, and process this payout request.</p>
        </div>
      `
      await payload.sendEmail({
        to: 'support@spartalabs.shop',
        subject: `[Payout Request] $${amount.toFixed(2)} from ${affiliate.displayName || affiliate.referralSlug}`,
        html: emailHtml,
      })
    } catch (emailError) {
      console.error('Failed to send payout request email:', emailError)
      // We don't fail the request if the email fails
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Payout Request Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
