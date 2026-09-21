import Link from "next/link";
import type { Metadata } from "next";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getDashboardStats, getRecentOrdersAdmin } from "@/lib/data/orders";
import { formatDate, formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const [stats, recentOrders] = await Promise.all([getDashboardStats(), getRecentOrdersAdmin(8)]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Total Orders" value={String(stats.totalOrders)} />
        <StatCard label="Today's Orders" value={String(stats.ordersToday)} />
        <StatCard label="Pending Orders" value={String(stats.pendingOrders)} />
        <StatCard label="Delivered Orders" value={String(stats.deliveredOrders)} />
        <StatCard label="Total Revenue" value={formatPrice(stats.totalRevenue)} className="col-span-2 lg:col-span-1" />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border-soft/70 bg-white">
        <div className="border-b border-border-soft/70 px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-ink">Recent Orders</h2>
        </div>

        {recentOrders.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-soft">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-soft/70 text-xs uppercase tracking-wide text-ink-soft">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border-soft/40 last:border-0">
                    <td className="px-5 py-3 font-medium text-ink">{order.order_number}</td>
                    <td className="px-5 py-3 text-ink-soft">{order.customer_name}</td>
                    <td className="px-5 py-3 text-ink-soft">{order.product_name ?? "—"}</td>
                    <td className="px-5 py-3 tabular-nums text-ink">{formatPrice(Number(order.total_amount))}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-ink-soft">{formatDate(order.created_at)}</td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium text-amber-dark hover:underline">
                        View
                      </Link>
                    </td>
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
