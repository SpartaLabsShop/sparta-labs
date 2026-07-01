// src/hooks/users.ts
import type { CollectionBeforeChangeHook, CollectionAfterChangeHook } from 'payload'
import { escapeHtml } from '@/lib/utils'

/**
 * Lower‑case the email on create / update.
 */
export const beforeChangeEmailLowercase: CollectionBeforeChangeHook = async ({ data, originalDoc }) => {
  if (data.email) {
    data.email = (data.email as string).toLowerCase()
  }
  // Preserve existing email on updates if not changed
  if (!data.email && originalDoc?.email) {
    data.email = (originalDoc.email as string).toLowerCase()
  }
  return data
}

/**
 * Placeholder hook after a new user is created.
 * TODO: create Stripe customer + send welcome email.
 */
const ADMIN_EMAIL = 'kyle@spartalabs.shop'

export const afterCreateUserTodo: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation === 'create') {
    // Notify admin of new registration
    ;(async () => {
      try {
        const { adminEmail, infoTable, ctaButton } = await import('@/lib/emails/emailLayout')
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop'
        const adminUserUrl = `${serverUrl}/admin/collections/users/${doc.id}`
        const fullName = `${escapeHtml(doc.firstName || '')} ${escapeHtml(doc.lastName || '')}`.trim() || 'N/A'
        const adminHtml = adminEmail(`
          <tr><td style="padding:32px 32px 24px;">
            <p style="margin:0 0 6px;font-size:20px;font-weight:800;color:#111827;">New User Registered</p>
            <p style="margin:0;font-size:13px;color:#6B7280;">A new account has been created on Sparta Labs.</p>
          </td></tr>
          <tr><td style="padding:0 32px 24px;">
            ${infoTable([
              ['Email', escapeHtml(doc.email || '')],
              ['Name', fullName],
              ['Auth Provider', escapeHtml(doc.authProvider || 'email')],
              ['User ID', String(doc.id)],
            ])}
          </td></tr>
          <tr><td align="center" style="padding:0 32px 36px;">${ctaButton(adminUserUrl, 'View User in Admin')}</td></tr>
        `, 'New User Registration')
        await req.payload.sendEmail({
          to: ADMIN_EMAIL,
          subject: `New User Registration — ${doc.email}`,
          html: adminHtml,
        })
      } catch (err: any) {
        console.error('Failed to send admin registration notification:', err)
      }

      // Send welcome email to the new user
      try {
        const { customerEmail: wrapCustomer, iconCircle, ctaButton, sectionTitle } = await import('@/lib/emails/emailLayout')
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop'
        const firstName = doc.firstName || 'there'
        const welcomeHtml = wrapCustomer(`
          <tr><td style="padding:36px 32px 28px;text-align:center;">
            ${iconCircle('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>')}
            ${sectionTitle('Welcome to Sparta Labs', `Hi ${firstName}, your account is ready!`)}
            <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.7;">
              Thank you for creating an account. Explore our full line of research peptides<br/>and track all your orders from your dashboard.
            </p>
          </td></tr>
          <tr><td style="padding:0 32px 28px;">
            <div style="background:#FFF5F5;border-radius:10px;padding:20px 24px;border:1px solid #FEE2E2;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#E61C24;text-transform:uppercase;letter-spacing:.5px;">What you can do</p>
              ${[
                'Browse and order from our full catalog of research peptides.',
                'Track your order history and delivery status in your account.',
                'Earn and redeem Sparta Points on every purchase.',
              ].map(t => `
              <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;"><tr>
                <td width="20" valign="top" style="padding-top:1px;padding-right:8px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E61C24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </td>
                <td style="font-size:13px;color:#374151;line-height:1.5;">${t}</td>
              </tr></table>`).join('')}
            </div>
          </td></tr>
          <tr><td align="center" style="padding:0 32px 36px;">
            ${ctaButton(`${serverUrl}/shop`, 'Start Shopping')}
          </td></tr>
        `, 'Welcome to Sparta Labs')
        await req.payload.sendEmail({
          to: doc.email,
          subject: 'Welcome to Sparta Labs — Your Account is Ready',
          html: welcomeHtml,
        })
      } catch (err: any) {
        console.error('Failed to send welcome email:', err)
      }
    })()

    // Retroactive Order Binding
    if (doc.email) {
      setTimeout(() => {
        (async () => {
          try {
            const payload = req.payload
            const orders = await payload.find({
              collection: 'orders',
              where: {
                and: [
                  { guestEmail: { equals: doc.email.toLowerCase() } },
                  {
                    or: [
                      { owner: { exists: false } },
                      { owner: { equals: null } }
                    ]
                  }
                ]
              },
              overrideAccess: true,
              req,
              sort: '-createdAt',
            })
            
            if (orders.docs.length > 0) {
              // Bind all guest orders to this user
              await Promise.all(orders.docs.map(order => 
                payload.update({
                  collection: 'orders',
                  id: order.id,
                  data: {
                    owner: doc.id
                  },
                  overrideAccess: true,
                  req,
                })
              ))

              // Sync user details from the most recent guest order if the user profile is empty
              const recentOrder = orders.docs[0] as any
              if (!doc.firstName && !doc.lastName && recentOrder.customerFirstName) {
                let addressId = null
                
                // Create default address from the order's shipping address
                if (recentOrder.shippingAddress && recentOrder.shippingAddress.line1) {
                  const newAddress = await payload.create({
                    collection: 'addresses',
                    data: {
                      user: doc.id,
                      label: 'Default Shipping',
                      firstName: recentOrder.customerFirstName,
                      lastName: recentOrder.customerLastName || '',
                      line1: recentOrder.shippingAddress.line1,
                      line2: recentOrder.shippingAddress.line2 || '',
                      city: recentOrder.shippingAddress.city || '',
                      state: recentOrder.shippingAddress.state || '',
                      postalCode: recentOrder.shippingAddress.postalCode || '',
                      country: recentOrder.shippingAddress.country || '',
                      phone: recentOrder.customerPhone || '',
                      isDefaultShipping: true
                    },
                    overrideAccess: true,
                    req,
                  })
                  addressId = newAddress.id
                }

                // Update User Profile
                await payload.update({
                  collection: 'users',
                  id: doc.id,
                  data: {
                    firstName: recentOrder.customerFirstName,
                    lastName: recentOrder.customerLastName || '',
                    phone: recentOrder.customerPhone || '',
                    ...(addressId ? { defaultShippingAddress: addressId as any } : {})
                  },
                  overrideAccess: true,
                  req,
                })
              }
              console.log(`Retroactively bound ${orders.docs.length} guest orders to user ${doc.id}`)
            }
          } catch (err) {
            console.error('Error retroactively binding orders:', err)
          }
        })()
      }, 0)
    }
  }
}
