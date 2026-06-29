import type { CollectionAfterChangeHook } from 'payload'
import { appendOrderToSheet } from '@/lib/google/sheets'

const ADMIN_EMAIL = 'kyle@spartalabs.shop'

export const afterOrderChange: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  // Notify admin on new order
  if (operation === 'create') {
    const customerEmail = (typeof doc.owner === 'object' && doc.owner?.email) || doc.guestEmail || 'Unknown'
    const orderNumber = doc.orderNumber || doc.id
    req.payload.sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Order #${orderNumber} — $${(doc.total || 0).toFixed(2)}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 20px; font-weight: 700; color: #111; margin: 0 0 24px 0;">SPARTA LABS</h1>
          <h2 style="font-size: 22px; font-weight: 700; color: #111; margin-bottom: 16px;">New Order Received</h2>
          <table style="width: 100%; font-size: 14px; color: #444; line-height: 1.8;">
            <tr><td style="font-weight: 600;">Order</td><td>#${orderNumber}</td></tr>
            <tr><td style="font-weight: 600;">Customer</td><td>${doc.customerFirstName || ''} ${doc.customerLastName || ''}</td></tr>
            <tr><td style="font-weight: 600;">Email</td><td>${customerEmail}</td></tr>
            <tr><td style="font-weight: 600;">Total</td><td style="font-weight: 700; color: #111;">$${(doc.total || 0).toFixed(2)}</td></tr>
            <tr><td style="font-weight: 600;">Payment</td><td>${doc.paymentStatus === 'unpaid' ? '⏳ Zelle Pending' : '✅ Paid'}</td></tr>
            <tr><td style="font-weight: 600;">Shipping</td><td>${doc.shippingMethod || 'Standard'}</td></tr>
          </table>
          <a href="${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin/collections/orders/${doc.id}" style="display: inline-block; background: #111; color: #fff; padding: 12px 24px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; text-decoration: none; margin-top: 24px;">
            View in Admin
          </a>
        </div>
      `,
    }).catch((err: any) => req.payload.logger.error({ err }, `Failed to send admin order notification`))
  }
  // Sync to Google Sheets if it became paid, captured, or completed
  const becamePaid = (doc.paymentStatus === 'paid' || doc.paymentStatus === 'captured') && 
                     (previousDoc?.paymentStatus !== 'paid' && previousDoc?.paymentStatus !== 'captured')
  const becameCompleted = doc.status === 'completed' && previousDoc?.status !== 'completed'

  if (becamePaid || becameCompleted) {
    try {
      await appendOrderToSheet(doc as any)
      req.payload.logger.info(`Synced Order ${doc.id} to Google Sheets from hook`)
    } catch (err) {
      req.payload.logger.error({ err }, `Failed to sync Order ${doc.id} to Google Sheets`)
    }
  }

  if (operation === 'update') {
    // If the order is refunded or cancelled, we must reverse any associated affiliate conversions
    const wasRefunded = doc.status === 'refunded' && previousDoc?.status !== 'refunded'
    const wasCancelled = doc.status === 'cancelled' && previousDoc?.status !== 'cancelled'

    if (wasRefunded || wasCancelled) {
      const conversions = await req.payload.find({
        collection: 'affiliate-conversions',
        where: { order: { equals: doc.id } },
        overrideAccess: true,
      })

      for (const conv of conversions.docs) {
        if (conv.status !== 'voided' && conv.status !== 'reversed') {
          await req.payload.update({
            collection: 'affiliate-conversions',
            id: conv.id,
            data: {
              status: 'reversed',
              reversedAt: new Date().toISOString(),
              reversedReason: wasRefunded ? 'order_refunded' : 'order_cancelled',
            },
            overrideAccess: true,
          })
        }
      }
    }
  }

  // Handle custom email notes from admin
  if (req.context.queuedCustomerNotes && Array.isArray(req.context.queuedCustomerNotes)) {
    const customerEmail = doc.owner?.email || doc.guestEmail
    
    if (customerEmail) {
      try {
        const { generateOrderInvoiceHtml } = await import('@/lib/emails/generateOrderEmail')
        
        for (const customNote of req.context.queuedCustomerNotes) {
          // Pass the note into the email generator
          const invoiceHtml = await generateOrderInvoiceHtml(doc, req.payload, customNote)
          
          await req.payload.sendEmail({
            to: customerEmail,
            subject: `Update regarding your Order #${doc.orderNumber || doc.id}`,
            html: invoiceHtml,
          })
          
          req.payload.logger.info(`Sent custom order note to ${customerEmail} for order ${doc.id}`)
        }
      } catch (err) {
        req.payload.logger.error({ err }, `Failed to send custom order note email for order ${doc.id}`)
      }
    }
  }

  return doc
}
