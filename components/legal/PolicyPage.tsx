import type { ReactNode } from "react";
import { BUSINESS } from "@/lib/legal";

/** Shared shell for the policy pages: title, last-updated line and readable prose spacing. */
export function PolicyPage({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{title}</h1>
      <p className="mt-2 text-xs text-ink-soft/80">Last updated: {BUSINESS.lastUpdated}</p>
      {intro && <p className="mt-6 text-sm leading-relaxed text-ink-soft sm:text-base">{intro}</p>}
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-ink-soft sm:text-base [&_a]:text-amber-dark [&_a]:underline [&_li]:mt-1.5 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </article>
  );
}

export function PolicySection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-lg font-semibold text-ink sm:text-xl">{heading}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}

/** "Spilled Colours (operated by <legal name>)" when a legal name is set. */
export function BusinessName() {
  return (
    <>
      {BUSINESS.brandName}
      {BUSINESS.legalName && ` (operated by ${BUSINESS.legalName})`}
    </>
  );
}
