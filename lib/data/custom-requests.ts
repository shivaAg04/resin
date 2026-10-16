import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  REFERENCE_BUCKET,
  REFERENCE_PATH_PATTERN,
  type CustomRequestStatus,
} from "@/lib/custom-requests/options";
import type { CustomRequestInput } from "@/lib/utils/validation";

export interface CustomRequest {
  id: string;
  request_number: string;
  customer_name: string;
  whatsapp_number: string;
  looking_for: string;
  occasion: string;
  budget: string;
  quantity: string;
  required_date: string | null;
  preferred_colours: string;
  details: string | null;
  reference_images: string[];
  status: CustomRequestStatus;
  created_at: string;
  updated_at: string;
}

/** One-time upload URLs into the private bucket, for an anonymous customer's reference photos. */
export async function createReferenceUploadUrls(
  extensions: string[],
): Promise<{ uploads?: { path: string; token: string }[]; error?: string }> {
  const supabase = createAdminClient();
  const uploads: { path: string; token: string }[] = [];

  for (const ext of extensions) {
    const path = `pending/${crypto.randomUUID()}.${ext}`;
    const { data, error } = await supabase.storage.from(REFERENCE_BUCKET).createSignedUploadUrl(path);
    if (error || !data) {
      console.error("createReferenceUploadUrls error", error);
      return { error: "Couldn't prepare the photo upload. Please try again." };
    }
    uploads.push({ path: data.path, token: data.token });
  }
  return { uploads };
}

/** Saves a request from the public form. Runs with the service role, like order creation. */
export async function createCustomRequest(
  input: CustomRequestInput,
): Promise<{ requestNumber?: string; error?: string }> {
  const referenceImages = input.referenceImages.filter((path) => REFERENCE_PATH_PATTERN.test(path));

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("custom_requests")
    .insert({
      customer_name: input.customerName,
      whatsapp_number: input.whatsappNumber,
      looking_for: input.lookingFor,
      occasion: input.occasion,
      budget: input.budget,
      quantity: input.quantity,
      required_date: input.requiredDate || null,
      preferred_colours: input.preferredColours,
      details: input.details || null,
      reference_images: referenceImages,
    })
    .select("request_number")
    .single();

  if (error || !data) {
    console.error("createCustomRequest error", error);
    return { error: "We couldn't send your request. Please try again." };
  }
  return { requestNumber: data.request_number };
}

export interface BulkRequestInput {
  customerName: string;
  whatsappNumber: string;
  location: string;
  products: string;
  quantity: string;
  requiredDate?: string | null;
  budget?: string | null;
  details?: string | null;
}

/** Saves a bulk order enquiry directly to the database. Runs with the service role. */
export async function createBulkRequest(
  input: BulkRequestInput,
): Promise<{ requestNumber?: string; error?: string }> {
  const supabase = createAdminClient();

  const detailsFormatted = [
    input.location ? `City / Country: ${input.location}` : null,
    input.details ? `Additional Details: ${input.details}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const { data, error } = await supabase
    .from("custom_requests")
    .insert({
      customer_name: input.customerName,
      whatsapp_number: input.whatsappNumber,
      looking_for: `[Bulk Order] ${input.products}`,
      occasion: "Bulk & Corporate Gifting",
      budget: input.budget || "Not specified",
      quantity: input.quantity,
      required_date: input.requiredDate || null,
      preferred_colours: "Bulk Enquiry",
      details: detailsFormatted || null,
      reference_images: [],
    })
    .select("request_number")
    .single();

  if (error || !data) {
    console.error("createBulkRequest error", error);
    return { error: "We couldn't send your bulk enquiry. Please try again." };
  }
  return { requestNumber: data.request_number };
}

// ------------------------------------------------------------
// Admin (cookie-bound client; RLS limits these to signed-in admins)
// ------------------------------------------------------------

export async function getCustomRequestsAdmin(status?: CustomRequestStatus): Promise<CustomRequest[]> {
  const supabase = await createClient();
  let query = supabase.from("custom_requests").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) {
    console.error("getCustomRequestsAdmin error", error);
    return [];
  }
  return data as CustomRequest[];
}

export async function countNewCustomRequests(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("custom_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");
  if (error) return 0;
  return count ?? 0;
}

/** Short-lived (1 hour) view links for reference photos, keyed by storage path. */
export async function getReferenceImageUrls(paths: string[]): Promise<Record<string, string>> {
  if (paths.length === 0) return {};
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(REFERENCE_BUCKET).createSignedUrls(paths, 60 * 60);
  if (error || !data) {
    console.error("getReferenceImageUrls error", error);
    return {};
  }
  const urls: Record<string, string> = {};
  for (const item of data) {
    if (item.path && item.signedUrl) urls[item.path] = item.signedUrl;
  }
  return urls;
}

export async function setCustomRequestStatus(id: string, status: CustomRequestStatus): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("custom_requests").update({ status }).eq("id", id);
  if (error) {
    console.error("setCustomRequestStatus error", error);
    return { error: "Could not update the request." };
  }
  return {};
}

/** Deletes a request and its reference photos. */
export async function deleteCustomRequest(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: request } = await supabase.from("custom_requests").select("reference_images").eq("id", id).maybeSingle();

  const { error } = await supabase.from("custom_requests").delete().eq("id", id);
  if (error) {
    console.error("deleteCustomRequest error", error);
    return { error: "Could not delete the request." };
  }
  const paths = (request?.reference_images as string[] | undefined) ?? [];
  if (paths.length > 0) await supabase.storage.from(REFERENCE_BUCKET).remove(paths);
  return {};
}
