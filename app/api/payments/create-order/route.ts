import { NextResponse, type NextRequest } from "next/server";
import { attachRazorpayOrderId, createOrderFromCheckout, deleteOrder } from "@/lib/data/orders";
import { createOrderSchema } from "@/lib/utils/validation";
import { createRazorpayOrder, isRazorpayConfigured } from "@/lib/payments/razorpay";

/**
 * Starts an online payment: creates our order (payment_status "pending",
 * same as any order) then a matching Razorpay order for the server-computed
 * total. The frontend opens Razorpay's checkout with what this returns;
 * /api/payments/verify confirms the payment afterwards.
 */
export async function POST(request: NextRequest) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Online payment isn't set up yet — please use WhatsApp/COD." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue?.message ?? "Please check the form and try again." },
      { status: 400 },
    );
  }

  const result = await createOrderFromCheckout(parsed.data, "online");
  if (result.error || !result.order) {
    return NextResponse.json({ error: result.error ?? "Something went wrong." }, { status: 400 });
  }

  try {
    const razorpayOrder = await createRazorpayOrder(Number(result.order.total_amount), result.order.order_number);
    await attachRazorpayOrderId(result.order.id, razorpayOrder.id);

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      orderNumber: result.order.order_number,
      customerName: result.order.customer_name,
      whatsappNumber: result.order.whatsapp_number,
    });
  } catch (error) {
    console.error("create-order Razorpay order failed", error);
    await deleteOrder(result.order.id);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 502 });
  }
}
