import type { Metadata } from "next";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { decodeOrderConfirmation } from "@/lib/utils/order-confirmation";
import { buildOrderWhatsAppUrl } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Order Placed",
  robots: { index: false },
};

export default async function OrderSuccessPage(props: PageProps<"/order-success/[orderNumber]">) {
  const { orderNumber } = await props.params;
  const searchParams = await props.searchParams;
  const encoded = typeof searchParams.d === "string" ? searchParams.d : undefined;
  const confirmation = encoded ? decodeOrderConfirmation(encoded) : null;

  const whatsappUrl = confirmation
    ? buildOrderWhatsAppUrl(confirmation)
    : buildOrderWhatsAppUrl({
        orderNumber,
        productName: "your order",
        quantity: 1,
        totalAmount: 0,
        customerName: "there",
        whatsappNumber: "",
        address: "",
        city: "",
        pincode: "",
      });

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center sm:py-24">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-700">
        <CheckCircle2 className="h-9 w-9" strokeWidth={1.5} />
      </div>

      <h1 className="mt-6 font-display text-3xl font-semibold text-ink">Order Placed Successfully</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Order Number: <span className="font-semibold text-ink">{orderNumber}</span>
      </p>

      {confirmation && (
        <div className="mt-8 w-full rounded-2xl border border-border-soft/70 bg-white p-5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-soft">Product</span>
            <span className="text-sm font-medium text-ink">{confirmation.productName}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-ink-soft">Quantity</span>
            <span className="text-sm font-medium text-ink">{confirmation.quantity}</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border-soft/70 pt-4">
            <span className="font-display font-semibold text-ink">Total Amount</span>
            <span className="font-display text-lg font-semibold text-amber-dark">
              {formatPrice(confirmation.totalAmount)}
            </span>
          </div>
        </div>
      )}

      <p className="mt-6 text-sm text-ink-soft">
        We&apos;ll reach out on WhatsApp to confirm your order and delivery details.
      </p>

      <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg">
          <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
        </ButtonLink>
        <ButtonLink href="/products" variant="outline" size="lg">
          Continue Shopping
        </ButtonLink>
      </div>
    </div>
  );
}
