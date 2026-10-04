import type { Metadata } from "next";
import Link from "next/link";
import { BusinessName, PolicyPage, PolicySection } from "@/components/legal/PolicyPage";
import { BUSINESS } from "@/lib/legal";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      intro={
        <>
          These terms govern your use of this website and any purchase you make from <BusinessName />. By placing
          an order, you agree to them.
        </>
      }
    >
      <PolicySection heading="Our products">
        <p>
          Every piece is handmade from resin. Colours, patterns, bubbles and finish will vary slightly from the
          photos and from piece to piece. This is part of handmade work and not a defect. Colours may also look
          different on different screens.
        </p>
        <p>
          For custom or personalised orders, we will confirm the design with you on WhatsApp before we start. Once
          you approve a custom design, it cannot be cancelled or returned.
        </p>
      </PolicySection>

      <PolicySection heading="Prices and payment">
        <ul>
          <li>All prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.</li>
          <li>
            All orders are prepaid. You pay online (UPI, cards, net banking or wallets) through our payment
            partner Razorpay. We do not offer Cash on Delivery.
          </li>
          <li>
            We do not store your card, UPI or bank details. Online payments are processed securely by Razorpay.
          </li>
          <li>We may change prices at any time, but the price you pay is the one shown when you placed the order.</li>
        </ul>
      </PolicySection>

      <PolicySection heading="Orders">
        <p>
          An order is confirmed once we receive your payment. We may refuse or cancel an order if an item is
          unavailable, the pricing was clearly wrong, or the order looks fraudulent. If we cancel a prepaid order, you get a full refund.
        </p>
      </PolicySection>

      <PolicySection heading="Shipping, cancellations and refunds">
        <p>
          See our <Link href="/shipping-policy">Shipping Policy</Link> and{" "}
          <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>. They form part of these terms.
        </p>
      </PolicySection>

      <PolicySection heading="Intellectual property">
        <p>
          All designs, photos, videos and text on this website belong to {BUSINESS.brandName}. Please do not copy or
          reuse them without our written permission.
        </p>
      </PolicySection>

      <PolicySection heading="Limitation of liability">
        <p>
          Our products are decorative and should be used as described. Resin items are not heat-proof or food-safe
          unless we say so explicitly. Our liability for any order is limited to the amount you paid for that order.
        </p>
      </PolicySection>

      <PolicySection heading="Governing law">
        <p>
          These terms are governed by the laws of India
          {BUSINESS.jurisdictionCity &&
            `, and any disputes are subject to the jurisdiction of the courts in ${BUSINESS.jurisdictionCity}`}
          .
        </p>
      </PolicySection>

      <PolicySection heading="Contact">
        <p>
          Questions about these terms? <Link href="/contact-us">Contact us</Link>.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
