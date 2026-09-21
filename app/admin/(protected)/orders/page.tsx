import type { Metadata } from "next";
import Link from "next/link";
import { OrderStatusFilter } from "@/components/admin/OrderStatusFilter";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getOrdersAdmin } from "@/lib/data/orders";
import { formatDate, formatPrice } from "@/lib/utils/format";
import type { OrderStatus } from "@/types";
import { ORDER_STATUSES } from "@/types";

export const metadata: Metadata = { title: "Orders" };

export default async function AdminOrdersPage(props: PageProps<"/admin/orders">) {
  const searchParams = await props.searchParams;
  const statusParam = typeof searchParams.status === "string" ? searchParams.status : "all";
  const status: OrderStatus | "all" = ORDER_STATUSES.includes(statusParam as OrderStatus)
    ? (statusParam as OrderStatus)
    : "all";

  const orders = await getOrdersAdmin(status);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Orders</h1>

      <div className="mt-4">
        <OrderStatusFilter active={status} />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border-soft/70 bg-white">
        {orders.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-soft">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-soft/70 text-xs uppercase tracking-wide text-ink-soft">
                  <th className="px-5 py-3 font-medium">Order Number</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">WhatsApp</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Created At</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border-soft/40 last:border-0 hover:bg-ink/[0.02]">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-amber-dark hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-ink">{order.customer_name}</td>
                    <td className="px-5 py-3 text-ink-soft">{order.whatsapp_number}</td>
                    <td className="px-5 py-3 tabular-nums text-ink">{formatPrice(Number(order.total_amount))}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-ink-soft">{formatDate(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
