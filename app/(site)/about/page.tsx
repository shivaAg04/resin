import type { Metadata } from "next";
import { Eyebrow } from "@/components/home/Eyebrow";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { HowItWorks } from "@/components/home/CustomOrderSection";
import { ReadyCta } from "@/components/home/ReadyCta";
import { ProductImage } from "@/components/products/ProductImage";
import { getNewArrivals } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Spilled Colours started with resin and a lot of experimenting — now we make pieces around your ideas, colours and occasions.",
};

export default async function AboutPage() {
  const products = await getNewArrivals(8);
  const photos = products.map((p) => p.images?.[0]).filter((src): src is string => Boolean(src));

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow>Our story</Eyebrow>
          <h1 className="mt-3 font-display text-4xl font-medium leading-[1.05] text-ink sm:text-5xl">
            More than resin.
            <br />
            It&apos;s the idea behind it.
          </h1>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft">
            <p>
              Spilled Colours started with resin and a lot of experimenting. What began as a small creative hobby
              slowly turned into a business built around one thing we love most — creating pieces that don&apos;t have
              to look like everything else.
            </p>
            <p>
              Sometimes customers come with a screenshot, a colour combination, a memory, an occasion or simply an
              idea they&apos;ve imagined. And sometimes, they don&apos;t know exactly what they want yet.
            </p>
            <p className="font-medium text-ink">That&apos;s where we come in.</p>
            <p>
              Every piece is mixed, poured, sanded and finished by hand — one at a time — and we share photos of it
              with you before it ever leaves our studio.
            </p>
          </div>
          <p className="mt-6 rotate-[-3deg] font-script text-3xl text-amber-dark">Let&apos;s create something beautiful</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {photos.slice(0, 3).map((src, i) => (
            <ProductImage
              key={src + i}
              src={src}
              alt=""
              sizes="(min-width: 1024px) 270px, 50vw"
              className={`w-full rounded-lg ${i === 0 ? "row-span-2 aspect-[3/4] h-full" : "aspect-square"}`}
            />
          ))}
        </div>
      </section>

      <WhyChooseUs />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <h2 className="font-display text-2xl font-medium uppercase tracking-wide text-ink">How we work with you</h2>
        <HowItWorks className="mt-8" />
      </section>

      <ReadyCta />
    </div>
  );
}
