import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, PolicySection } from "@/components/legal/PolicyPage";
import { POLICY } from "@/lib/legal";

export const metadata: Metadata = { title: "Refund & Cancellation Policy" };

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund & Cancellation Policy"
      intro="Every piece is handmade, often to order, so this policy is a little different from a regular store. Please read it before you buy."
    >
      <PolicySection heading="Cancellations">
        <ul>
          <li>
            You can cancel your order for free <strong>before it is dispatched</strong>. Message us on WhatsApp with
            your order number.
          </li>
          <li>Once an order has been dispatched, it can no longer be cancelled.</li>
          <li>Custom or personalised orders cannot be cancelled once you approve the design.</li>
        </ul>
      </PolicySection>

      <PolicySection heading="Returns">
        <p>
          Because each piece is handmade, we do not accept returns for change of mind. Small variations in colour,
          pattern or finish are part of handmade resin work and are not defects.
        </p>
      </PolicySection>

      <PolicySection heading="Damaged, defective or wrong items">
        <p>
          If your order arrives damaged, defective or is not what you ordered, we will replace it or give you a
          refund. To claim:
        </p>
        <ul>
          <li>
            Contact us within <strong>{POLICY.damageReportHours} hours of delivery</strong> with your order number.
          </li>
          <li>
            Send a clear <strong>unboxing video</strong> and photos of the damage. We cannot accept claims without
            an unboxing video.
          </li>
          <li>Keep the item and packaging until we resolve your claim.</li>
        </ul>
      </PolicySection>

      <PolicySection heading="Refunds">
        <ul>
          <li>Approved refunds are made to your original payment method (UPI, card, net banking or wallet).</li>
          <li>
            Refunds usually reach you within <strong>{POLICY.refundDays} business days</strong> after approval,
            depending on your bank.
          </li>
          <li>If we cancel your order for any reason, you get a full refund.</li>
        </ul>
      </PolicySection>

      <PolicySection heading="Need help?">
        <p>
          <Link href="/contact-us">Contact us</Link> and we will sort it out with you.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
