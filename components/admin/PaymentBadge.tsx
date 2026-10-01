import { cn } from "@/lib/utils/format";
import type { Order } from "@/types";

type PaymentState = "cod" | "paid" | "pending" | "failed";

const styles: Record<PaymentState, string> = {
  cod: "bg-amber-50 text-amber-800 border-amber-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-gray-50 text-gray-600 border-gray-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

const labels: Record<PaymentState, string> = {
  cod: "COD",
  paid: "Paid online",
  pending: "Online · unpaid",
  failed: "Payment failed",
};

/**
 * COD vs paid at a glance. An online order still "pending" means the
 * customer opened Razorpay but never finished paying — don't ship it.
 */
export function getPaymentState(order: Pick<Order, "payment_method" | "payment_status">): PaymentState {
  if (order.payment_method === "cod") return "cod";
  return order.payment_status;
}

export function getPaymentLabel(order: Pick<Order, "payment_method" | "payment_status">): string {
  return labels[getPaymentState(order)];
}

export function PaymentBadge({ order }: { order: Pick<Order, "payment_method" | "payment_status"> }) {
  const state = getPaymentState(order);
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium",
        styles[state],
      )}
    >
      {labels[state]}
    </span>
  );
}
