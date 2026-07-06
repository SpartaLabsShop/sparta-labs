import { LegalPageLayout } from '@/components/shared/LegalPageLayout'

export const metadata = {
  title: 'Refund Policy | Sparta Labs',
}

export default function RefundPage() {
  return (
    <LegalPageLayout title="Refund Policy" lastUpdated="July 7, 2026" breadcrumbLabel="Refund">
      <h2>1. Overview</h2>
      <p>
        Because our products are lyophilized peptides and research compounds shipped in sealed, tamper-evident vials,
        we maintain a strict policy to protect the chain of custody and purity of every order. This policy explains
        when a refund, replacement, or cancellation is available.
      </p>

      <h2>2. Order Cancellations</h2>
      <p>
        Orders can be cancelled free of charge any time before they ship. Once an order has entered fulfillment or
        shipped, it can no longer be cancelled and instead falls under the terms below. To request a cancellation,
        contact <a href="mailto:support@spartalabs.shop">support@spartalabs.shop</a> as soon as possible referencing
        your order number.
      </p>

      <h2>3. Damaged, Missing, or Incorrect Items</h2>
      <p>
        If your order arrives damaged, incomplete, or incorrect, contact{' '}
        <a href="mailto:support@spartalabs.shop">support@spartalabs.shop</a> within 48 hours of delivery with your
        order number and photos of the affected items and packaging. Verified claims are resolved with a free
        replacement or a full refund to your original payment method, at our discretion.
      </p>

      <h2>4. Non-Returnable Items</h2>
      <p>
        Because of the sensitive, research-grade nature of our products, opened or reconstituted vials cannot be
        returned for a refund once they leave our facility, except in cases covered under Section 3 above. Unopened
        products may be eligible for return within 14 days of delivery at our discretion; contact us before shipping
        anything back, as unauthorized returns will not be accepted or refunded.
      </p>

      <h2>5. Refund Method &amp; Processing Time</h2>
      <p>
        Approved refunds are issued to the original payment method used at checkout. Card refunds via Stripe
        typically appear within 5–10 business days depending on your bank. Refunds for orders paid via Zelle are
        issued via Zelle to the sending account and may take longer to process.
      </p>

      <h2>6. Shipping Costs</h2>
      <p>
        Original shipping charges are non-refundable except where the return or replacement is the result of our
        error (damaged, missing, or incorrect items). Return shipping costs for approved unopened-item returns are
        the responsibility of the customer unless otherwise agreed in writing.
      </p>

      <h2>7. Coupon &amp; Affiliate Discount Orders</h2>
      <p>
        Refunds on orders placed using a coupon code or affiliate discount are issued for the amount actually paid.
        Any associated affiliate commission on a refunded order will be reversed.
      </p>

      <h2>8. Contact</h2>
      <p>
        To start a refund, replacement, or cancellation request, email{' '}
        <a href="mailto:support@spartalabs.shop">support@spartalabs.shop</a> with your order number. Most requests are
        resolved within 1–2 business days.
      </p>
    </LegalPageLayout>
  )
}
