import type { Metadata } from "next";
import { Eyebrow } from "@/components/home/Eyebrow";
import { HowItWorks } from "@/components/home/CustomOrderSection";
import { CustomOrderForm } from "@/components/custom/CustomOrderForm";

export const metadata: Metadata = {
  title: "Custom Orders",
  description:
    "Send us a reference, colours, occasion and budget — we'll make a resin piece around your idea.",
};

export default function CustomOrdersPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <Eyebrow>Custom orders</Eyebrow>
        <h1 className="mt-3 font-display text-4xl font-medium uppercase leading-none text-ink sm:text-5xl">
          Custom made,
          <br />
          just for you.
        </h1>
        <p className="mt-4 max-w-md text-[15px] font-medium text-ink">
          Can&apos;t find exactly what you&apos;re looking for? You don&apos;t have to.
        </p>
        <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-soft">
          Tell us your idea, colours, occasion, budget or even just a screenshot of something you love. We&apos;ll
          take it from there &mdash; curating the design, figuring out the details and creating something around
          your vision.
        </p>
        <p className="mt-4 rotate-[-3deg] font-script text-3xl text-amber-dark">Your idea. Our creativity.</p>

        <div className="mt-10 hidden rounded-lg border border-border-soft bg-white/70 p-6 lg:block">
          <h2 className="font-display text-lg font-medium uppercase tracking-wide text-ink">How it works</h2>
          <HowItWorks stacked className="mt-6" />
        </div>
      </div>

      <div className="rounded-lg border border-border-soft/70 bg-white p-5 sm:p-8">
        <CustomOrderForm />
      </div>
    </div>
  );
}
