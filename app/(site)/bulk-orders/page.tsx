import type { Metadata } from "next";
import { ArrowRight, Gift, Palette, PenTool, Tags, Truck, Type } from "lucide-react";
import { BulkOrderForm } from "@/components/bulk/BulkOrderForm";
import { Eyebrow } from "@/components/home/Eyebrow";
import { REFERENCE_WHATSAPP_MESSAGE } from "@/components/home/CustomOrderSection";
import { ProductImage } from "@/components/products/ProductImage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getBulkOrderPhotos, getNewArrivals } from "@/lib/data/products";
import { buildGenericWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Bulk & Corporate Gifting",
  description:
    "Customised resin pieces in quantity for weddings, festive gifting, events and corporate orders. Request a bulk quote.",
};

const SERVICES = [
  { icon: PenTool, label: "Custom designs" },
  { icon: Palette, label: "Colour / theme matching" },
  { icon: Type, label: "Personalisation — names, logos, dates" },
  { icon: Tags, label: "Bulk pricing" },
  { icon: Gift, label: "Premium packaging options" },
  { icon: Truck, label: "Delivery planning" },
];

const buttonCaps = "text-xs uppercase tracking-[0.12em]";

export default async function BulkOrdersPage() {
  const [bulkPhotos, recent] = await Promise.all([getBulkOrderPhotos(), getNewArrivals(6)]);
  // Hero collage prefers real bulk-order photos, then recent product photos.
  const heroPhotos = [...bulkPhotos, ...recent.map((p) => p.images?.[0]).filter((s): s is string => Boolean(s))];
  const referenceUrl = buildGenericWhatsAppUrl(`${REFERENCE_WHATSAPP_MESSAGE} (bulk order)`);

  return (
    <div>
      <section className="bg-gradient-to-br from-lilac via-cream to-amber-light/40">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>Bulk &amp; Corporate Gifting</Eyebrow>
            <h1 className="mt-3 font-display text-4xl font-medium uppercase leading-none text-ink sm:text-5xl">
              Made for more than one.
              <br />
              Designed to feel like yours.
            </h1>
            <p className="mt-5 max-w-lg text-[15px] font-medium text-ink">
              Planning gifting for a wedding, event, festive occasion, corporate celebration, team or clients?
            </p>
            <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-ink-soft">
              At Spilled Colours, we create customised resin products in quantities &mdash; from thoughtful wedding favours
              and festive hampers to personalised corporate gifting.
            </p>
            <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-ink-soft">
              Whether you have a complete concept or just a starting idea, we&apos;ll work with you to bring it together.
            </p>
            <ButtonLink href="#quote" size="lg" className={`mt-7 ${buttonCaps}`}>
              Request a bulk quote <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {heroPhotos.slice(0, 3).map((src, i) => (
              <ProductImage
                key={src + i}
                src={src}
                alt=""
                preload={i === 0}
                sizes="(min-width: 1024px) 180px, 33vw"
                className={`w-full rounded-lg border-4 border-white shadow-lg shadow-ink/10 ${i === 1 ? "aspect-[3/4] -translate-y-4" : "aspect-[3/4] translate-y-2"}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-border-soft bg-white/70 p-6 sm:p-8">
          <h2 className="font-display text-xl font-medium uppercase tracking-wide text-ink">What we offer</h2>
          <ul className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {SERVICES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-sm text-ink">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lilac text-amber-dark">
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-center rounded-lg bg-lilac p-6 sm:p-8">
          <p className="font-script text-3xl leading-none text-amber-dark">Already have a reference?</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Share it with us in the form below and we&apos;ll suggest the best options for your event &mdash; designs, colours, packaging and
            pricing for your quantity.
          </p>
          <ButtonLink
            href="#quote"
            className={`mt-5 self-start ${buttonCaps}`}
          >
            Request a bulk quote <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </section>

      {bulkPhotos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
          <Eyebrow>Made in quantity</Eyebrow>
          <h2 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">Past Bulk Orders</h2>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {bulkPhotos.map((src) => (
              <ProductImage
                key={src}
                src={src}
                alt="Past bulk order"
                sizes="(min-width: 640px) 25vw, 50vw"
                className="aspect-square w-full rounded-lg"
              />
            ))}
          </div>
        </section>
      )}

      <section id="quote" className="scroll-mt-24 border-t border-border-soft bg-white/60">
        <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-16">
          <h2 className="font-display text-3xl font-medium uppercase text-ink">Request a bulk quote</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Tell us what you need and our team will review the details and reach out with custom options and pricing.
          </p>
          <div className="mt-8 rounded-lg border border-border-soft/70 bg-white p-5 sm:p-6">
            <BulkOrderForm />
          </div>
        </div>
      </section>
    </div>
  );
}
