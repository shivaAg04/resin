import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProductForOrder } from "@/lib/data/products";
import type { CreateOrderInput } from "@/lib/utils/validation";
import type { OrderConfirmationItem } from "@/lib/utils/order-confirmation";
import type { OrderSort, PaymentFilter } from "@/lib/admin/order-filters";
import type { Order, OrderStatus, OrderWithItems, PaymentMethod } from "@/types";

export interface CreateOrderResult {
  order?: Order;
  items?: OrderConfirmationItem[];
  error?: string;
}

/**
 * Creates an order (one or more line items — a cart, or a single "Buy Now")
 * on behalf of an anonymous customer. Runs entirely with the service-role
 * client (server-only) so it can write to `orders` / `order_items`, which
 * RLS otherwise locks down to admins. Every price is read fresh from the
 * database — the frontend's price is never trusted.
 */
export async function createOrderFromCheckout(
  input: CreateOrderInput,
  paymentMethod: PaymentMethod = "cod",
): Promise<CreateOrderResult> {
  const resolvedItems: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[] = [];

  for (const line of input.items) {
    const product = await getProductForOrder(line.productSlug);
    if (!product || !product.is_active) {
      return { error: "One of the items in your cart is no longer available. Please review your cart and try again." };
    }
    const unitPrice = Number(product.price);
    const subtotal = Math.round(unitPrice * line.quantity * 100) / 100;
    resolvedItems.push({ productId: product.id, productName: product.name, quantity: line.quantity, unitPrice, subtotal });
  }

  const totalAmount = Math.round(resolvedItems.reduce((sum, item) => sum + item.subtotal, 0) * 100) / 100;

  const supabase = createAdminClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customerName,
      whatsapp_number: input.whatsappNumber,
      address: input.address,
      city: input.city,
      state: input.state,
      pincode: input.pincode,
      instagram_username: input.instagramUsername || null,
      special_instructions: input.specialInstructions || null,
      total_amount: totalAmount,
      status: "new",
      payment_method: paymentMethod,
      payment_status: "pending",
    })
    .select("*")
    .single();

  if (orderError || !order) {
    console.error("createOrderFromCheckout order insert error", orderError);
    return { error: "We couldn't place your order. Please try again." };
  }

  const { error: itemError } = await supabase.from("order_items").insert(
    resolvedItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      subtotal: item.subtotal,
    })),
  );

  if (itemError) {
    console.error("createOrderFromCheckout item insert error", itemError);
    // Roll back the order so we don't leave an item-less order behind.
    await supabase.from("orders").delete().eq("id", order.id);
    return { error: "We couldn't place your order. Please try again." };
  }

  return {
    order: order as Order,
    items: resolvedItems.map(({ productName, quantity, unitPrice, subtotal }) => ({
      productName,
      quantity,
      unitPrice,
      subtotal,
    })),
  };
}

// ------------------------------------------------------------
// Online payments (Razorpay)
// ------------------------------------------------------------

/** Used to roll back an order started for online payment if the Razorpay order creation call itself fails. */
export async function deleteOrder(orderId: string): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from("orders").delete().eq("id", orderId);
}

export async function attachRazorpayOrderId(orderId: string, razorpayOrderId: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("orders").update({ razorpay_order_id: razorpayOrderId }).eq("id", orderId);
  if (error) {
    console.error("attachRazorpayOrderId error", error);
    return { error: "Could not start payment. Please try again." };
  }
  return {};
}

/**
 * Uses the service-role client (not the cookie-bound one) since this is
 * looked up on behalf of an anonymous customer right after payment, before
 * any admin session exists — same reasoning as getProductForOrder.
 */
export async function getOrderWithItemsByRazorpayOrderId(razorpayOrderId: string): Promise<OrderWithItems | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("razorpay_order_id", razorpayOrderId)
    .maybeSingle();

  if (error) {
    console.error("getOrderWithItemsByRazorpayOrderId error", error);
    return null;
  }
  return data as OrderWithItems | null;
}

/**
 * Marks an order paid once its Razorpay signature has been verified. Scoped
 * to `payment_status = 'pending'` so this is safe to call twice (once from
 * the checkout page's own verify call, once from the webhook safety net)
 * without double-processing.
 */
export async function markOrderPaid(razorpayOrderId: string, razorpayPaymentId: string): Promise<{ error?: string }> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: "paid", status: "confirmed", razorpay_payment_id: razorpayPaymentId })
    .eq("razorpay_order_id", razorpayOrderId)
    .eq("payment_status", "pending");

  if (error) {
    console.error("markOrderPaid error", error);
    return { error: "Could not confirm payment." };
  }
  return {};
}

// ------------------------------------------------------------
// Admin
// ------------------------------------------------------------

