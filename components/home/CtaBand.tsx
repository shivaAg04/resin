import { MessageCircle } from "lucide-react";
import { buildGenericWhatsAppUrl } from "@/lib/whatsapp";

export function CtaBand() {
  const whatsappUrl = buildGenericWhatsAppUrl("Hi! I have something in mind I'd like made.");

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-ink via-plum to-ink">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-10 text-center sm:px-6">
        <h2 className="font-display text-2xl font-medium uppercase tracking-wide text-cream sm:text-3xl">
          Have something in mind?
        </h2>
        <p className="mt-2 max-w-lg text-sm text-cream/75">
          A screenshot, a colour combination, a gifting idea or something completely new — send it our way.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-cream px-5 text-[11px] font-medium uppercase tracking-[0.12em] text-ink transition-colors hover:bg-white"
        >
          <MessageCircle className="h-4 w-4" /> Chat with us on WhatsApp
        </a>
        <p className="mt-6 rotate-[-4deg] font-script text-2xl text-cream/70 lg:absolute lg:bottom-6 lg:right-10 lg:mt-0">
          Let&apos;s create something beautiful
        </p>
      </div>
    </section>
  );
}
