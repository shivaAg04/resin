import type { Metadata } from "next";
import { PolicyPage, PolicySection } from "@/components/legal/PolicyPage";
import { BUSINESS, POLICY, getDisplayPhone } from "@/lib/legal";

export const metadata: Metadata = { title: "Refund & Cancellation Policy" };

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund & Cancellation Policy"
      intro={
        <>
          At Spilled Colours, most of our products are handmade and many are customised specifically for you.
          Because of this, cancellations, returns and refunds work differently from a standard retail store. Please
          read this policy carefully before placing your order.
        </>
      }
    >
      <PolicySection heading="1. Order Cancellations">
        <p>
          Once an order has entered production or customisation, it cannot be cancelled because materials and production
          may already have been committed specifically to your order.
        </p>
        <p>For customised or personalised orders, cancellation is not possible once production has started.</p>
        <p>
          If an order has not yet entered production, you may contact us as soon as possible to request cancellation.
          Cancellation will be subject to our confirmation.
        </p>
        <p>If Spilled Colours cancels an order, the amount paid for the cancelled order will be refunded.</p>
        <p className="text-xs text-ink-soft">
          Nothing in this policy limits any cancellation or consumer rights that cannot legally be excluded under
          applicable law.
        </p>
      </PolicySection>

      <PolicySection heading="2. Returns">
        <p>
          We do not accept returns simply because you have changed your mind, selected the wrong colour, size or design,
          or no longer require the product, particularly where the product has been customised or personalised.
        </p>
        <p>
          Minor variations in colour, pattern, texture, bubbles, inclusions or finish are natural characteristics of
          handmade resin products and are not considered defects.
        </p>
        <p>
          If a product is defective, incorrect or materially different from what was agreed, please contact us and we
          will review the issue in accordance with this policy and applicable law.
        </p>
      </PolicySection>

      <PolicySection heading="3. Wrong, Defective or Incorrect Products">
        <p>If you receive:</p>
        <ul>
          <li>The wrong product;</li>
          <li>A product with a manufacturing defect;</li>
          <li>A product that is materially different from the approved custom design; or</li>
          <li>A product that is otherwise not as agreed,</li>
        </ul>
        <p className="mt-2 font-medium text-ink">
          please contact us within {POLICY.damageReportHours} hours of delivery.
        </p>
        <p className="mt-2">Please provide:</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Your order number;</li>
          <li>Clear photographs of the product and issue; and</li>
          <li>An uncut/uninterrupted unboxing video showing the package from the time it is opened.</li>
        </ol>
        <p className="mt-2">
          Please keep the product, packaging and shipping materials until the issue has been resolved. After reviewing
          the issue, we may offer an appropriate remedy, which may include a replacement, repair or refund, depending
          on the circumstances.
        </p>
      </PolicySection>

      <PolicySection heading="4. Damage During Transit">
        <p>We pack each and every product carefully and securely before dispatch.</p>
        <p>
          However, once the order has been handed over to the courier, we are not responsible for any damage caused
          during transit by the courier or delivery partner.
        </p>
        <p>
          If your order arrives damaged, please contact us within {POLICY.damageReportHours} hours of delivery. To help
          us understand the condition in which the package was received and assist you with the issue, an
          uncut/uninterrupted opening video of the package is required, along with clear photographs of the damage.
        </p>
        <p>
          Although courier-related damage is outside our responsibility, we will try our best to help you resolve the
          issue and provide a suitable solution to fix the damaged product wherever possible. Please keep the product,
          packaging and shipping materials until the issue has been resolved.
        </p>
      </PolicySection>

      <PolicySection heading="5. Customised & Personalised Orders">
        <p>
          Because customised products are created specifically according to your requirements, they cannot be returned
          or cancelled once production has started due to a change of mind.
        </p>
        <p>Before production begins, we may share design details or a reference for your approval.</p>
        <p>
          Please carefully check all names, spellings, dates, colours, sizes and other personalised details before
          approving the design. If an error is made by Spilled Colours, we will work with you to provide an appropriate
          resolution. If a personalised detail was supplied or approved incorrectly by the customer, we may not be able
          to offer a replacement or refund for that error.
        </p>
      </PolicySection>

      <PolicySection heading="6. Refunds">
        <p>Where a refund is approved, it will be processed to the original payment method used for the order.</p>
        <p>
          Once initiated, refunds usually reach the customer within {POLICY.refundDays} business days, depending on the
          payment provider or bank. The actual processing time may vary depending on the payment method and financial
          institution.
        </p>
      </PolicySection>

      <PolicySection heading="7. Shipping Charges">
        <p>Shipping charges are non-refundable in case of any approved return or exchange.</p>
        <p>
          If a return or exchange is approved by Spilled Colours, the original shipping charges paid by the customer
          will not be refunded. Any additional shipping charges for sending a replacement or exchanged product may also
          be payable by the customer, where applicable.
        </p>
      </PolicySection>

      <PolicySection heading="8. How to Contact Us">
        <p>
          For cancellation, return, damage or refund-related assistance, please contact us with your order number and
          relevant photographs/videos:
        </p>
        <ul>
          <li><strong>Email:</strong> {BUSINESS.email}</li>
          <li><strong>WhatsApp / Customer Care:</strong> {getDisplayPhone()}</li>
        </ul>
        <p className="mt-2 text-xs text-ink-soft">
          We aim to review and respond to customer issues as promptly as possible. This policy is subject to applicable
          Indian consumer protection and e-commerce laws.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
