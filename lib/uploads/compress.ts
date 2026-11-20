"use client";

const MAX_EDGE = 1600;
const QUALITY = 0.8;

/**
 * Shrinks a photo in the browser before upload: longest edge 1600px, WebP
 * (JPEG where the browser can't encode WebP). A 30 MB PNG ends up ~300 KB,
 * which keeps uploads fast and well under the server's request size limit.
 */
export async function compressImage(file: File): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("This photo format isn't supported. Please upload a JPG, PNG or WEBP photo.");
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process the photo. Please try again.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const toBlob = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALITY));

  const webp = await toBlob("image/webp");
  if (webp && webp.type === "image/webp") return webp;
  const jpeg = await toBlob("image/jpeg");
  if (jpeg) return jpeg;
  throw new Error("Could not process the photo. Please try again.");
}

/** Compresses a photo and uploads it through /api/uploads. Returns its public URL. */
export async function uploadImage(
  folder: "products" | "designs" | "review-uploads" | "customer-uploads",
  file: File,
): Promise<{ url?: string; error?: string }> {
  let blob: Blob;
  try {
    blob = await compressImage(file);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not process the photo." };
  }

  const body = new FormData();
  body.append("folder", folder);
  body.append("file", blob, blob.type === "image/webp" ? "photo.webp" : "photo.jpg");

  try {
    const res = await fetch("/api/uploads", { method: "POST", body });
    const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (!res.ok || !data.url) return { error: data.error ?? "Could not upload photo. Please try again." };
    return { url: data.url };
  } catch {
    return { error: "Could not upload photo. Please check your connection and try again." };
  }
}
