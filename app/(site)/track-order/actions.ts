"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus, PaymentStatus } from "@/types";

export interface TrackedOrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  customization: string | null;
  imageUrl: string | null;
}

export interface TrackedOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  whatsappNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  createdAt: string;
  city: string;
  state: string | null;
  pincode: string;
  items: TrackedOrderItem[];
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

export async function trackOrderAction(
  orderNumberInput: string,
  phoneInput: string
): Promise<{ success: boolean; order?: TrackedOrder; error?: string }> {
  const trimmedOrderNumber = orderNumberInput.trim().toUpperCase();
  const trimmedPhone = phoneInput.trim();

  if (!trimmedOrderNumber) {
    return { success: false, error: "Please enter your order number." };
  }
  if (!trimmedPhone || normalizePhone(trimmedPhone).length < 7) {
    return { success: false, error: "Please enter a valid WhatsApp or phone number." };
  }

  const supabase = createAdminClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      customer_name,
      whatsapp_number,
      status,
      payment_status,
      total_amount,
      created_at,
      city,
      state,
      pincode,
      order_items (
        product_name,
        quantity,
        unit_price,
        subtotal,
        customer_customization,
        customer_image_url
      )
    `
    )
    .ilike("order_number", trimmedOrderNumber)
    .maybeSingle();

  if (error || !order) {
    return {
      success: false,
      error: "No order found with this order number. Please check the number and try again.",
    };
  }

  const orderPhoneNorm = normalizePhone(order.whatsapp_number);
  const inputPhoneNorm = normalizePhone(trimmedPhone);

  if (orderPhoneNorm !== inputPhoneNorm) {
    return {
      success: false,
      error: "The phone number does not match the contact details for this order.",
    };
  }

  const rawItems = (order.order_items as Array<{
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    customer_customization?: string | null;
    customer_image_url?: string | null;
  }>) || [];

  const items: TrackedOrderItem[] = rawItems.map((item) => ({
    productName: item.product_name,
    quantity: item.quantity,
    unitPrice: Number(item.unit_price),
    subtotal: Number(item.subtotal),
    customization: item.customer_customization || null,
    imageUrl: item.customer_image_url || null,
  }));

  return {
    success: true,
    order: {
      id: order.id,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      whatsappNumber: order.whatsapp_number,
      status: order.status as OrderStatus,
      paymentStatus: order.payment_status as PaymentStatus,
      totalAmount: Number(order.total_amount),
      createdAt: order.created_at,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
      items,
    },
  };
}

export async function trackMultipleOrdersAction(
  entries: Array<{ orderNumber: string; phone: string }>
): Promise<{ success: boolean; orders: TrackedOrder[] }> {
  if (!Array.isArray(entries) || entries.length === 0) {
    return { success: true, orders: [] };
  }

  const safeEntries = entries.slice(0, 15); // cap at 15
  const trackedOrders: TrackedOrder[] = [];

  for (const entry of safeEntries) {
    if (entry.orderNumber && entry.phone) {
      const res = await trackOrderAction(entry.orderNumber, entry.phone);
      if (res.success && res.order) {
        trackedOrders.push(res.order);
      }
    }
  }

  return { success: true, orders: trackedOrders };
}
