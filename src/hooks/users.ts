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
    req.payload.sendEmail({
      to: ADMIN_EMAIL,
      subject: `New User Registration — ${doc.email}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 20px; font-weight: 700; color: #111; margin: 0 0 24px 0;">SPARTA LABS</h1>
          <h2 style="font-size: 22px; font-weight: 700; color: #111; margin-bottom: 16px;">New User Registered</h2>
          <table style="width: 100%; font-size: 14px; color: #444; line-height: 1.8;">
            <tr><td style="font-weight: 600;">Email</td><td>${escapeHtml(doc.email || '')}</td></tr>
            <tr><td style="font-weight: 600;">Name</td><td>${escapeHtml(doc.firstName || '')} ${escapeHtml(doc.lastName || '')}</td></tr>
            <tr><td style="font-weight: 600;">Provider</td><td>${escapeHtml(doc.authProvider || 'email')}</td></tr>
          </table>
          <a href="${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin/collections/users/${doc.id}" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; margin-top: 24px;">
            View in Admin
          </a>
        </div>
      `,
    }).catch((err: any) => console.error('Failed to send admin registration notification:', err))

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
