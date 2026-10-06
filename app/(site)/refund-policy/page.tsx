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
        <p>
          Cancellations are <strong>not allowed once your order is in process</strong>, under any circumstances.
        </p>
      </PolicySection>

      <PolicySection heading="Returns">
        <p>
          Because each piece is handmade, we do not accept returns for change of mind. Small variations in colour,
          pattern or finish are part of handmade resin work and are not defects.
        </p>
      </PolicySection>

      <PolicySection heading="Defective or Wrong Items">
        <p>
          If you receive the wrong item, or an item with a defect in how we made it, we will replace it or give
          you a refund. To claim:
        </p>
        <ul>
          <li>
            Contact us within <strong>{POLICY.damageReportHours} hours of delivery</strong> with your order number.
          </li>
          <li>
            Send an <strong>uncut unboxing video, from start to end</strong>, and photos of the issue. We cannot
            accept claims without it.
          </li>
          <li>Keep the item and packaging until we resolve your claim.</li>
        </ul>
      </PolicySection>

      <PolicySection heading="Damage During Transit">
        <p>
          We share photos and videos of every product before dispatch and pack each piece carefully, but we are
          not responsible for damage or delay caused by the courier. We will still try to help find a solution,
          for which an uncut unboxing video is required. See our{" "}
          <Link href="/shipping-policy">Shipping Policy</Link>.
        </p>
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
