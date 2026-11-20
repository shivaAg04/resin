import "server-only";
import { AwsClient } from "aws4fetch";

/**
 * Public images (product photos, design photos, customer review/order photos)
 * live in a Cloudflare R2 bucket, which has no egress charges. Private custom
 * order references stay in Supabase Storage.
 */
const R2_FOLDER = "product-images";

let client: AwsClient | null = null;

function getClient(): AwsClient {
  if (!client) {
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    if (!accessKeyId || !secretAccessKey) throw new Error("R2 credentials are not configured.");
    client = new AwsClient({ accessKeyId, secretAccessKey, service: "s3", region: "auto" });
  }
  return client;
}

export function r2PublicUrl(key: string): string {
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

/** Public URL prefix for a folder, used to check that a submitted URL came from our own uploads. */
export function r2FolderUrlPrefix(folder: string): string {
  return r2PublicUrl(`${R2_FOLDER}/${folder ? `${folder}/` : ""}`);
}

/** Uploads bytes to R2 under product-images/<folder>/<name> and returns the public URL. */
export async function putPublicImage(
  folder: string,
  name: string,
  body: ArrayBuffer,
  contentType: string,
): Promise<string> {
  const key = `${R2_FOLDER}/${folder ? `${folder}/` : ""}${name}`;
  const endpoint = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET}/${key}`;
  const res = await getClient().fetch(endpoint, {
    method: "PUT",
    body,
    headers: {
      "content-type": contentType,
      // aws4fetch sends the body as a stream; R2 rejects PUTs without a length.
      "content-length": String(body.byteLength),
      // File names are random UUIDs and never overwritten, so they can be cached forever.
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
  if (!res.ok) throw new Error(`R2 upload failed: ${res.status} ${await res.text()}`);
  return r2PublicUrl(key);
}
