import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProductForOrder } from "@/lib/data/products";
import type { CreateOrderInput } from "@/lib/utils/validation";
import type { Order, OrderStatus, OrderWithItems } from "@/types";

export interface CreateOrderResult {
  order?: Order;
  productName?: string;
  unitPrice?: number;
  subtotal?: number;
  error?: string;
}

/**
 * Creates an order on behalf of an anonymous customer. Runs entirely with
 * the service-role client (server-only) so it can write to `orders` /
 * `order_items`, which RLS otherwise locks down to admins. The price is
 * always read fresh from the database — the frontend's price is never
 * trusted.
 */
export async function createOrderFromCheckout(input: CreateOrderInput): Promise<CreateOrderResult> {
  const product = await getProductForOrder(input.productSlug);

  if (!product || !product.is_active) {
    return { error: "This product is no longer available." };
  }

  const unitPrice = Number(product.price);
  const subtotal = Math.round(unitPrice * input.quantity * 100) / 100;
  const totalAmount = subtotal;

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
    })
    .select("*")
    .single();

  if (orderError || !order) {
    console.error("createOrderFromCheckout order insert error", orderError);
    return { error: "We couldn't place your order. Please try again." };
  }

  const { error: itemError } = await supabase.from("order_items").insert({
    order_id: order.id,
    product_id: product.id,
    product_name: product.name,
    quantity: input.quantity,
    unit_price: unitPrice,
    subtotal,
  });

  if (itemError) {
    console.error("createOrderFromCheckout item insert error", itemError);
    // Roll back the order so we don't leave an item-less order behind.
    await supabase.from("orders").delete().eq("id", order.id);
    return { error: "We couldn't place your order. Please try again." };
  }

  return { order: order as Order, productName: product.name, unitPrice, subtotal };
}

// ------------------------------------------------------------
// Admin
// ------------------------------------------------------------

export async function getOrdersAdmin(status?: OrderStatus | "all"): Promise<Order[]> {
  const supabase = await createClient();
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (status && status !== "all") {
    query = query.eq("status", status);
  }
  const { data, error } = await query;
  if (error) {
    console.error("getOrdersAdmin error", error);
    return [];
  }
  return data as Order[];
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
  const { data, error } = await supabase.from("orders").select("status, total_amount, created_at");

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

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const pendingStatuses: OrderStatus[] = ["new", "confirmed", "processing", "shipped"];

  let ordersToday = 0;
  let ordersThisMonth = 0;
  let pendingOrders = 0;
  let deliveredOrders = 0;
  let totalRevenue = 0;

  for (const row of data) {
    const createdAt = new Date(row.created_at);
    if (createdAt >= startOfToday) ordersToday += 1;
    if (createdAt >= startOfMonth) ordersThisMonth += 1;
    if (pendingStatuses.includes(row.status as OrderStatus)) pendingOrders += 1;
    if (row.status === "delivered") deliveredOrders += 1;
    if (row.status !== "cancelled") totalRevenue += Number(row.total_amount);
  }

  return {
    totalOrders: data.length,
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
