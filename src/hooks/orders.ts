import type { CollectionAfterChangeHook } from 'payload'
import { appendOrderToSheet } from '@/lib/google/sheets'

const ADMIN_EMAIL = 'kyle@spartalabs.shop'

export const afterOrderChange: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  // Notify admin on new order
  if (operation === 'create') {
    const customerEmail = (typeof doc.owner === 'object' && doc.owner?.email) || doc.guestEmail || 'Unknown'
    const orderNumber = doc.orderNumber || doc.id
    const { adminEmail, infoTable, ctaButton } = await import('@/lib/emails/emailLayout')
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop'
    const adminOrderUrl = `${serverUrl}/admin/collections/orders/${doc.id}`
    const paymentLabel = doc.paymentStatus === 'unpaid' ? 'Zelle — Pending' : doc.paymentStatus === 'captured' ? 'Paid' : (doc.paymentStatus || 'Unknown')
    const adminOrderHtml = adminEmail(`
      <tr><td style="padding:32px 32px 24px;">
        <p style="margin:0 0 6px;font-size:20px;font-weight:800;color:#111827;">New Order Received</p>
        <p style="margin:0;font-size:13px;color:#6B7280;">A new order has been placed and is awaiting fulfillment.</p>
      </td></tr>
      <tr><td style="padding:0 32px 24px;">
        <div style="background:#FFF5F5;border-radius:10px;padding:20px 24px;border:1px solid #FEE2E2;text-align:center;margin-bottom:20px;">
          <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px;">Order Total</p>
          <p style="margin:0;font-size:32px;font-weight:800;color:#E61C24;">$${(doc.total || 0).toFixed(2)}</p>
        </div>
        ${infoTable([
          ['Order Number', `#${orderNumber}`],
          ['Customer', `${doc.customerFirstName || ''} ${doc.customerLastName || ''}`.trim() || 'N/A'],
          ['Email', customerEmail],
          ['Payment', paymentLabel],
          ['Shipping', doc.shippingMethod || 'Standard'],
        ])}
      </td></tr>
      <tr><td align="center" style="padding:0 32px 36px;">${ctaButton(adminOrderUrl, 'View Order in Admin')}</td></tr>
    `, 'New Order')
    req.payload.sendEmail({
      to: ADMIN_EMAIL,
      subject: `New Order #${orderNumber} — $${(doc.total || 0).toFixed(2)}`,
      html: adminOrderHtml,
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
