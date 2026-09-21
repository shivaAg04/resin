import { formatPrice } from "@/lib/utils/format";

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${digitsOnly(phone)}?${params.toString()}`;
}

/** Business WhatsApp number, from env, in international-digits form (e.g. 919876543210). */
export function getBusinessWhatsAppNumber(): string {
  return digitsOnly(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "");
}

export function buildGenericWhatsAppUrl(message = "Hi! I'd like to know more about your resin products."): string {
  return buildWhatsAppUrl(getBusinessWhatsAppNumber(), message);
}

export interface OrderConfirmationMessageInput {
  orderNumber: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  customerName: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state?: string | null;
  pincode: string;
}

export function buildOrderConfirmationMessage(order: OrderConfirmationMessageInput): string {
  return [
    "Hi, I want to confirm my order.",
    "",
    `Order ID: ${order.orderNumber}`,
    "",
    `Product: ${order.productName}`,
    `Quantity: ${order.quantity}`,
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
 * Customer numbers are stored as bare 10-digit Indian mobile numbers (see
 * normalizeIndianMobile) — wa.me links require the country code, so it's
 * added back on here rather than at storage time (storage stays in the
 * plain local format shown in the admin panel and order messages).
 */
export function buildAdminContactWhatsAppUrl(order: {
  order_number: string;
  customer_name: string;
  whatsapp_number: string;
}): string {
  const target = `91${digitsOnly(order.whatsapp_number)}`;
  return buildWhatsAppUrl(target, buildAdminContactMessage(order));
}
