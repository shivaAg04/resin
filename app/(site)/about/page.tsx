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
          <Eyebrow>About Us</Eyebrow>
          <h1 className="mt-3 font-display text-4xl font-medium leading-[1.05] text-ink sm:text-5xl">
            We don&apos;t just make products.
            <br />
            We create your ideas.
          </h1>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-soft">
            <p className="text-base font-medium text-ink">
              Spilled Colours is a premium resin customization brand where creativity has no fixed format.
            </p>
            <p>
              What started with resin evolved into a space where ideas, colours, occasions and imagination come together to create something completely personal.
            </p>
            <p>
              From everyday keepsakes to statement pieces, festive collections, personalised gifting and bulk orders — every creation is made with a purpose: to make something that feels like it was made for you, and only you.
            </p>
            <p>
              We love taking an idea that exists only in your mind, adding our creativity to it, and turning it into something tangible.
            </p>
            <p className="italic text-ink-soft/90">
              Because we don&apos;t believe in &ldquo;this is what we have.&rdquo;
            </p>
            <p className="font-medium text-ink">
              We believe in: &ldquo;Tell us what you have in mind.&rdquo;
            </p>
            <p className="font-display text-lg font-medium text-amber-dark">
              That&apos;s Spilled Colours. Bold. Personal. Unconventional.
            </p>
          </div>
          <p className="mt-6 rotate-[-3deg] font-script text-3xl text-amber-dark">Your idea. Our creativity. ♡</p>
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
