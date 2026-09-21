import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getOrderWithItemsAdmin } from "@/lib/data/orders";
import { formatDate, formatPrice } from "@/lib/utils/format";
import { buildAdminContactWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Order Details" };

export default async function AdminOrderDetailPage(props: PageProps<"/admin/orders/[id]">) {
  const { id } = await props.params;
  const order = await getOrderWithItemsAdmin(id);

  if (!order) notFound();

  const whatsappUrl = buildAdminContactWhatsAppUrl(order);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{order.order_number}</h1>
          <p className="mt-1 text-sm text-ink-soft">Placed {formatDate(order.created_at)}</p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border-soft/70 bg-white p-5">
          <h2 className="font-display text-base font-semibold text-ink">Customer</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">Name</dt>
              <dd className="text-right text-ink">{order.customer_name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">WhatsApp</dt>
              <dd className="text-right text-ink">{order.whatsapp_number}</dd>
            </div>
            {order.instagram_username && (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">Instagram</dt>
                <dd className="text-right text-ink">@{order.instagram_username}</dd>
              </div>
            )}
          </dl>

          <ButtonLink
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="sm"
            className="mt-4 w-full"
          >
            <MessageCircle className="h-4 w-4" /> Contact on WhatsApp
          </ButtonLink>
        </div>

        <div className="rounded-2xl border border-border-soft/70 bg-white p-5">
          <h2 className="font-display text-base font-semibold text-ink">Shipping Address</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {order.address}
            <br />
            {order.city}
            {order.state ? `, ${order.state}` : ""}
            <br />
            {order.pincode}
          </p>

          {order.special_instructions && (
            <>
              <h3 className="mt-4 text-sm font-medium text-ink">Special Instructions</h3>
              <p className="mt-1 text-sm text-ink-soft">{order.special_instructions}</p>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border-soft/70 bg-white">
        <div className="border-b border-border-soft/70 px-5 py-4">
          <h2 className="font-display text-base font-semibold text-ink">Items</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-soft/70 text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Quantity</th>
              <th className="px-5 py-3 font-medium">Unit Price</th>
              <th className="px-5 py-3 font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map((item) => (
              <tr key={item.id} className="border-b border-border-soft/40 last:border-0">
                <td className="px-5 py-3 text-ink">{item.product_name}</td>
                <td className="px-5 py-3 text-ink-soft">{item.quantity}</td>
                <td className="px-5 py-3 tabular-nums text-ink-soft">{formatPrice(Number(item.unit_price))}</td>
                <td className="px-5 py-3 tabular-nums text-ink">{formatPrice(Number(item.subtotal))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end border-t border-border-soft/70 px-5 py-4">
          <div className="flex items-center gap-4">
            <span className="font-display font-semibold text-ink">Total</span>
            <span className="font-display text-lg font-semibold text-amber-dark">
              {formatPrice(Number(order.total_amount))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
