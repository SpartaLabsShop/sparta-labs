import { LegalPageLayout } from '@/components/shared/LegalPageLayout'

export const metadata = {
  title: 'Privacy Policy | Sparta Labs',
}

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="July 7, 2026" breadcrumbLabel="Privacy">
      <h2>1. Introduction</h2>
      <p>
        This Privacy Policy explains how Sparta Labs (&quot;we&quot;, &quot;us&quot;) collects, uses, and shares
        information when you visit spartalabs.shop or make a purchase (collectively, the &quot;Site&quot;).
      </p>

      <h2>2. Information We Collect</h2>
      <ul>
        <li><strong>Account information:</strong> name, email address, and password when you register.</li>
        <li><strong>Order &amp; shipping information:</strong> billing and shipping address, phone number, and order history.</li>
        <li>
          <strong>Payment information:</strong> payments are processed by Stripe; we do not store your full card
          number on our servers. If you pay via Zelle, we retain the transaction reference needed to match payment to
          your order.
        </li>
        <li><strong>Verification documents:</strong> if you apply for the military discount, we temporarily retain the ID or proof of service you upload for verification purposes only.</li>
        <li><strong>Usage data:</strong> pages viewed, device/browser type, IP address, and referral source, collected via cookies and similar technologies.</li>
        <li><strong>Affiliate &amp; referral data:</strong> if you use a referral link or coupon code, we track which affiliate referred your order for commission purposes.</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <ul>
        <li>To process and fulfill orders, including shipping and customer support.</li>
        <li>To create and maintain your account.</li>
        <li>To verify eligibility for discounts, such as the military discount program.</li>
        <li>To detect and prevent fraud, abuse, and unauthorized transactions.</li>
        <li>To send transactional emails (order confirmations, shipping updates) and, where you have opted in, marketing communications.</li>
        <li>To improve the Site and understand how visitors use it.</li>
      </ul>

      <h2>4. Cookies &amp; Tracking Technologies</h2>
      <p>
        We use cookies and similar technologies to keep you signed in, remember your cart and wishlist, attribute
        affiliate referrals, and analyze Site traffic. You can control cookies through your browser settings, though
        disabling them may affect Site functionality such as checkout.
      </p>

      <h2>5. How We Share Information</h2>
      <ul>
        <li><strong>Payment processors</strong> (e.g., Stripe) to process transactions securely.</li>
        <li><strong>Shipping carriers</strong> to deliver your order and provide tracking.</li>
        <li><strong>Service providers</strong> who help us operate the Site, send email, or provide customer support, under confidentiality obligations.</li>
        <li><strong>Affiliates</strong>, in aggregate or order-level form limited to what is necessary to calculate commissions.</li>
        <li><strong>Legal &amp; regulatory authorities</strong> where required by law, subpoena, or to protect our rights.</li>
      </ul>
      <p>We do not sell your personal information to third parties.</p>

      <h2>6. Data Security</h2>
      <p>
        We use industry-standard technical and organizational measures, including encrypted connections (HTTPS) and
        access controls, to protect your information. No method of transmission or storage is completely secure, and
        we cannot guarantee absolute security.
      </p>

      <h2>7. Data Retention</h2>
      <p>
        We retain account and order information for as long as your account is active or as needed to comply with
        legal, tax, and accounting obligations. Military discount verification documents are retained only as long as
        necessary to verify and process your application.
      </p>

      <h2>8. Your Rights &amp; Choices</h2>
      <p>
        You may access, update, or request deletion of your personal information by logging into your account or by
        contacting <a href="mailto:support@spartalabs.shop">support@spartalabs.shop</a>. Depending on your location,
        you may have additional rights under applicable data protection law.
      </p>

      <h2>9. Children&apos;s Privacy</h2>
      <p>
        The Site is not directed to individuals under 18, and we do not knowingly collect personal information from
        children.
      </p>

      <h2>10. International Users</h2>
      <p>
        We ship and sell internationally. If you access the Site from outside the United States, your information
        will be transferred to and processed in the United States, where our servers and service providers operate.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will be reflected by updating the
        &quot;Last updated&quot; date above.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        Questions about this Privacy Policy can be directed to{' '}
        <a href="mailto:support@spartalabs.shop">support@spartalabs.shop</a>.
      </p>
    </LegalPageLayout>
  )
}
