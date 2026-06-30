export async function generateAffiliateWelcomeEmail(affiliate: any, user: any): Promise<string> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop';
  
  const affiliateName = affiliate.displayName || user?.firstName || 'Partner';
  const referralLink = `${serverUrl}/ref/${affiliate.referralSlug}`;
  const couponCode = affiliate.couponCode || '';
  const commissionRate = affiliate.commissionRate || 15;
  const cookieDuration = affiliate.cookieDurationDays || 30;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to the Partner Program</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #0A0A0A;
      background-color: #FAF7F2;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #E8E2D5;
      border-radius: 12px;
      overflow: hidden;
      margin-top: 40px;
      margin-bottom: 40px;
    }
    .header {
      background-color: #0A0A0A;
      color: #FAF7F2;
      padding: 40px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .content {
      padding: 40px;
    }
    .content h2 {
      font-size: 20px;
      margin-top: 0;
      color: #0A0A0A;
    }
    .content p {
      font-size: 16px;
      color: #4A4A4A;
      margin-bottom: 24px;
    }
    .card {
      background-color: #F2EDE4;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
      border: 1px solid #E0D5C2;
    }
    .card h3 {
      margin-top: 0;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #8C7A55;
      margin-bottom: 12px;
    }
    .code-block {
      background-color: #ffffff;
      padding: 12px 16px;
      border-radius: 6px;
      border: 1px dashed #C9B58E;
      font-family: monospace;
      font-size: 16px;
      font-weight: bold;
      color: #0A0A0A;
      margin-bottom: 16px;
      word-break: break-all;
    }
    .button {
      display: inline-block;
      background-color: #0A0A0A;
      color: #FAF7F2;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 4px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 14px;
      text-align: center;
      margin-top: 8px;
    }
    .footer {
      background-color: #FAF7F2;
      padding: 24px 40px;
      text-align: center;
      border-top: 1px solid #E8E2D5;
      color: #8A8A8A;
      font-size: 12px;
    }
    .features {
      margin: 32px 0;
      padding: 0;
      list-style: none;
    }
    .features li {
      margin-bottom: 16px;
      font-size: 15px;
      color: #4A4A4A;
      padding-left: 24px;
      position: relative;
    }
    .features li::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #C9B58E;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to the Partner Program</h1>
    </div>
    <div class="content">
      <h2>Hi ${affiliateName},</h2>
      <p>Your application has been instantly approved! We're thrilled to have you join Sparta Labs as an official partner. You can now start earning ${commissionRate}% commission on every referral.</p>
      
      <div class="card">
        <h3>Your Partner Toolkit</h3>
        <p style="margin-bottom: 8px; font-size: 14px; font-weight: bold; color: #0A0A0A;">Your Unique Referral Link</p>
        <div class="code-block">${referralLink}</div>
        
        <p style="margin-bottom: 8px; font-size: 14px; font-weight: bold; color: #0A0A0A;">Your Custom ${commissionRate}% Discount Code</p>
        <div class="code-block" style="margin-bottom: 0;">${couponCode}</div>
      </div>
      
      <p>Share your link or your code with your audience. When they use it, they get ${commissionRate}% off their order, and you get ${commissionRate}% commission!</p>
      
      <ul class="features">
        <li><strong>Track Everything:</strong> See live clicks, conversions, and payouts on your dashboard.</li>
        <li><strong>Automated Payouts:</strong> Get paid out directly to your account.</li>
        <li><strong>${cookieDuration}-Day Cookies:</strong> You get credited even if they buy ${cookieDuration} days after clicking your link.</li>
      </ul>
      
      <div style="text-align: center; margin-top: 32px;">
        <a href="${serverUrl}/affiliates/dashboard" class="button" style="color: #FAF7F2;">Go to Dashboard</a>
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Sparta Labs. All rights reserved.<br>
      <a href="${serverUrl}" style="color: #8A8A8A; text-decoration: underline;">Visit our store</a>
    </div>
  </div>
</body>
</html>
  `;
}
