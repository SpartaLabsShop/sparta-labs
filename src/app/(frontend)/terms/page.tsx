import Link from 'next/link'
import { LegalPageLayout } from '@/components/shared/LegalPageLayout'

export const metadata = {
  title: 'Terms of Service | Sparta Labs',
}

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="July 7, 2026" breadcrumbLabel="Terms">
      <h2>1. Acceptance of Terms</h2>
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Sparta Labs website located at
        spartalabs.shop (the &quot;Site&quot;) and any products purchased through it. By creating an account, placing an
        order, or otherwise using the Site, you agree to be bound by these Terms. If you do not agree, do not use the
        Site.
      </p>

      <h2>2. Eligibility &amp; Intended Use</h2>
      <p>
        You must be at least 18 years old to create an account or place an order. By using the Site, you represent
        that you are purchasing products solely for licensed laboratory, academic, or in-vitro research purposes, and
        not for personal, medical, veterinary, or human/animal consumption.
      </p>

      <h2>3. Research-Use-Only Products</h2>
      <p>
        All products sold on the Site are intended strictly for laboratory and research use. They are not drugs,
        dietary supplements, food, or cosmetics under any applicable law, and have not been evaluated by the U.S. Food
        and Drug Administration. Products are not intended to diagnose, treat, cure, or prevent any disease, and are
        not intended for human or animal consumption. See our <Link href="/disclaimer">Disclaimer</Link> for additional
        terms governing product use.
      </p>

      <h2>4. Accounts</h2>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials and for all activity that
        occurs under your account. Notify us immediately at{' '}
        <a href="mailto:support@spartalabs.shop">support@spartalabs.shop</a> if you suspect unauthorized use of your
        account.
      </p>

      <h2>5. Orders, Pricing &amp; Payment</h2>
      <p>
        All prices are listed in U.S. Dollars and are subject to change without notice. We reserve the right to
        refuse, cancel, or limit the quantity of any order at our discretion, including orders that appear to be
        placed by resellers, distributors, or where fraud or misuse is suspected. Payment is processed securely via
        Stripe or, where offered, via Zelle bank transfer. Orders are not confirmed until payment has been
        successfully processed.
      </p>

      <h2>6. Shipping</h2>
      <p>
        Orders placed before 2:00 PM EST on a business day are generally shipped the same day. We ship worldwide;
        however, it is the sole responsibility of the purchaser to determine whether importation of research
        compounds is lawful in their destination jurisdiction. Sparta Labs is not responsible for shipments seized,
        delayed, or destroyed by customs or postal authorities.
      </p>

      <h2>7. Affiliate &amp; Referral Program</h2>
      <p>
        Participants in our affiliate program must comply with our affiliate terms, including truthful advertising
        and a prohibition on paid search bidding on our trademarks. We reserve the right to withhold commissions or
        terminate an affiliate account for fraudulent, misleading, or abusive referral activity.
      </p>

      <h2>8. Intellectual Property</h2>
      <p>
        All content on the Site, including text, graphics, logos, product descriptions, and Certificates of Analysis
        formatting, is the property of Sparta Labs or its licensors and is protected by applicable intellectual
        property laws. You may not reproduce, distribute, or create derivative works from Site content without our
        prior written consent.
      </p>

      <h2>9. Prohibited Uses</h2>
      <ul>
        <li>Using any product purchased on the Site for human or animal consumption.</li>
        <li>Misrepresenting your identity, age, or organizational affiliation.</li>
        <li>Reselling products as anything other than for research use, without disclosing that restriction.</li>
        <li>Attempting to interfere with or compromise the security or integrity of the Site.</li>
        <li>Using the Site for any unlawful purpose or in violation of these Terms.</li>
      </ul>

      <h2>10. Disclaimer of Warranties</h2>
      <p>
        The Site and all products are provided &quot;as is&quot; without warranties of any kind, express or implied,
        except as expressly stated in our <Link href="/refund">Refund Policy</Link>. We do not warrant that products are fit
        for any particular purpose beyond laboratory research.
      </p>

      <h2>11. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Sparta Labs shall not be liable for any indirect, incidental,
        special, consequential, or punitive damages arising from your use of the Site or any product purchased
        through it, including damages resulting from misuse of a research-use-only product.
      </p>

      <h2>12. Indemnification</h2>
      <p>
        You agree to indemnify and hold Sparta Labs harmless from any claims, damages, or expenses arising from your
        misuse of the Site or any product, or your violation of these Terms or applicable law.
      </p>

      <h2>13. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the State of North Carolina, without regard to its conflict of law
        principles, and any disputes shall be resolved exclusively in the state or federal courts located in North
        Carolina.
      </p>

      <h2>14. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the Site after changes are posted constitutes
        acceptance of the revised Terms.
      </p>

      <h2>15. Contact</h2>
      <p>
        Questions about these Terms can be directed to <a href="mailto:support@spartalabs.shop">support@spartalabs.shop</a>.
      </p>
    </LegalPageLayout>
  )
}
