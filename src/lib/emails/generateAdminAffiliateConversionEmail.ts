import { adminEmail, infoTable, ctaButton } from './emailLayout'

export function generateAdminAffiliateConversionEmail(order: any, affiliate: any, commissionAmount: number): string {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop'
  const adminUrl = `${serverUrl}/admin/collections/orders/${order.id}`
  const orderNumber = order.orderNumber || order.id || 'N/A'
  const orderTotal = `$${(order.total || 0).toFixed(2)}`
  const commissionFormatted = `$${(commissionAmount / 100).toFixed(2)}`
  const customerEmail = (typeof order.owner === 'object' && order.owner !== null ? order.owner.email : order.guestEmail) || 'N/A'
  const affiliateName = affiliate.displayName || 'Partner'

  const body = `
  <tr><td style="padding:32px 32px 24px;">
    <p style="margin:0 0 6px;font-size:20px;font-weight:800;color:#111827;">New Affiliate Conversion!</p>
    <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">
      A customer completed a purchase using an affiliate link or coupon code.
    </p>
  </td></tr>

  <!-- Highlight banner -->
  <tr><td style="padding:0 32px 24px;">
    <div style="background:#FFF5F5;border-radius:10px;padding:20px 24px;border:1px solid #FEE2E2;text-align:center;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px;">Commission Earned</p>
      <p style="margin:0;font-size:32px;font-weight:800;color:#E61C24;">${commissionFormatted}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#6B7280;">for <strong>${affiliateName}</strong> on order <strong>#${orderNumber}</strong></p>
    </div>
  </td></tr>

  <tr><td style="padding:0 32px 24px;">
    <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.4px;">Conversion Details</p>
    ${infoTable([
      ['Affiliate', affiliateName],
      ['Affiliate ID', String(affiliate.id)],
      ['Customer Email', customerEmail],
      ['Order Number', `#${orderNumber}`],
      ['Order Total', orderTotal],
      ['Commission Amount', commissionFormatted],
    ])}
  </td></tr>

  <tr><td align="center" style="padding:0 32px 36px;">
    ${ctaButton(adminUrl, 'View Order in Admin')}
  </td></tr>`

  return adminEmail(body, 'Affiliate Conversion')
}
