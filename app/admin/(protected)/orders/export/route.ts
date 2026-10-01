import type { NextRequest } from "next/server";
import { getOrdersAdmin } from "@/lib/data/orders";
import { parseOrderFilters, toAdminOrderFilters } from "@/lib/admin/order-filters";
import { getPaymentLabel } from "@/components/admin/PaymentBadge";
import { formatDate } from "@/lib/utils/format";

/**
 * Downloads the orders currently shown on /admin/orders (same filters) as
 * CSV. Protected twice: proxy.ts redirects anyone not logged in, and the
 * cookie-bound Supabase client means RLS only returns rows to an admin.
 */
export async function GET(request: NextRequest) {
  const values = parseOrderFilters(Object.fromEntries(request.nextUrl.searchParams));
  const orders = await getOrdersAdmin(toAdminOrderFilters(values));

  const header = [
    "Order Number",
    "Date",
    "Customer",
    "WhatsApp",
    "Instagram",
    "Address",
    "City",
    "State",
    "Pincode",
    "Items",
    "Total (INR)",
    "Payment",
    "Status",
    "Razorpay Order ID",
    "Razorpay Payment ID",
    "Special Instructions",
  ];

  const rows = orders.map((order) => [
    order.order_number,
    formatDate(order.created_at),
    order.customer_name,
    order.whatsapp_number,
    order.instagram_username ?? "",
    order.address,
    order.city,
    order.state ?? "",
    order.pincode,
    order.order_items.map((item) => `${item.product_name} x${item.quantity}`).join("; "),
    String(Number(order.total_amount)),
    getPaymentLabel(order),
    order.status,
    order.razorpay_order_id ?? "",
    order.razorpay_payment_id ?? "",
    order.special_instructions ?? "",
  ]);

  // Leading BOM so Excel opens ₹ and Hindi names correctly.
  const csv = "﻿" + [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  const date = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

function csvCell(value: string): string {
  // Stop spreadsheet apps from running customer-typed text as a formula.
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}
