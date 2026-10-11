import type { Metadata } from "next";
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
  description: "Custom orders, colours, shipping in India and worldwide, bulk orders and resin care — answered.",
};

// FAQPage structured data, so search engines can show these answers directly.
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

      <Eyebrow>Help</Eyebrow>
      <h1 className="mt-2 font-display text-4xl font-medium text-ink sm:text-5xl">Frequently Asked Questions</h1>

      <div className="mt-8 border-t border-border-soft">
        {FAQS.map(({ question, answer }) => (
          <Disclosure key={question} title={question}>
            <p>{answer}</p>
          </Disclosure>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 rounded-lg bg-lilac p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-amber-dark">
            <WhatsAppIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-xl font-medium text-ink">Still have a question?</p>
            <p className="mt-0.5 text-sm text-ink-soft">
              Chat with us on WhatsApp or drop us an email at{" "}
              <a href={`mailto:${BUSINESS.email}`} className="text-ink underline-offset-2 hover:underline">
                {BUSINESS.email}
              </a>
            </p>
          </div>
        </div>
        <ButtonLink
          href={buildGenericWhatsAppUrl("Hi! I have a question.")}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs uppercase tracking-[0.12em]"
        >
          Chat on WhatsApp <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
    </div>
  );
}
