import { ButtonLink } from "@/components/ui/ButtonLink";

/** Closing "Ready to make something yours?" block used at the end of content pages. */
export function ReadyCta() {
  return (
    <section className="bg-gradient-to-b from-cream to-lilac">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-16 text-center sm:px-6">
        <h2 className="font-display text-3xl font-medium uppercase leading-tight text-ink sm:text-4xl">
          Ready to make something yours?
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
          Whether you&apos;ve found a piece you love or have an idea that doesn&apos;t exist yet, we&apos;d love to
          create it with you.
        </p>
        <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href="/products" size="lg" className="text-xs uppercase tracking-[0.12em]">
            Shop the collection
          </ButtonLink>
          <ButtonLink href="/custom-orders" variant="outline" size="lg" className="text-xs uppercase tracking-[0.12em]">
            Create custom order
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
