import type { Metadata } from "next";
import Link from "next/link";
import { BusinessName, PolicyPage, PolicySection } from "@/components/legal/PolicyPage";
import { BUSINESS, getDisplayPhone } from "@/lib/legal";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro={
        <>
          At <BusinessName />, we respect your privacy and take reasonable steps to protect the personal
          information you share with us. This Privacy Policy explains what information we collect when you use our
          website, contact us or place an order, how we use it, and the choices available to you.
        </>
      }
    >
      <PolicySection heading="1. Information We Collect">
        <p>Depending on how you interact with us, we may collect:</p>
        <ul>
          <li>
            <strong>Contact information:</strong> Your name, phone/WhatsApp number, email address and shipping or
            billing address.
          </li>
          <li>
            <strong>Order information:</strong> Products purchased, order details, customisation requirements, order
            history and delivery information.
          </li>
          <li>
            <strong>Customisation information:</strong> Names, dates, messages, photographs, references or other
            information you voluntarily provide to create a customised product.
          </li>
          <li>
            <strong>Social media information:</strong> Your Instagram username or other social media details if you
            choose to share them with us.
          </li>
          <li>
            <strong>Payment information:</strong> Payment status, transaction IDs and related payment information.
          </li>
        </ul>
        <p className="mt-2 text-xs text-ink-soft/80">
          Your card, UPI, net banking and other payment credentials are processed directly by our payment partner,
          Razorpay. We do not store your complete card, UPI or banking credentials.
        </p>
      </PolicySection>

      <PolicySection heading="2. How We Use Your Information">
        <p>We use your information to:</p>
        <ul>
          <li>Process and fulfil your orders.</li>
          <li>Create and customise products according to your requirements.</li>
          <li>Arrange shipping and delivery.</li>
          <li>Contact you regarding your order through WhatsApp, phone or email.</li>
          <li>Process cancellations, refunds, returns and customer-support requests.</li>
          <li>Maintain order, accounting and business records.</li>
          <li>Comply with applicable legal, tax and regulatory requirements.</li>
          <li>Improve our website, products and customer experience.</li>
        </ul>
        <p className="mt-2">
          We do not sell your personal information to third parties. We also do not use your personal information
          for third-party advertising unless we separately inform you and obtain any consent required by applicable law.
        </p>
      </PolicySection>

      <PolicySection heading="3. Who We Share Your Information With">
        <p>We may share only the information reasonably necessary for the relevant purpose with:</p>
        <ul>
          <li>
            <strong>Payment providers:</strong> Such as Razorpay, to process your payment.
          </li>
          <li>
            <strong>Courier and delivery partners:</strong> To collect, transport and deliver your order. This may
            include your name, phone number and delivery address.
          </li>
          <li>
            <strong>Technology and service providers:</strong> Including website hosting, database, storage, analytics
            or other service providers that help us operate our website and business.
          </li>
          <li>
            <strong>Government or legal authorities:</strong> Where disclosure is required or permitted by applicable
            law.
          </li>
        </ul>
        <p className="mt-2 font-medium text-ink">We do not sell or rent your personal information to third parties.</p>
      </PolicySection>

      <PolicySection heading="4. Cookies & Local Storage">
        <p>
          Our website may use essential cookies and browser storage technologies to provide basic website functionality,
          remember your cart and improve your experience.
        </p>
        <p>
          Where applicable, non-essential cookies or similar technologies will be used only in accordance with applicable
          law and any consent requirements.
        </p>
        <p>
          You can control or disable cookies through your browser settings. Some website features may not function
          correctly if essential cookies are disabled.
        </p>
      </PolicySection>

      <PolicySection heading="5. Data Security">
        <p>
          We take reasonable technical and organisational measures to protect your personal information against
          unauthorised access, misuse, loss or disclosure. However, no website or method of electronic transmission
          can be guaranteed to be completely secure.
        </p>
      </PolicySection>

      <PolicySection heading="6. How Long We Keep Your Information">
        <p>
          We retain personal information only for as long as reasonably necessary for the purposes described in this
          Privacy Policy, including fulfilling orders, providing customer support, resolving disputes and meeting
          legal, tax and accounting requirements. When information is no longer required, we may securely delete or
          anonymise it, subject to applicable legal requirements.
        </p>
      </PolicySection>

      <PolicySection heading="7. Your Privacy Rights">
        <p>
          Subject to applicable law, you may request access to, correction of or deletion of your personal
          information. You may also withdraw consent where processing is based on consent, subject to any legal or
          contractual consequences of doing so.
        </p>
        <p>
          To make a privacy-related request, please <Link href="/contact-us">contact us</Link>. We may need to verify
          your identity before processing certain requests.
        </p>
      </PolicySection>

      <PolicySection heading="8. Children's Privacy">
        <p>
          Our website and services are not intended to knowingly collect personal information from children without the
          required consent or authorisation under applicable law. If you believe that a child has provided personal
          information to us without appropriate consent, please contact us so that we can take appropriate action.
        </p>
      </PolicySection>

      <PolicySection heading="9. Third-Party Websites & Services">
        <p>
          Our website may contain links to third-party websites or services, including payment, social media or other
          external platforms. We are not responsible for the privacy practices of third-party websites. We recommend
          reviewing their respective privacy policies before providing them with personal information.
        </p>
      </PolicySection>

      <PolicySection heading="10. Changes to This Privacy Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our business, website, services or
          applicable laws. The latest version will always be published on this page, with the updated date shown at the
          top.
        </p>
      </PolicySection>

      <PolicySection heading="11. Contact Us">
        <p>
          If you have questions about this Privacy Policy or want to make a privacy-related request, please contact us:
        </p>
        <ul>
          <li><strong>Email:</strong> {BUSINESS.email}</li>
          <li><strong>WhatsApp / Customer Care:</strong> {getDisplayPhone()}</li>
          {BUSINESS.address && <li><strong>Business Address:</strong> {BUSINESS.address}</li>}
        </ul>
        <p className="mt-2 text-xs text-ink-soft">
          We will handle privacy-related requests and complaints in accordance with applicable law.
        </p>
      </PolicySection>
    </PolicyPage>
  );
}
