import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, PolicySection } from "@/components/legal/PolicyPage";
import { BUSINESS, POLICY, getDisplayPhone } from "@/lib/legal";
import { buildGenericWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  const whatsappUrl = buildGenericWhatsAppUrl();

  return (
    <PolicyPage title="Shipping Policy" intro="We deliver our handmade resin pieces worldwide.">
      <PolicySection heading="1. Turnaround Time">
        <p>
          Each piece is handmade, customised and finished with care. Our standard turnaround time is{" "}
          <strong>{POLICY.turnaroundDays} days</strong> from order confirmation to dispatch.
        </p>
        <p>
          The turnaround time may vary depending on the product, quantity, level of customisation and order volume.
        </p>
        <div className="mt-3 rounded-2xl border border-border-soft bg-lilac/40 p-4">
          <p className="font-medium text-ink">Urgent Orders</p>
          <p className="mt-1 text-sm text-ink-soft">
            Need your order sooner? We do accept urgent orders, subject to our production schedule and the requirements
            of your order.
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            Please mention your required delivery date in the order notes or{" "}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline">
              message us on WhatsApp
            </a>{" "}
            before placing your order so that we can check the timeline and confirm whether we can accommodate your
            request.
          </p>
          <p className="mt-1 text-xs text-ink-soft/80">
            An urgent order will be considered confirmed only after the timeline has been discussed and approved by
            Spilled Colours.
          </p>
        </div>
      </PolicySection>

      <PolicySection heading="2. Delivery Time">
        <p>
          <strong>Within India:</strong> Delivery usually takes <strong>{POLICY.deliveryDays} business days</strong>{" "}
          after dispatch, depending on your location and the courier service.
        </p>
        <p>
          <strong>International Orders:</strong> International delivery timelines depend on the destination country,
          courier service, customs clearance and other factors beyond our control.
        </p>
        <p className="text-xs text-ink-soft">
          All delivery timelines are estimates and are not guaranteed. Courier, customs or other external delays may
          occur after dispatch.
        </p>
      </PolicySection>

      <PolicySection heading="3. Shipping Charges">
        <p>
          Shipping charges are <strong>not displayed at checkout</strong>.
        </p>
        <p>
          After your order is placed, we will calculate the applicable shipping charges and share them with you on
          WhatsApp. <strong>The order will be dispatched only after the applicable shipping charges have been paid.</strong>
        </p>
        <p>
          Shipping charges are calculated based on the parcel&apos;s actual weight or volumetric weight, whichever is
          higher, along with the delivery location and applicable courier charges.
        </p>
      </PolicySection>

      <PolicySection heading="4. Tracking">
        <p>
          Once your order has been dispatched, the tracking details will be shared with you on your WhatsApp number.
          Tracking updates are provided by the courier and may take some time to reflect after dispatch.
        </p>
      </PolicySection>

      <PolicySection heading="5. Packaging & Transit Damage">
        <p>
          Before dispatch, we share photos and/or videos of your finished product with you for approval. The product is
          dispatched after the required approval is received.
        </p>
        <p>
          We pack each and every product carefully and securely to minimise the risk of damage during transit. However,
          once the parcel has been handed over to the courier, Spilled Colours is not responsible for any damage or
          delay caused by the courier or delivery partner during transit.
        </p>
        <p>
          If your parcel arrives damaged, please contact us within {POLICY.damageReportHours} hours of delivery. We will
          still try our best to help you resolve the issue and provide a suitable solution wherever possible.
        </p>
        <p className="font-medium text-ink">
          An uncut/uninterrupted unboxing video, from the beginning of opening the package until the product is fully
          revealed, is required to help us assess the condition of the parcel and assist you with the issue.
        </p>
        <p className="text-xs text-ink-soft">
          Please retain the product, packaging and shipping materials until the matter has been resolved.
        </p>
      </PolicySection>

      <PolicySection heading="6. Delivery Issues">
        <p>
          Please ensure that your name, complete delivery address, pincode, phone/WhatsApp number and other required
          details are correct when placing your order.
        </p>
        <p>
          If a parcel is returned to us because of an incorrect or incomplete address, incorrect contact details,
          refusal to accept the parcel, or failure to receive the parcel, any additional shipping or re-shipping charges
          will be payable by the customer.
        </p>
      </PolicySection>

      <PolicySection heading="7. International Shipping">
        <p>
          For international orders, please{" "}
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline">
            WhatsApp us
          </a>{" "}
          your complete delivery address and the product(s) you wish to order. We will check the applicable shipping
          charges with the courier and confirm them with you before accepting the order.
        </p>
        <p>
          International shipping charges may vary depending on the parcel&apos;s weight, volumetric weight, destination
          and courier service. Any customs duties, import taxes or other charges imposed by the destination country,
          where applicable, are the responsibility of the customer unless specifically stated otherwise.
        </p>
        <p>
          You can also contact us through our <Link href="/contact-us">Contact page</Link> for international orders and
          shipping enquiries.
        </p>
      </PolicySection>

      <PolicySection heading="8. Contact Us">
        <p>
          For shipping-related questions, urgent orders or delivery assistance, please contact us:
        </p>
        <ul>
          <li><strong>Spilled Colours</strong></li>
          <li><strong>WhatsApp:</strong> {getDisplayPhone()}</li>
          <li><strong>Email:</strong> {BUSINESS.email}</li>
        </ul>
        <p className="mt-2 text-xs text-ink-soft">
          For urgent orders, please contact us before placing your order so we can confirm whether your required timeline
          can be accommodated.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
