import type { Metadata } from "next";
import Link from "next/link";
import { BusinessName, PolicyPage, PolicySection } from "@/components/legal/PolicyPage";
import { BUSINESS, getDisplayPhone } from "@/lib/legal";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      intro={
        <>
          Welcome to <BusinessName />. By accessing our website or placing an order with us, you agree to the
          following Terms &amp; Conditions.
        </>
      }
    >
      <PolicySection heading="1. About Our Products">
        <p>
          All Spilled Colours products are handmade and may have minor variations in colour, pattern, texture,
          bubbles, inclusions and finish. These variations are a natural part of handmade resin work and are not
          considered defects.
        </p>
        <p>Product colours may also appear slightly different depending on your device or screen settings.</p>
        <p>
          For customised or personalised orders, the design and relevant details will be confirmed with you before
          production begins. Once a customised design has been approved, production will begin based on the approved
          details.
        </p>
      </PolicySection>

      <PolicySection heading="2. Customised & Personalised Orders">
        <p>
          Customised products are created specifically according to your requirements and therefore cannot ordinarily
          be cancelled, exchanged or returned once production has started.
        </p>
        <p>
          This does not affect your rights in case the product is received damaged, defective, materially different
          from the approved design, or otherwise not as agreed.
        </p>
        <p>
          Customers are responsible for carefully checking the approved design, spelling, names, dates, colours and
          other personalised details before confirming production. Spilled Colours will not be responsible for errors
          that were approved by the customer.
        </p>
      </PolicySection>

      <PolicySection heading="3. Prices & Payment">
        <ul>
          <li>All prices displayed on our website are in Indian Rupees (INR) unless stated otherwise.</li>
          <li>Applicable taxes, if any, will be displayed or communicated as applicable to the order.</li>
          <li>
            All orders are prepaid. We currently accept online payments through our payment partner, Razorpay, including
            available UPI, card, net banking and wallet options.
          </li>
          <li>We do not offer Cash on Delivery unless specifically stated for a particular product or promotion.</li>
          <li>
            Payment information such as card, UPI or banking credentials is processed by the payment provider. Spilled
            Colours does not store your complete card or banking credentials.
          </li>
          <li>
            We reserve the right to change product prices at any time. The price applicable to your order will be the
            price communicated/displayed at the time the order is placed and payment is made.
          </li>
        </ul>
      </PolicySection>

      <PolicySection heading="4. Order Confirmation">
        <p>An order is considered confirmed once payment has been successfully received.</p>
        <p>
          We reserve the right to refuse or cancel an order in limited circumstances, including product unavailability,
          an obvious pricing or listing error, suspected fraudulent activity, or circumstances beyond our reasonable
          control.
        </p>
        <p>If we cancel a prepaid order, the amount received for that cancelled order will be refunded.</p>
      </PolicySection>

      <PolicySection heading="5. Shipping & Delivery">
        <p>
          Shipping timelines, delivery conditions, applicable shipping charges and other delivery-related information
          are provided in our <Link href="/shipping-policy">Shipping Policy</Link>.
        </p>
        <p>
          Once an order has been handed over to the courier, delivery is subject to the courier&apos;s network,
          serviceability and circumstances beyond our control.
        </p>
        <p>
          For international orders, customs duties, import taxes or other charges imposed by the destination country,
          where applicable, are the responsibility of the customer unless specifically stated otherwise.
        </p>
      </PolicySection>

      <PolicySection heading="6. Cancellation, Returns & Refunds">
        <p>
          Our cancellation, return, replacement and refund conditions are explained in our{" "}
          <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>, which forms part of these Terms &amp;
          Conditions.
        </p>
        <p>Nothing in these Terms limits any rights or remedies available to consumers under applicable Indian law.</p>
      </PolicySection>

      <PolicySection heading="7. Product Care & Usage">
        <p>Our products are primarily decorative and should be used only for their intended purpose.</p>
        <p>
          Resin products should be kept away from excessive heat, direct prolonged sunlight, open flames and harsh
          chemicals unless the specific product is designed for such use.
        </p>
        <p>Customers are responsible for following any care instructions provided with their order.</p>
      </PolicySection>

      <PolicySection heading="8. Intellectual Property">
        <p>
          All photographs, product designs, graphics, videos, written content, logos and other material displayed on the
          Spilled Colours website and social media channels are owned by or licensed to Spilled Colours unless otherwise
          stated.
        </p>
        <p>
          You may not copy, reproduce, modify, distribute, commercially use or publish our content or designs without
          prior written permission.
        </p>
      </PolicySection>

      <PolicySection heading="9. Website Information">
        <p>
          We make reasonable efforts to ensure that product descriptions, photographs, prices and other information on
          our website are accurate and up to date.
        </p>
        <p>
          However, handmade products may have minor variations from photographs, and we do not guarantee that colours
          displayed on every device will be identical to the physical product.
        </p>
      </PolicySection>

      <PolicySection heading="10. Limitation of Liability">
        <p>
          To the extent permitted by applicable law, Spilled Colours will not be responsible for indirect or
          consequential losses arising from the use of our products or website.
        </p>
        <p>
          Nothing in these Terms excludes or limits liability that cannot legally be excluded or limited under
          applicable law.
        </p>
      </PolicySection>

      <PolicySection heading="11. Changes to These Terms">
        <p>
          We may update these Terms &amp; Conditions from time to time to reflect changes to our business, website,
          services or applicable laws. The updated version will be published on this page with a revised
          &ldquo;Last updated&rdquo; date.
        </p>
      </PolicySection>

      <PolicySection heading="12. Governing Law">
        <p>
          These Terms &amp; Conditions are governed by the laws of India. Any dispute will be subject to the applicable
          dispute-resolution mechanisms and jurisdiction provided under Indian law.
        </p>
      </PolicySection>

      <PolicySection heading="13. Contact & Grievance Redressal">
        <p>For questions, complaints or concerns regarding an order or these Terms, please contact:</p>
        <ul>
          <li><strong>Spilled Colours</strong></li>
          <li><strong>Email:</strong> {BUSINESS.email}</li>
          <li><strong>WhatsApp / Customer Care:</strong> {getDisplayPhone()}</li>
          {BUSINESS.address && <li><strong>Business Address:</strong> {BUSINESS.address}</li>}
        </ul>
        <p className="mt-2 text-xs text-ink-soft">
          We will make reasonable efforts to address customer complaints promptly and in accordance with applicable
          law.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
