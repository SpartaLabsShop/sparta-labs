import { customerEmail, iconCircle, ctaButton, codeBox, sectionTitle } from './emailLayout'

export function generateMilitaryApprovalEmail(data: {
  firstName: string
  couponCode: string
  discountPercent: number
  serverUrl: string
}): string {
  const { firstName, couponCode, discountPercent, serverUrl } = data

  const body = `
  <!-- Hero -->
  <tr><td style="padding:36px 32px 28px;text-align:center;">
    ${iconCircle('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>')}
    ${sectionTitle('Military Discount Approved', 'Thank you for your service.')}
    <p style="margin:0;font-size:13px;color:#6B7280;line-height:1.7;">
      Hi ${firstName}, your military discount application has been verified and approved.<br/>
      As a token of our appreciation, here is your exclusive discount code:
    </p>
  </td></tr>

  <!-- Coupon box -->
  <tr><td style="padding:0 32px 24px;">
    ${codeBox(couponCode, 'Your Exclusive Discount Code')}
    <div style="margin-top:12px;text-align:center;">
      <span style="display:inline-block;background:#E61C24;color:#fff;font-size:13px;font-weight:800;padding:6px 20px;border-radius:999px;">${discountPercent}% OFF Your Order</span>
    </div>
  </td></tr>

  <!-- How to use -->
  <tr><td style="padding:0 32px 28px;">
    <div style="background:#F9FAFB;border-radius:10px;padding:20px 24px;border:1px solid #F3F4F6;">
      <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.5px;">How to use your code</p>
      ${[
        'Add any products to your cart.',
        `Enter <strong>${couponCode}</strong> in the coupon field at checkout.`,
        `${discountPercent}% will be automatically deducted from your order total.`,
      ].map((t, i) => `
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;"><tr>
        <td width="24" valign="top" style="padding-right:10px;">
          <div style="width:20px;height:20px;background:#E61C24;border-radius:50%;text-align:center;line-height:20px;">
            <span style="font-size:10px;font-weight:800;color:#fff;">${i + 1}</span>
          </div>
        </td>
        <td style="font-size:13px;color:#374151;line-height:1.6;">${t}</td>
      </tr></table>`).join('')}
    </div>
  </td></tr>

  <!-- Disclaimer -->
  <tr><td style="padding:0 32px 28px;">
    <div style="background:#FFF5F5;border-radius:10px;padding:16px 20px;border:1px solid #FEE2E2;">
      <p style="margin:0;font-size:11px;color:#6B7280;line-height:1.6;">
        This code is linked to your email address and is for personal use only. Contact us at
        <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@spartalabs.shop'}" style="color:#E61C24;">${process.env.SUPPORT_EMAIL || 'support@spartalabs.shop'}</a> if you have any questions.
      </p>
    </div>
  </td></tr>

  <!-- CTA -->
  <tr><td align="center" style="padding:0 32px 36px;">
    ${ctaButton(`${serverUrl}/shop`, 'Shop Now')}
  </td></tr>`

  return customerEmail(body, 'Your Military Discount — Sparta Labs')
}
