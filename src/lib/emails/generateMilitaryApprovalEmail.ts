export function generateMilitaryApprovalEmail(data: {
  firstName: string
  couponCode: string
  discountPercent: number
  serverUrl: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; background: #f9fafb; margin: 0; padding: 40px 20px; }
    .container { max-width: 560px; margin: 0 auto; }
    .header { background: #000; color: #fff; border-radius: 8px 8px 0 0; padding: 32px 40px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 8px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.7); }
    .body { background: #fff; border-radius: 0 0 8px 8px; padding: 36px 40px; border: 1px solid #e5e7eb; border-top: none; }
    .coupon-box { background: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; padding: 24px; text-align: center; margin: 28px 0; }
    .coupon-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin-bottom: 10px; }
    .coupon-code { font-size: 28px; font-weight: 800; letter-spacing: 4px; color: #000; font-family: monospace; }
    .discount-badge { display: inline-block; background: #d90429; color: #fff; font-size: 13px; font-weight: 700; padding: 4px 14px; border-radius: 999px; margin-top: 10px; }
    .btn { display: block; text-align: center; background: #000; color: #fff; text-decoration: none; padding: 14px 24px; border-radius: 6px; font-size: 15px; font-weight: 600; margin-top: 28px; }
    .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #9ca3af; }
    ul { padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Military Discount Approved</h1>
      <p>Thank you for your service.</p>
    </div>
    <div class="body">
      <p style="margin-top:0;font-size:16px;">Hi ${data.firstName},</p>
      <p style="color:#4b5563;font-size:14px;line-height:1.7;">
        Your military discount application has been verified and approved. As a token of our appreciation for your service, here is your exclusive discount code:
      </p>

      <div class="coupon-box">
        <div class="coupon-label">Your Discount Code</div>
        <div class="coupon-code">${data.couponCode}</div>
        <div class="discount-badge">${data.discountPercent}% OFF</div>
      </div>

      <p style="font-size:14px;font-weight:600;color:#111;margin-bottom:8px;">How to use your code:</p>
      <ul>
        <li>Add any products to your cart</li>
        <li>Enter <strong>${data.couponCode}</strong> at checkout in the coupon field</li>
        <li>${data.discountPercent}% will be deducted from your order total</li>
      </ul>

      <a href="${data.serverUrl}/shop" class="btn">Shop Now →</a>

      <p style="margin-top:24px;font-size:13px;color:#6b7280;border-top:1px solid #f3f4f6;padding-top:20px;">
        This code is linked to your email address and is for personal use only. If you have any questions, contact us at <a href="mailto:support@spartalabs.shop" style="color:#000;">support@spartalabs.shop</a>.
      </p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Sparta Labs. Thank you for your service.
    </div>
  </div>
</body>
</html>
  `
}
