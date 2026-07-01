import { adminEmail, infoTable, ctaButton } from './emailLayout'

export function generateAdminAffiliateNotificationEmail(application: any, affiliate: any, user: any): string {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop'
  const adminUrl = `${serverUrl}/admin/collections/affiliates/${affiliate.id}`

  let socialLinksText = 'N/A'
  if (application.socialLinks?.length) {
    socialLinksText = application.socialLinks.map((l: any) => `${l.platform}: ${l.url}`).join('<br/>')
  }

  const body = `
  <tr><td style="padding:32px 32px 24px;">
    <p style="margin:0 0 6px;font-size:20px;font-weight:800;color:#111827;">New Affiliate Approved</p>
    <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;">
      A new partner application has been automatically approved and their affiliate profile has been created.
    </p>
  </td></tr>

  <tr><td style="padding:0 32px 24px;">
    <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.4px;">Applicant Details</p>
    ${infoTable([
      ['Display Name', application.displayName || 'N/A'],
      ['Email', user?.email || 'N/A'],
      ['Website', application.websiteUrl || 'N/A'],
      ['Social Links', socialLinksText],
      ['Est. Monthly Reach', String(application.estimatedMonthlyReach || 'N/A')],
      ['Niche', application.niche || 'N/A'],
      ['Promotion Methods', application.promotionMethods || 'N/A'],
    ])}
  </td></tr>

  <tr><td style="padding:0 32px 24px;">
    <p style="margin:0 0 10px;font-size:11px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.4px;">Assigned Credentials</p>
    ${infoTable([
      ['Coupon Code', `<strong style="color:#E61C24;">${affiliate.couponCode}</strong>`],
      ['Referral Slug', affiliate.referralSlug],
      ['Commission Rate', `${affiliate.commissionRate || 'N/A'}%`],
    ])}
  </td></tr>

  <tr><td align="center" style="padding:0 32px 36px;">
    ${ctaButton(adminUrl, 'View Affiliate in Admin')}
  </td></tr>`

  return adminEmail(body, 'New Affiliate Registered')
}
