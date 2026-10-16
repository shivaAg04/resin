import {
  ArrowRight,
  Gift,
  Hammer,
  ImageIcon,
  Layers,
  Palette,
  PartyPopper,
  PenLine,
  ReceiptText,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ProductImage } from "@/components/products/ProductImage";

const REFERENCE_KINDS = [
  { icon: ImageIcon, label: "Screenshot" },
  { icon: Palette, label: "Colour palette" },
  { icon: PartyPopper, label: "Occasion" },
  { icon: Wallet, label: "Budget" },
  { icon: Layers, label: "Quantity" },
];

export const CUSTOM_ORDER_STEPS = [
  { icon: PenLine, title: "Share your idea", desc: "Send a reference, sketch or simply tell us what you have in mind." },
  { icon: SlidersHorizontal, title: "Tell us your preferences", desc: "Colours, size, occasion, quantity, budget." },
  { icon: ReceiptText, title: "Get your quotation", desc: "We'll suggest the best option based on your needs." },
  { icon: Hammer, title: "We create", desc: "Once confirmed, your piece is handcrafted especially for you." },
  { icon: Gift, title: "You receive", desc: "Carefully packed and shipped to your doorstep." },
];

export const REFERENCE_WHATSAPP_MESSAGE =
  "Hi! I'd like something custom made. Here's my reference / idea:";

const buttonCaps = "text-xs uppercase tracking-[0.12em]";

/** The 5 custom-order steps: a row of columns, or `stacked` as a narrow vertical list. */
export function HowItWorks({ className, stacked = false }: { className?: string; stacked?: boolean }) {
  if (stacked) {
    return (
      <ol className={`flex flex-col gap-5 ${className ?? ""}`}>
        {CUSTOM_ORDER_STEPS.map(({ icon: Icon, title, desc }, i) => (
          <li key={title} className="flex gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lilac text-amber-dark">
              <Icon className="h-4 w-4" strokeWidth={1.4} />
            </span>
            <div>
              <h3 className="text-sm font-medium text-ink">
                <span className="mr-2 font-display font-semibold">{String(i + 1).padStart(2, "0")}</span>
                {title}
              </h3>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{desc}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className={`grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-5 sm:gap-0 ${className ?? ""}`}>
      {CUSTOM_ORDER_STEPS.map(({ icon: Icon, title, desc }, i) => (
        <li key={title} className="sm:border-l sm:border-border-soft sm:px-3 sm:first:border-l-0 sm:first:pl-0">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lilac text-amber-dark">
            <Icon className="h-5 w-5" strokeWidth={1.4} />
          </span>
          <p className="mt-4 font-display text-sm font-semibold text-ink">{String(i + 1).padStart(2, "0")}</p>
          <h3 className="mt-1 text-sm font-medium text-ink">{title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">{desc}</p>
        </li>
      ))}
    </ol>
  );
}

/** "Can't find exactly what you're looking for?" + the 5-step custom order flow. */
export function CustomOrderSection({ images }: { images: string[] }) {
  return (
    <section className="mx-auto grid max-w-6xl gap-4 px-4 sm:px-6 lg:grid-cols-2">
      <div className="grid items-center gap-8 rounded-lg bg-lilac p-6 sm:grid-cols-[0.7fr_1.3fr] sm:p-8">
        <div className="relative mx-auto aspect-square w-full max-w-[220px]">
          <p className="absolute -top-3 right-0 z-10 rotate-[-8deg] font-script text-2xl leading-none text-ink-soft">
            Your idea.
            <br />
            Our creativity.
          </p>
          {images.slice(0, 3).map((src, i) => (
            <div
              key={src + i}
              className={[
                "absolute border-4 border-white bg-white shadow-lg shadow-ink/10",
                i === 0 && "left-0 top-[8%] w-[62%] -rotate-6",
                i === 1 && "bottom-[4%] right-[4%] w-[52%] rotate-3",
                i === 2 && "bottom-0 left-[4%] w-[38%] rotate-[-10deg]",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <ProductImage src={src} alt="" sizes="140px" className="aspect-square w-full" />
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-display text-2xl font-medium uppercase leading-tight text-ink sm:text-3xl">
            Can&apos;t find exactly what you&apos;re looking for?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            You don&apos;t have to. Tell us your idea, colours, occasion, budget or even just a screenshot of something you love &mdash;
            we&apos;ll take it from there, curating the design and creating something around your vision.
          </p>
          <ButtonLink href="/custom-orders" className={`mt-5 ${buttonCaps}`}>
            Create something custom <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-3">
            {REFERENCE_KINDS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex flex-col items-center gap-1 text-[10px] text-ink-soft">
                <Icon className="h-5 w-5 text-ink" strokeWidth={1.3} />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col rounded-lg border border-border-soft bg-white/70 p-6 sm:p-8">
        <h2 className="font-display text-xl font-medium uppercase tracking-wide text-ink">How custom orders work</h2>
        <HowItWorks className="mt-7 flex-1" />
        <ButtonLink href="/custom-orders" variant="outline" className={`mt-8 self-center ${buttonCaps}`}>
          Start a custom order <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </div>
    </section>
  );
}
