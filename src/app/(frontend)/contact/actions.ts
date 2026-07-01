'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { verifyTurnstile } from '@/lib/turnstile'

export async function submitContactForm(formData: FormData) {
  try {
    const turnstileToken = formData.get('turnstileToken') as string
    const valid = await verifyTurnstile(turnstileToken)
    if (!valid) return { error: 'Bot verification failed. Please try again.' }

    const payload = await getPayload({ config: configPromise })

    const department = formData.get('department') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    if (!name || !email || !subject || !message) {
      return { error: 'Please fill out all required fields.' }
    }

    const { adminEmail, customerEmail, infoTable, ctaButton, iconCircle, sectionTitle } = await import('@/lib/emails/emailLayout')
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop'

    // Admin notification
    const adminHtml = adminEmail(`
      <tr><td style="padding:32px 32px 24px;">
        <p style="margin:0 0 6px;font-size:20px;font-weight:800;color:#111827;">New Contact Form Message</p>
        <p style="margin:0;font-size:13px;color:#6B7280;">Someone submitted the contact form on the website.</p>
      </td></tr>
      <tr><td style="padding:0 32px 24px;">
        ${infoTable([
          ['Department', department || 'General'],
          ['Name', name],
          ['Email', `<a href="mailto:${email}" style="color:#E61C24;">${email}</a>`],
          ['Subject', subject],
        ])}
      </td></tr>
      <tr><td style="padding:0 32px 28px;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.4px;">Message</p>
        <div style="background:#F9FAFB;border:1px solid #F3F4F6;border-radius:10px;padding:16px 20px;">
          <p style="margin:0;font-size:13px;color:#374151;line-height:1.7;white-space:pre-wrap;">${message}</p>
        </div>
      </td></tr>
      <tr><td align="center" style="padding:0 32px 36px;">
        ${ctaButton(`mailto:${email}`, 'Reply to Sender')}
      </td></tr>
    `, 'Contact Form Submission')

    await payload.sendEmail({
      to: process.env.SUPPORT_EMAIL || 'support@spartalabs.shop',
      replyTo: email,
      subject: `[Contact] ${subject} — from ${name}`,
      html: adminHtml,
    })

    // Auto-reply to sender
    const autoReplyHtml = customerEmail(`
      <tr><td style="padding:36px 32px 28px;text-align:center;">
        ${iconCircle('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>')}
        ${sectionTitle('Message Received', `Thanks for reaching out, ${name.split(' ')[0]}!`)}
        <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.7;">
          We've received your message and our team will get back to you as soon as possible,<br/>
          typically within 1–2 business days.
        </p>
      </td></tr>
      <tr><td style="padding:0 32px 28px;">
        <div style="background:#F9FAFB;border-radius:10px;padding:16px 20px;border:1px solid #F3F4F6;">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.4px;">Your Message</p>
          <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#111827;">${subject}</p>
          <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.6;white-space:pre-wrap;">${message.length > 200 ? message.substring(0, 200) + '…' : message}</p>
        </div>
      </td></tr>
      <tr><td align="center" style="padding:0 32px 36px;">
        ${ctaButton(`${serverUrl}/contact`, 'Send Another Message')}
      </td></tr>
    `, 'We Received Your Message — Sparta Labs')

    payload.sendEmail({
      to: email,
      subject: `We received your message — Sparta Labs`,
      html: autoReplyHtml,
    }).catch(() => {})

    return { success: true }
  } catch (error: any) {
    console.error('Error submitting contact form:', error)
    return { error: error.message || 'An unexpected error occurred.' }
  }
}
