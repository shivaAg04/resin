import type { Metadata } from "next";
import { OrderTrackerClient } from "@/components/orders/OrderTrackerClient";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track your Spilled Colours handmade resin orders, view production status, and monitor delivery updates.",
};

export default async function TrackOrderPage(props: {
  searchParams: Promise<{ order?: string }>;
}) {
  const searchParams = await props.searchParams;
  const initialOrderNumber = typeof searchParams.order === "string" ? searchParams.order : "";

  return (
    <div className="min-h-[70vh] bg-cream/40">
      <OrderTrackerClient initialOrderNumber={initialOrderNumber} />
    </div>
  );
}
