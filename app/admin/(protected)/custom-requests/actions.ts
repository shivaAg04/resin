"use server";

import { revalidatePath } from "next/cache";
import { deleteCustomRequest, setCustomRequestStatus } from "@/lib/data/custom-requests";
import { CUSTOM_REQUEST_STATUSES, type CustomRequestStatus } from "@/lib/custom-requests/options";

export async function updateCustomRequestStatusAction(
  id: string,
  status: CustomRequestStatus,
): Promise<{ error?: string }> {
  if (!CUSTOM_REQUEST_STATUSES.includes(status)) return { error: "Invalid status." };
  const result = await setCustomRequestStatus(id, status);
  if (result.error) return result;
  revalidatePath("/admin/custom-requests");
  revalidatePath("/admin");
  return {};
}

export async function deleteCustomRequestAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id"));
  await deleteCustomRequest(id);
  revalidatePath("/admin/custom-requests");
  revalidatePath("/admin");
}
