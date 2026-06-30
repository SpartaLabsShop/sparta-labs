export function generateAdminAffiliateNotificationEmail(application: any, affiliate: any, user: any): string {
  const affiliateName = application.displayName || 'Partner';
  const website = application.websiteUrl || 'N/A';
  const reach = application.estimatedMonthlyReach || 'N/A';
  const promotionMethods = application.promotionMethods || 'N/A';
  const niche = application.niche || 'N/A';
  
  let socialLinksHtml = 'N/A';
  if (application.socialLinks && application.socialLinks.length > 0) {
    socialLinksHtml = application.socialLinks.map((link: any) => `${link.platform}: <a href="${link.url}">${link.url}</a>`).join('<br>');
  }

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spartalabs.shop';
  const adminUrl = `${serverUrl}/admin/collections/affiliates/${affiliate.id}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; line-height: 1.5; color: #333; }
    h2 { color: #000; }
    .label { font-weight: bold; }
    .card { background-color: #f9f9f9; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
  </style>
</head>
<body>
  <h2>New Affiliate Registration Automatically Approved</h2>
  <p>A new partner has registered and their application has been auto-approved.</p>
  
  <div class="card">
    <p><span class="label">Name:</span> ${affiliateName}</p>
    <p><span class="label">User Email:</span> ${user?.email || 'N/A'}</p>
    <p><span class="label">Website:</span> ${website}</p>
    <p><span class="label">Social Links:</span><br>${socialLinksHtml}</p>
    <p><span class="label">Estimated Reach:</span> ${reach}</p>
    <p><span class="label">Niche:</span> ${niche}</p>
    <p><span class="label">Promotion Methods:</span> ${promotionMethods}</p>
    <br>
    <p><span class="label">Assigned Coupon:</span> ${affiliate.couponCode}</p>
    <p><span class="label">Referral Slug:</span> ${affiliate.referralSlug}</p>
  </div>
  
  <p><a href="${adminUrl}">View Affiliate in Payload Admin</a></p>
</body>
</html>
  `;
}
