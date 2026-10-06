import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, PolicySection } from "@/components/legal/PolicyPage";
import { POLICY } from "@/lib/legal";
import { buildGenericWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  const whatsappUrl = buildGenericWhatsAppUrl();

  return (
    <PolicyPage title="Shipping Policy" intro="We deliver our handmade resin pieces worldwide.">
      <PolicySection heading="Turnaround Time">
        <p>
          Each piece is made and finished by hand, so our turnaround time is{" "}
          <strong>{POLICY.turnaroundDays} days</strong> from order confirmation to dispatch.
        </p>
        <p>
          For any urgent order, please{" "}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            WhatsApp us
          </a>{" "}
          and discuss it with us <strong>before</strong> placing your order.
        </p>
      </PolicySection>

      <PolicySection heading="Delivery Time">
        <p>
          Within India, delivery usually takes <strong>{POLICY.deliveryDays} business days</strong> after
          dispatch, depending on your location. International delivery times depend on the destination country and
          the courier. These are estimates, and courier delays can happen.
        </p>
      </PolicySection>

      <PolicySection heading="Shipping Charges">
        <ul>
          <li>
            Shipping charges are <strong>not shown at checkout</strong>. We will send them to you on WhatsApp after
            you place your order, and your order will be dispatched only once these dues are cleared.
          </li>
          <li>
            Shipping charges are calculated on the parcel&apos;s actual weight or volumetric weight (whichever is
            higher), and on your delivery location.
          </li>
        </ul>
      </PolicySection>

      <PolicySection heading="Tracking">
        <p>Once your order is dispatched, we will send the tracking details to your WhatsApp number.</p>
      </PolicySection>

      <PolicySection heading="Packaging and Transit Damage">
        <ul>
          <li>
            Before dispatch, we share photos and videos of your product with you. We dispatch it only once you
            approve.
          </li>
          <li>We pack every piece carefully to protect it from damage during transit.</li>
          <li>
            However, we are <strong>not responsible for any damage or delay caused by the courier</strong> during
            transit.
          </li>
          <li>
            If your parcel does arrive damaged, we will still try to help find a solution. For this, an{" "}
            <strong>uncut unboxing video, from start to end</strong>, is required.
          </li>
        </ul>
      </PolicySection>

      <PolicySection heading="Delivery Issues">
        <ul>
          <li>Please make sure your address, pincode and WhatsApp number are correct when you order.</li>
          <li>
            If a parcel is returned to us because of a wrong address or because no one was available to receive
            it, re-shipping will cost extra.
          </li>
        </ul>
      </PolicySection>

      <PolicySection heading="International Shipping">
        <p>
          Kindly{" "}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            WhatsApp us
          </a>{" "}
          your full address and the product you want to order, so that we can confirm the shipping charges with
          the courier company before accepting your order. You can also reach us through our{" "}
          <Link href="/contact-us">Contact page</Link>.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
