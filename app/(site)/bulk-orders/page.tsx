import type { Metadata } from "next";
import { BulkOrderForm } from "@/components/bulk/BulkOrderForm";

export const metadata: Metadata = {
  title: "Bulk Orders",
  description: "Handmade resin pieces in bulk for weddings, festivals and corporate gifting. Send us your requirements.",
};

export default function BulkOrdersPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Bulk Orders</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
        Planning wedding favours, festive hampers or corporate gifts? Tell us what you need and we&apos;ll get back
        to you on WhatsApp with options and pricing.
      </p>
      <div className="mt-8 rounded-2xl border border-border-soft/70 bg-white p-5 sm:p-6">
        <BulkOrderForm />
      </div>
    </div>
  );
}
