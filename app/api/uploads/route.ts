import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { putPublicImage } from "@/lib/r2/server";

// Admin-only folders need a signed-in admin; customer folders are open
// (customers check out without an account), same as before.
const ADMIN_FOLDERS = new Set(["products", "designs"]);
const CUSTOMER_FOLDERS = new Set(["review-uploads", "customer-uploads"]);

// The browser compresses to ~1600px before uploading, so real uploads are a
// few hundred KB. Anything bigger didn't come from our uploader.
const MAX_BYTES = 3 * 1024 * 1024;

function detectType(bytes: Uint8Array): { ext: string; mime: string } | null {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.subarray(start, end));
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { ext: "jpg", mime: "image/jpeg" };
  if (bytes[0] === 0x89 && ascii(1, 4) === "PNG") return { ext: "png", mime: "image/png" };
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { ext: "webp", mime: "image/webp" };
  return null;
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const folder = String(form.get("folder") ?? "");
  const file = form.get("file");
  if (!ADMIN_FOLDERS.has(folder) && !CUSTOMER_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "Please choose a photo." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Photo is too large. Please try another one." }, { status: 413 });
  }

  if (ADMIN_FOLDERS.has(folder)) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  const body = await file.arrayBuffer();
  const type = detectType(new Uint8Array(body, 0, Math.min(16, body.byteLength)));
  if (!type) {
    return NextResponse.json({ error: "Please upload a JPG, PNG or WEBP photo." }, { status: 400 });
  }

  try {
    const url = await putPublicImage(folder, `${crypto.randomUUID()}.${type.ext}`, body, type.mime);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("upload error", err);
    return NextResponse.json({ error: "Could not upload photo. Please try again." }, { status: 502 });
  }
}
