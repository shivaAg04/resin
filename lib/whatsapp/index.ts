import { formatPrice } from "@/lib/utils/format";
import type { OrderConfirmationPayload } from "@/lib/utils/order-confirmation";

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${digitsOnly(phone)}?${params.toString()}`;
}

/**
 * Business WhatsApp (and phone) number in international-digits form. Kept
 * in code rather than an env var: it's public anyway, and a stale env
 * value in Vercel once left every WhatsApp button pointing at a placeholder.
 */
export const BUSINESS_WHATSAPP_NUMBER = "917451011567";

export function getBusinessWhatsAppNumber(): string {
  return BUSINESS_WHATSAPP_NUMBER;
}

export function buildGenericWhatsAppUrl(message = "Hi! I'd like to know more about your resin products."): string {
  return buildWhatsAppUrl(getBusinessWhatsAppNumber(), message);
}

export type OrderConfirmationMessageInput = OrderConfirmationPayload;

export function buildOrderConfirmationMessage(order: OrderConfirmationMessageInput): string {
  const itemLines = order.items.map((item) => `${item.productName} × ${item.quantity} — ${formatPrice(item.subtotal)}`);

  return [
    "Hi, I want to confirm my order.",
    "",
    `Order ID: ${order.orderNumber}`,
    "",
    ...itemLines,
    `Total: ${formatPrice(order.totalAmount)}`,
    "",
    `Name: ${order.customerName}`,
    `WhatsApp: ${order.whatsappNumber}`,
    "",
    "Address:",
    `${order.address}, ${order.city}${order.state ? ", " + order.state : ""}`,
    order.pincode,
  ].join("\n");
}

export function buildOrderWhatsAppUrl(order: OrderConfirmationMessageInput): string {
  return buildWhatsAppUrl(getBusinessWhatsAppNumber(), buildOrderConfirmationMessage(order));
}

export function buildAdminContactMessage(order: { order_number: string; customer_name: string }): string {
  return `Hi ${order.customer_name}, this is regarding your order ${order.order_number} from our resin store.`;
}

/**
 * Indian customer numbers are stored as bare 10-digit mobiles (see
 * normalizeIndianMobile) — wa.me links require the country code, so it's
 * added back on here rather than at storage time (storage stays in the
 * plain local format shown in the admin panel and order messages).
 * International numbers are stored with their "+<code>" already.
 */
export function buildAdminContactWhatsAppUrl(order: {
  order_number: string;
  customer_name: string;
  whatsapp_number: string;
}): string {
  return buildCustomerWhatsAppUrl(order.whatsapp_number, buildAdminContactMessage(order));
}

/** wa.me link to a customer number as stored (bare Indian 10-digit, or "+<code>…" for other countries). */
export function buildCustomerWhatsAppUrl(storedNumber: string, message: string): string {
  const target = storedNumber.startsWith("+") ? digitsOnly(storedNumber) : `91${digitsOnly(storedNumber)}`;
  return buildWhatsAppUrl(target, message);
}