export interface AdminOrderFilters {
  status?: OrderStatus | "all";
  payment?: PaymentFilter | "all";
  /** Matches order number, customer name, WhatsApp number or either Razorpay ID. */
  search?: string;
  /** Inclusive IST calendar dates, YYYY-MM-DD. */
  from?: string;
  to?: string;
  sort?: OrderSort;
}

export type AdminOrderRow = Order & { order_items: { product_name: string; quantity: number }[] };

export async function getOrdersAdmin(filters: AdminOrderFilters = {}): Promise<AdminOrderRow[]> {
  const supabase = await createClient();
  let query = supabase.from("orders").select("*, order_items(product_name, quantity)");

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  switch (filters.payment) {
    case "cod":
      query = query.eq("payment_method", "cod");
      break;
    case "paid":
      query = query.eq("payment_method", "online").eq("payment_status", "paid");
      break;
    case "unpaid":
      query = query.eq("payment_method", "online").eq("payment_status", "pending");
      break;
    case "failed":
      query = query.eq("payment_method", "online").eq("payment_status", "failed");
      break;
  }

  // The value is double-quoted inside or() so dots and spaces (e.g. "S. Kumar")
  // are safe; strip the few characters that could still break out of it.
  const search = filters.search?.replace(/["\\,()*%]/g, " ").trim();
  if (search) {
    const pattern = `"%${search}%"`;
    query = query.or(
      [
        `order_number.ilike.${pattern}`,
        `customer_name.ilike.${pattern}`,
        `whatsapp_number.ilike.${pattern}`,
        `razorpay_order_id.ilike.${pattern}`,
        `razorpay_payment_id.ilike.${pattern}`,
      ].join(","),
    );
  }

  // The shop runs on IST, so date filters mean IST calendar days.
  if (filters.from) query = query.gte("created_at", `${filters.from}T00:00:00+05:30`);
  if (filters.to) query = query.lte("created_at", `${filters.to}T23:59:59.999+05:30`);

  const sort = filters.sort ?? "newest";
  query =
    sort === "oldest"
      ? query.order("created_at", { ascending: true })
      : sort === "amount_desc"
        ? query.order("total_amount", { ascending: false }).order("created_at", { ascending: false })
        : sort === "amount_asc"
          ? query.order("total_amount", { ascending: true }).order("created_at", { ascending: false })
          : query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) {
    console.error("getOrdersAdmin error", error);
    return [];
  }
  return data as AdminOrderRow[];
}

export async function getOrderWithItemsAdmin(id: string): Promise<OrderWithItems | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getOrderWithItemsAdmin error", error);
    return null;
  }
  return data as OrderWithItems | null;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) {
    console.error("updateOrderStatus error", error);
    return { error: "Could not update order status." };
  }
  return {};
}

export interface DashboardStats {
  totalOrders: number;
  ordersToday: number;
  ordersThisMonth: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("status, total_amount, created_at, payment_method, payment_status");

  if (error || !data) {
    console.error("getDashboardStats error", error);
    return {
      totalOrders: 0,
      ordersToday: 0,
      ordersThisMonth: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
      totalRevenue: 0,
    };
  }

  // "Today" means today in India, not in the server's timezone (UTC on Vercel).
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  const nowIst = new Date(Date.now() + IST_OFFSET_MS);
  const startOfToday = new Date(
    Date.UTC(nowIst.getUTCFullYear(), nowIst.getUTCMonth(), nowIst.getUTCDate()) - IST_OFFSET_MS,
  );
  const startOfMonth = new Date(Date.UTC(nowIst.getUTCFullYear(), nowIst.getUTCMonth(), 1) - IST_OFFSET_MS);

  const pendingStatuses: OrderStatus[] = ["new", "confirmed", "processing", "shipped"];

  let totalOrders = 0;
  let ordersToday = 0;
  let ordersThisMonth = 0;
  let pendingOrders = 0;
  let deliveredOrders = 0;
  let totalRevenue = 0;

  for (const row of data) {
    // An online order nobody finished paying for is an abandoned checkout, not an order.
    if (row.payment_method === "online" && row.payment_status !== "paid") continue;
    totalOrders += 1;
    const createdAt = new Date(row.created_at);
    if (createdAt >= startOfToday) ordersToday += 1;
    if (createdAt >= startOfMonth) ordersThisMonth += 1;
    if (pendingStatuses.includes(row.status as OrderStatus)) pendingOrders += 1;
    if (row.status === "delivered") deliveredOrders += 1;
    if (row.status !== "cancelled") totalRevenue += Number(row.total_amount);
  }

  return {
    totalOrders,
    ordersToday,
    ordersThisMonth,
    pendingOrders,
    deliveredOrders,
    totalRevenue,
  };
}

export async function getRecentOrdersAdmin(limit = 8): Promise<(Order & { product_name: string | null })[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(product_name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("getRecentOrdersAdmin error", error);
    return [];
  }

  return data.map((row) => ({
    ...row,
    product_name: row.order_items?.[0]?.product_name ?? null,
  })) as (Order & { product_name: string | null })[];
}
