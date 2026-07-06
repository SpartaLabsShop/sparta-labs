import { LegalPageLayout } from '@/components/shared/LegalPageLayout'

export const metadata = {
  title: 'Disclaimer | Sparta Labs',
}

export default function DisclaimerPage() {
  return (
    <LegalPageLayout title="Disclaimer" lastUpdated="July 7, 2026" breadcrumbLabel="Disclaimer">
      <h2>1. Research Use Only</h2>
      <p>
        Every product sold on spartalabs.shop is intended strictly for laboratory and in-vitro research use by
        qualified individuals and institutions. Products are not for personal use of any kind.
      </p>

      <h2>2. FDA Statement</h2>
      <p>
        These statements have not been evaluated by the Food and Drug Administration. These products are not
        intended to diagnose, treat, cure, or prevent any disease. All products offered are for laboratory and
        research use only.
      </p>

      <h2>3. Not for Human or Animal Consumption</h2>
      <p>
        No product sold on this Site is a drug, food, dietary supplement, or cosmetic, and none are intended for
        human or animal consumption, injection, or any other form of use in or on a living organism outside of a
        licensed research setting. Any use outside of laboratory research is done at the user&apos;s own risk and in
        violation of the terms under which these products are sold.
      </p>

      <h2>4. Assumption of Risk</h2>
      <p>
        By purchasing from Sparta Labs, you acknowledge and assume full responsibility and risk for how the product
        is subsequently stored, handled, and used. Sparta Labs assumes no liability for outcomes resulting from
        misuse, mishandling, or use inconsistent with the research-only purpose described on this Site.
      </p>

      <h2>5. No Medical or Professional Advice</h2>
      <p>
        Nothing on this Site, including product descriptions, journal articles, or customer support communications,
        constitutes medical, veterinary, or professional advice. Content is provided for general research and
        informational purposes only and should not be relied upon as a substitute for consultation with a qualified
        professional.
      </p>

      <h2>6. Compliance &amp; Legal Responsibility</h2>
      <p>
        Regulations governing the purchase, import, and possession of research compounds vary by country, state, and
        institution. It is the sole responsibility of the purchaser to ensure that acquiring and possessing any
        product from this Site complies with all applicable laws in their jurisdiction. Sparta Labs is not
        responsible for shipments delayed, seized, or destroyed by customs or postal authorities as a result of local
        regulations.
      </p>

      <h2>7. Third-Party Links</h2>
      <p>
        This Site may contain links to third-party websites, including scientific literature and payment providers.
        We are not responsible for the content, accuracy, or practices of any third-party site.
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Sparta Labs disclaims all liability for any injury, loss, or damage
        of any kind arising from the purchase, handling, or use of any product sold on this Site outside of its
        stated research purpose.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about this Disclaimer can be directed to{' '}
        <a href="mailto:support@spartalabs.shop">support@spartalabs.shop</a>.
      </p>
    </LegalPageLayout>
  )
}
