import { NextResponse, type NextRequest } from "next/server";
import { createOrderFromCheckout } from "@/lib/data/orders";
import { createOrderSchema } from "@/lib/utils/validation";
import { encodeOrderConfirmation } from "@/lib/utils/order-confirmation";

export async function POST(request: NextRequest) {
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

  const result = await createOrderFromCheckout(parsed.data);

  if (result.error || !result.order) {
    return NextResponse.json({ error: result.error ?? "Something went wrong." }, { status: 400 });
  }

  const confirmation = encodeOrderConfirmation({
    orderNumber: result.order.order_number,
    productName: result.productName!,
    quantity: parsed.data.quantity,
    unitPrice: result.unitPrice!,
    subtotal: result.subtotal!,
    totalAmount: Number(result.order.total_amount),
    customerName: result.order.customer_name,
    whatsappNumber: result.order.whatsapp_number,
    address: result.order.address,
    city: result.order.city,
    state: result.order.state,
    pincode: result.order.pincode,
  });

  return NextResponse.json(
    { orderNumber: result.order.order_number, confirmation },
    { status: 201 },
  );
}
