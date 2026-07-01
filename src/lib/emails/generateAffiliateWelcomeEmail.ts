import { customerEmail, iconCircle, ctaButton, codeBox, infoTable, sectionTitle } from './emailLayout'

export async function generateAffiliateWelcomeEmail(affiliate: any, user: any): Promise<string> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop'
  const name = affiliate.displayName || user?.firstName || 'Partner'
  const referralLink = `${serverUrl}/ref/${affiliate.referralSlug}`
  const couponCode = affiliate.couponCode || ''
  const commissionRate = affiliate.commissionRate || 15
  const cookieDuration = affiliate.cookieDurationDays || 30

  const body = `
  <!-- Hero -->
  <tr><td style="padding:36px 32px 28px;text-align:center;">
    ${iconCircle('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>')}
    ${sectionTitle('Partner Program', 'Welcome to the team!')}
    <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.7;">
      Hi ${name}, your affiliate application has been approved!<br/>
      You can now start earning <strong>${commissionRate}% commission</strong> on every referral you send our way.
    </p>
  </td></tr>

  <!-- Toolkit -->
  <tr><td style="padding:0 32px 24px;">
    <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;">Your Partner Toolkit</p>
    <div style="margin-bottom:16px;">
      <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.4px;">Your Referral Link</p>
      <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:12px 16px;word-break:break-all;">
        <a href="${referralLink}" style="font-size:12px;color:#E61C24;font-weight:600;text-decoration:none;">${referralLink}</a>
      </div>
    </div>
    ${codeBox(couponCode, `Your ${commissionRate}% Discount Code`)}
    <p style="margin:12px 0 0;font-size:12px;color:#6B7280;text-align:center;line-height:1.6;">
      Share your code with your audience — they get ${commissionRate}% off, you earn ${commissionRate}% commission.
    </p>
  </td></tr>

  <!-- Stats row -->
  <tr><td style="padding:0 32px 28px;">
    ${infoTable([
      ['Commission Rate', `${commissionRate}% per sale`],
      ['Cookie Duration', `${cookieDuration} days`],
      ['Referral Slug', `${affiliate.referralSlug || 'N/A'}`],
      ['Payout Method', 'Manual (request via dashboard)'],
    ])}
  </td></tr>

  <!-- Perks -->
  <tr><td style="padding:0 32px 28px;">
    <div style="background:#FFF5F5;border-radius:10px;padding:20px 24px;">
      <p style="margin:0 0 12px;font-size:11px;font-weight:700;color:#E61C24;text-transform:uppercase;letter-spacing:.5px;">What you get</p>
      ${['Track live clicks, conversions and earnings in your dashboard.', `${cookieDuration}-day cookies — earn commission even if they buy ${cookieDuration} days after clicking.`, 'Request a payout anytime once your balance is available.'].map(t => `
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;"><tr>
        <td width="20" valign="top" style="padding-top:1px;padding-right:8px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E61C24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </td>
        <td style="font-size:13px;color:#374151;line-height:1.5;">${t}</td>
      </tr></table>`).join('')}
    </div>
  </td></tr>

  <!-- CTA -->
  <tr><td align="center" style="padding:0 32px 36px;">
    ${ctaButton(`${serverUrl}/affiliates/dashboard`, 'Go to Your Dashboard')}
  </td></tr>`

  return customerEmail(body, 'Welcome to the Sparta Labs Partner Program')
}
