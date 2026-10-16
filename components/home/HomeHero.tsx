import { ArrowRight, Boxes, Globe, HandHeart, Palette, Truck } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProductImage } from "@/components/products/ProductImage";

const TRUST_POINTS = [
  { icon: HandHeart, label: "Handcrafted" },
  { icon: Palette, label: "Custom Designs" },
  { icon: Boxes, label: "Bulk Orders" },
  { icon: Truck, label: "India-wide Shipping" },
  { icon: Globe, label: "International Shipping" },
];

const frameClasses = "absolute border-[6px] border-white bg-white shadow-xl shadow-ink/15 sm:border-8";

/** Hero with a framed collage of the newest product photos on the right. */
export function HomeHero({ images }: { images: string[] }) {
  const [main, second, third] = images;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-lilac via-cream to-amber-light/40">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:pb-14 lg:pt-16">
        <div>
          <p className="animate-fade-in-up text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
            Handcrafted resin <span aria-hidden="true">·</span> Custom &amp; made to order
          </p>
          <h1
            className="animate-fade-in-up mt-4 font-display text-[2.6rem] font-medium uppercase leading-[0.95] text-ink sm:text-[3.4rem]"
            style={{ animationDelay: "80ms" }}
          >
            Your idea.
            <br />
            Our creativity.
            <br />
            Something uniquely yours.
          </h1>
          <p
            className="animate-fade-in-up mt-5 max-w-lg text-[15px] leading-relaxed text-ink-soft"
            style={{ animationDelay: "160ms" }}
          >
            From personalised gifts and keepsakes to home d&eacute;cor, festive pieces, bulk gifting and
            completely custom creations &mdash; we turn your ideas into handcrafted pieces designed around
            your colours, occasion, and vision.
          </p>
          <div
            className="animate-fade-in-up mt-7 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "240ms" }}
          >
            <ButtonLink href="/products" size="lg" className="text-xs uppercase tracking-[0.12em]">
              Explore Collection <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/custom-orders" variant="outline" size="lg" className="text-xs uppercase tracking-[0.12em]">
              Create Something Custom
            </ButtonLink>
          </div>
        </div>

        <div className="relative mx-auto hidden aspect-[5/4] w-full max-w-xl lg:block">
          <p className="absolute -top-2 right-0 z-10 hidden rotate-[-6deg] text-right font-script text-3xl leading-none text-ink-soft lg:block">
            Real ideas.
            <br />
            Custom creations ♡
          </p>
          <div className={`${frameClasses} right-[4%] top-[12%] z-[2] aspect-[4/5] w-[56%] rotate-2`}>
            <ProductImage
              src={main}
              alt="Handmade resin piece"
              preload
              sizes="(min-width: 1024px) 340px, 60vw"
              className="h-full w-full"
            />
          </div>
          <div className={`${frameClasses} left-[2%] top-[4%] z-[1] aspect-square w-[42%] -rotate-3`}>
            <ProductImage
              src={second}
              alt=""
              sizes="(min-width: 1024px) 240px, 40vw"
              className="h-full w-full"
            />
          </div>
          <div className={`${frameClasses} bottom-[2%] left-[14%] z-[3] aspect-[4/3] w-[40%] rotate-[4deg]`}>
            <ProductImage
              src={third}
              alt=""
              sizes="(min-width: 1024px) 230px, 40vw"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      <ul className="mx-auto grid max-w-6xl grid-cols-5 gap-2 px-4 pb-8 sm:px-6 lg:flex lg:gap-8 lg:pb-12">
        {TRUST_POINTS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex flex-col items-center gap-1.5 text-center lg:flex-row lg:gap-2 lg:text-left">
            <Icon className="h-5 w-5 shrink-0 text-ink" strokeWidth={1.4} />
            <span className="text-[10px] leading-tight text-ink-soft sm:text-xs">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
