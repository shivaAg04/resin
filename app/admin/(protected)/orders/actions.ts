"use server";

import { revalidatePath } from "next/cache";
import { updateOrderStatus } from "@/lib/data/orders";
import type { OrderStatus } from "@/types";

export async function updateOrderStatusAction(orderId: string, status: OrderStatus): Promise<{ error?: string }> {
  const result = await updateOrderStatus(orderId, status);
  if (result.error) return result;

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  return {};
}
