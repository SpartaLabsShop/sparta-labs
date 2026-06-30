import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const firstName = (formData.get('firstName') as string)?.trim()
    const lastName = (formData.get('lastName') as string)?.trim()
    const email = (formData.get('email') as string)?.trim().toLowerCase()
    const branch = formData.get('branch') as string
    const serviceStatus = formData.get('serviceStatus') as string
    const file = formData.get('idProof') as File | null

    if (!firstName || !lastName || !email || !branch || !serviceStatus || !file || file.size === 0) {
      return NextResponse.json({ error: 'All fields including ID proof are required.' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 10MB.' }, { status: 400 })
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Please upload a PDF, JPG, or PNG file.' }, { status: 400 })
    }
    // file.type is client-supplied; also validate the extension so a renamed executable can't slip through
    const allowedExtensions = /\.(pdf|jpg|jpeg|png|webp)$/i
    if (!allowedExtensions.test(file.name)) {
      return NextResponse.json({ error: 'Please upload a PDF, JPG, or PNG file.' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Check for duplicate
    const existing = await payload.find({
      collection: 'military-discount-applications',
      where: { email: { equals: email }, status: { not_equals: 'rejected' } },
      limit: 1,
      overrideAccess: true,
    })
    if (existing.docs.length > 0) {
      return NextResponse.json({ error: 'An application for this email already exists.' }, { status: 409 })
    }

    // Upload ID proof document
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadedDoc = await (payload.create as any)({
      collection: 'documents',
      data: { title: `Military ID — ${firstName} ${lastName} (${email})` },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
      overrideAccess: true,
    })

    // Create application
    await payload.create({
      collection: 'military-discount-applications',
      data: {
        firstName,
        lastName,
        email,
        branch,
        serviceStatus,
        idProof: uploadedDoc.id,
        status: 'pending',
        discountPercent: 15,
      } as any,
      overrideAccess: true,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Military discount application error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
