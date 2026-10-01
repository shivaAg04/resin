import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { CopyableId } from "@/components/admin/CopyableId";
import { OrderFilters } from "@/components/admin/OrderFilters";
import { PaymentBadge, getPaymentState } from "@/components/admin/PaymentBadge";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { buildOrderQuery, parseOrderFilters, toAdminOrderFilters } from "@/lib/admin/order-filters";
import { getOrdersAdmin } from "@/lib/data/orders";
import { formatDate, formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Orders" };

export default async function AdminOrdersPage(props: PageProps<"/admin/orders">) {
  const values = parseOrderFilters(await props.searchParams);
  const orders = await getOrdersAdmin(toAdminOrderFilters(values));

  // Money that's actually yours: paid online, or COD that isn't cancelled.
  let collected = 0;
  let codDue = 0;
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    const state = getPaymentState(order);
    if (state === "paid") collected += Number(order.total_amount);
    if (state === "cod") codDue += Number(order.total_amount);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ink">Orders</h1>
        <a
          href={`/admin/orders/export${buildOrderQuery(values)}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-white px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:border-ink/30"
        >
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </div>

      <div className="mt-4">
        <OrderFilters key={buildOrderQuery(values)} values={values} />
      </div>

      <p className="mt-4 text-sm text-ink-soft">
        <span className="font-medium text-ink">{orders.length}</span> {orders.length === 1 ? "order" : "orders"}
        {" · "}Paid online <span className="font-medium text-green-700">{formatPrice(collected)}</span>
        {" · "}COD to collect <span className="font-medium text-amber-800">{formatPrice(codDue)}</span>
      </p>

      <div className="mt-3 overflow-hidden rounded-2xl border border-border-soft/70 bg-white">
        {orders.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-soft">No orders match these filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-soft/70 text-xs uppercase tracking-wide text-ink-soft">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Items</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Razorpay IDs</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const [firstItem, ...otherItems] = order.order_items;
                  return (
                    <tr key={order.id} className="border-b border-border-soft/40 last:border-0 hover:bg-ink/[0.02]">
                      <td className="px-5 py-3 whitespace-nowrap">
                        <Link href={`/admin/orders/${order.id}`} className="font-medium text-amber-dark hover:underline">
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <div className="text-ink">{order.customer_name}</div>
                        <div className="text-xs text-ink-soft">{order.whatsapp_number}</div>
                      </td>
                      <td className="px-5 py-3 text-ink-soft">
                        {firstItem ? (
                          <>
                            {firstItem.product_name}
                            {firstItem.quantity > 1 && ` ×${firstItem.quantity}`}
                            {otherItems.length > 0 && (
                              <span className="text-xs text-ink-soft/80"> +{otherItems.length} more</span>
                            )}
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-5 py-3 tabular-nums text-ink">{formatPrice(Number(order.total_amount))}</td>
                      <td className="px-5 py-3">
                        <PaymentBadge order={order} />
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-3">
                        {order.razorpay_order_id || order.razorpay_payment_id ? (
                          <div className="flex flex-col gap-1">
                            {order.razorpay_order_id && <CopyableId value={order.razorpay_order_id} />}
                            {order.razorpay_payment_id && <CopyableId value={order.razorpay_payment_id} />}
                          </div>
                        ) : (
                          <span className="text-ink-soft/60">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-ink-soft">{formatDate(order.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
