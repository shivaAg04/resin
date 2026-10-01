import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getOrderWithItemsByRazorpayOrderId, markOrderPaid } from "@/lib/data/orders";
import { verifyPaymentSignature } from "@/lib/payments/razorpay";
import { encodeOrderConfirmation } from "@/lib/utils/order-confirmation";

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

/**
 * Called by the checkout page right after Razorpay's widget reports
 * success. The signature is the only thing that actually proves the
 * payment happened — never trust the widget's "success" callback alone.
 * The webhook (/api/payments/webhook) is the safety net for cases where
 * this call never happens (tab closed right after paying).
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payment response." }, { status: 400 });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    console.error("verify: signature mismatch", razorpay_order_id);
    return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
  }

  const order = await getOrderWithItemsByRazorpayOrderId(razorpay_order_id);
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (order.payment_status !== "paid") {
    await markOrderPaid(razorpay_order_id, razorpay_payment_id);
  }

  const confirmation = encodeOrderConfirmation({
    orderNumber: order.order_number,
    items: order.order_items.map((item) => ({
      productName: item.product_name,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price),
      subtotal: Number(item.subtotal),
    })),
    totalAmount: Number(order.total_amount),
    customerName: order.customer_name,
    whatsappNumber: order.whatsapp_number,
    address: order.address,
    city: order.city,
    state: order.state,
    pincode: order.pincode,
  });

  return NextResponse.json({ orderNumber: order.order_number, confirmation });
}
