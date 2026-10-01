import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, PolicySection } from "@/components/legal/PolicyPage";
import { POLICY } from "@/lib/legal";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <PolicyPage title="Shipping Policy" intro="We ship our handmade resin pieces to addresses across India.">
      <PolicySection heading="Processing time">
        <p>
          Each piece is made and finished by hand, so orders are usually dispatched within{" "}
          <strong>{POLICY.dispatchDays} business days</strong> of confirmation. Custom orders may take longer, and
          we will tell you the expected time when we confirm your design.
        </p>
      </PolicySection>

      <PolicySection heading="Delivery time">
        <p>
          After dispatch, delivery usually takes <strong>{POLICY.deliveryDays} business days</strong>, depending on
          your location. Remote areas may take longer. These are estimates, and courier delays can happen.
        </p>
      </PolicySection>

      <PolicySection heading="Shipping charges">
        <p>Any shipping charge is shown at checkout or confirmed with you on WhatsApp before you pay.</p>
      </PolicySection>

      <PolicySection heading="Tracking">
        <p>Once your order is dispatched, we will send the tracking details to your WhatsApp number.</p>
      </PolicySection>

      <PolicySection heading="Delivery issues">
        <ul>
          <li>Please make sure your address, pincode and WhatsApp number are correct when you order.</li>
          <li>
            If a parcel is returned to us because of a wrong address or because no one was available to receive
            it, re-shipping may cost extra.
          </li>
          <li>
            If your order arrives damaged, see our <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>.
          </li>
        </ul>
      </PolicySection>

      <PolicySection heading="International shipping">
        <p>
          We currently ship only within India. For international orders, <Link href="/contact-us">contact us</Link>{" "}
          first.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
