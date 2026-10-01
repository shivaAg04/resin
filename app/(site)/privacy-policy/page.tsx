import type { Metadata } from "next";
import Link from "next/link";
import { BusinessName, PolicyPage, PolicySection } from "@/components/legal/PolicyPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro={
        <>
          This policy explains what personal information <BusinessName /> collects when you use this website or
          place an order, and how we use it.
        </>
      }
    >
      <PolicySection heading="What we collect">
        <ul>
          <li>Your name, WhatsApp number and shipping address, so we can deliver your order.</li>
          <li>Your Instagram username and order notes, if you choose to give them.</li>
          <li>Your order history: what you bought, when, and how you paid.</li>
          <li>
            Payment details such as transaction IDs. Card, UPI and bank details are entered directly with Razorpay,
            our payment partner. We never see or store them.
          </li>
        </ul>
      </PolicySection>

      <PolicySection heading="How we use it">
        <ul>
          <li>To process, ship and deliver your order, and to update you about it on WhatsApp.</li>
          <li>To handle refunds, returns and support requests.</li>
          <li>To meet legal, tax and accounting obligations.</li>
        </ul>
        <p>We do not sell your personal information or use it for third-party advertising.</p>
      </PolicySection>

      <PolicySection heading="Who we share it with">
        <ul>
          <li>Razorpay, to process online payments.</li>
          <li>Courier and delivery partners, to ship your order.</li>
          <li>Our hosting and database providers, who store data on our behalf.</li>
          <li>Government authorities, when required by law.</li>
        </ul>
      </PolicySection>

      <PolicySection heading="Cookies">
        <p>
          We use essential cookies and your browser&apos;s local storage to keep your cart and to make the site
          work. We do not use advertising cookies.
        </p>
      </PolicySection>

      <PolicySection heading="Data security and retention">
        <p>
          We use reasonable security measures to protect your data. We keep order records for as long as needed to
          fulfil orders and to meet legal requirements.
        </p>
      </PolicySection>

      <PolicySection heading="Your choices">
        <p>
          You can ask us to view, correct or delete your personal information at any time, unless we are legally
          required to keep it. <Link href="/contact-us">Contact us</Link> to make a request.
        </p>
      </PolicySection>

      <PolicySection heading="Changes to this policy">
        <p>We may update this policy from time to time. The date at the top shows when it last changed.</p>
      </PolicySection>
    </PolicyPage>
  );
}
