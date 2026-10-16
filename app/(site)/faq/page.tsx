import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";
import { Eyebrow } from "@/components/home/Eyebrow";
import { Disclosure } from "@/components/ui/Disclosure";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FAQS } from "@/lib/site/faqs";
import { BUSINESS } from "@/lib/legal";
import { buildGenericWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Have questions before placing your order? Read our FAQ on references, custom colours, bulk gifting, shipping in India & worldwide, and resin care.",
};

// FAQPage structured data for SEO
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <Eyebrow>FAQ</Eyebrow>
      <h1 className="mt-3 font-display text-3xl font-medium uppercase leading-tight text-ink sm:text-4xl">
        Have a question before placing your order?
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
        Here are the answers to the things our customers ask us most. If you still can&apos;t find what you&apos;re
        looking for, WhatsApp us and we&apos;ll be happy to help.
      </p>

      <div className="mt-6 rounded-2xl border border-amber/30 bg-gradient-to-r from-lilac to-amber-light/30 p-5 sm:p-6">
        <p className="font-display text-lg font-medium text-ink">
          Customisation is at the heart of Spilled Colours.
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          Tell us your idea, reference, colours, budget and requirements &mdash; and we&apos;ll work with you to turn
          it into something real.
        </p>
      </div>

      <div className="mt-8 border-t border-border-soft">
        {FAQS.map(({ question, answer }) => (
          <Disclosure key={question} title={question}>
            <p className="leading-relaxed">{answer}</p>
          </Disclosure>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl bg-lilac p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-amber-dark">
            <WhatsAppIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-xl font-medium text-ink">Still have a question?</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              WhatsApp us at{" "}
              <a
                href={buildGenericWhatsAppUrl("Hi! I have a question about placing an order.")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink underline-offset-2 hover:underline"
              >
                +91 74510 11567
              </a>{" "}
              or email{" "}
              <a href={`mailto:${BUSINESS.email}`} className="font-medium text-ink underline-offset-2 hover:underline">
                {BUSINESS.email}
              </a>
              . We&apos;re happy to discuss custom, bulk and urgent orders.
            </p>
          </div>
        </div>
        <ButtonLink
          href={buildGenericWhatsAppUrl("Hi! I have a question about placing an order.")}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs uppercase tracking-[0.12em]"
        >
          Chat on WhatsApp <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>

      <div className="mt-8 rounded-xl border border-border-soft/60 bg-cream/40 p-4 text-xs leading-relaxed text-ink-soft">
        <span className="font-semibold text-ink">Legal Policies:</span> For detailed information, our{" "}
        <Link href="/terms-and-conditions" className="text-amber-dark underline hover:text-ink">
          Terms &amp; Conditions
        </Link>
        ,{" "}
        <Link href="/shipping-policy" className="text-amber-dark underline hover:text-ink">
          Shipping Policy
        </Link>
        ,{" "}
        <Link href="/refund-policy" className="text-amber-dark underline hover:text-ink">
          Refund &amp; Cancellation Policy
        </Link>
        , and{" "}
        <Link href="/privacy-policy" className="text-amber-dark underline hover:text-ink">
          Privacy Policy
        </Link>{" "}
        are available separately.
      </div>
    </div>
  );
}
