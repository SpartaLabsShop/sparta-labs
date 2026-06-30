import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || request.headers.get('Authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config: configPromise })
    
    // Calculate the date 15 days ago
    const fifteenDaysAgo = new Date()
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)

    // Find all pending conversions older than 15 days that are not flagged for review
    const pendingConversions = await payload.find({
      collection: 'affiliate-conversions',
      where: {
        and: [
          { status: { equals: 'pending' } },
          { createdAt: { less_than_equal: fifteenDaysAgo.toISOString() } },
          { flaggedForReview: { equals: false } },
        ],
      },
      limit: 1000, // Process in batches if necessary
      overrideAccess: true,
    })

    let approvedCount = 0

    for (const conversion of pendingConversions.docs) {
      // Update status to approved
      await payload.update({
        collection: 'affiliate-conversions',
        id: conversion.id,
        data: {
          status: 'approved',
          approvedAt: new Date().toISOString(),
        },
        overrideAccess: true,
      })
      approvedCount++
    }

    return NextResponse.json({
      success: true,
      message: `Successfully auto-approved ${approvedCount} pending conversions.`,
      processedAt: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('Error in auto-approve cron:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
