"use server";

import { revalidatePath } from "next/cache";
import { createBulkRequest } from "@/lib/data/custom-requests";
import { normalizeAnyWhatsAppNumber } from "@/lib/utils/validation";
import { queueMetaEvent } from "@/lib/meta/conversions";
import { metaLeadEventId } from "@/lib/meta/event-ids";

export interface SubmitBulkOrderResult {
  requestNumber?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function submitBulkOrderRequest(input: {
  name: string;
  phone: string;
  location: string;
  products: string;
  quantity: string;
  neededBy?: string;
  budget?: string;
  details?: string;
  website?: string;
}): Promise<SubmitBulkOrderResult> {
  // Honeypot for bots
  if (typeof input.website === "string" && input.website.trim() !== "") {
    return { requestNumber: "BR-0000" };
  }

  const fieldErrors: Record<string, string> = {};
  if (!input.name?.trim()) fieldErrors.name = "Name is required";
  if (!input.phone?.trim()) fieldErrors.phone = "Phone / WhatsApp number is required";
  if (!input.location?.trim()) fieldErrors.location = "City / country is required";
  if (!input.products?.trim()) fieldErrors.products = "Products / occasion is required";
  if (!input.quantity?.trim()) fieldErrors.quantity = "Quantity is required";

  let normalizedPhone = "";
  if (input.phone?.trim()) {
    normalizedPhone = normalizeAnyWhatsAppNumber(input.phone);
    if (!/^[6-9]\d{9}$/.test(normalizedPhone) && !normalizedPhone.startsWith("+")) {
      fieldErrors.phone = "Enter a valid 10-digit mobile number, or include country code (+...)";
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Please fill in all required fields.", fieldErrors };
  }

  const result = await createBulkRequest({
    customerName: input.name.trim(),
    whatsappNumber: normalizedPhone,
    location: input.location.trim(),
    products: input.products.trim(),
    quantity: input.quantity.trim(),
    requiredDate: input.neededBy?.trim() || null,
    budget: input.budget?.trim() || null,
    details: input.details?.trim() || null,
  });

  if (result.error || !result.requestNumber) {
    return { error: result.error ?? "Something went wrong. Please try again." };
  }

  queueMetaEvent({
    eventName: "Lead",
    eventId: metaLeadEventId(result.requestNumber),
    customer: { phone: normalizedPhone, name: input.name },
    customData: { content_name: "Bulk order" },
  });

  revalidatePath("/admin/custom-requests");
  revalidatePath("/admin");

  return { requestNumber: result.requestNumber };
}
