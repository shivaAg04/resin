"use server";

import { revalidatePath } from "next/cache";
import { createCustomRequest, createReferenceUploadUrls } from "@/lib/data/custom-requests";
import {
  MAX_REFERENCE_IMAGE_BYTES,
  MAX_REFERENCE_IMAGES,
  REFERENCE_IMAGE_TYPES,
} from "@/lib/custom-requests/options";
import { customRequestSchema } from "@/lib/utils/validation";
import { queueMetaEvent } from "@/lib/meta/conversions";
import { metaLeadEventId } from "@/lib/meta/event-ids";

/**
 * Step 1 of a photo upload: hands the browser one-time upload URLs into the
 * private bucket. The size here is what the browser reports — the bucket's
 * own 10 MB limit is what actually enforces it.
 */
export async function prepareReferenceUploads(
  files: { type: string; size: number }[],
): Promise<{ uploads?: { path: string; token: string }[]; error?: string }> {
  if (!Array.isArray(files) || files.length === 0) return { uploads: [] };
  if (files.length > MAX_REFERENCE_IMAGES) return { error: `You can add up to ${MAX_REFERENCE_IMAGES} photos.` };

  const extensions: string[] = [];
  for (const file of files) {
    const ext = REFERENCE_IMAGE_TYPES[file?.type];
    if (!ext) return { error: "Please upload JPG, PNG, WEBP or HEIC photos." };
    if (typeof file.size !== "number" || file.size > MAX_REFERENCE_IMAGE_BYTES) {
      return { error: "Each photo must be under 10 MB." };
    }
    extensions.push(ext);
  }
  return createReferenceUploadUrls(extensions);
}

export type SubmitCustomRequestResult =
  | { requestNumber: string }
  | { error: string; fieldErrors?: Record<string, string> };

export async function submitCustomRequest(input: Record<string, unknown>): Promise<SubmitCustomRequestResult> {
  // Honeypot: a field hidden from people. Bots that fill it get a fake success.
  if (typeof input.website === "string" && input.website.trim() !== "") {
    return { requestNumber: "CR-0000" };
  }

  const parsed = customRequestSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please check the highlighted fields.", fieldErrors };
  }

  const result = await createCustomRequest(parsed.data);
  if (result.error || !result.requestNumber) return { error: result.error ?? "Something went wrong." };

  queueMetaEvent({
    eventName: "Lead",
    eventId: metaLeadEventId(result.requestNumber),
    customer: { phone: parsed.data.whatsappNumber, name: parsed.data.customerName },
    customData: { content_name: "Custom order" },
  });

  revalidatePath("/admin/custom-requests");
  revalidatePath("/admin");
  return { requestNumber: result.requestNumber };
}
