'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function submitContactForm(formData: FormData) {
  try {
    const payload = await getPayload({ config: configPromise })

    const department = formData.get('department') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    if (!name || !email || !subject || !message) {
      return { error: 'Please fill out all required fields.' }
    }

    const html = `
      <div style="font-family: sans-serif; color: #111827;">
        <h2 style="color: #000;">New Contact Form Submission</h2>
        <p><strong>Department:</strong> ${department || 'general'}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap; background: #f9fafb; padding: 15px; border-radius: 6px;">${message}</p>
      </div>
    `

    await payload.sendEmail({
      to: process.env.SUPPORT_EMAIL || 'support@spartalabs.shop',
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: html,
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error submitting contact form:', error)
    return { error: error.message || 'An unexpected error occurred.' }
  }
}
