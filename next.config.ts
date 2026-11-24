import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;
const r2Url = process.env.R2_PUBLIC_URL;
const r2Hostname = r2Url ? new URL(r2Url).hostname : undefined;
// The previous Supabase project still holds a few images the database points
// at. Allowing its host keeps those pages rendering (next/image throws on an
// unknown host) until the images are moved to R2; then this can go.
const legacySupabaseHostname = "fkqwhhzisipdjtlzbihu.supabase.co";

const nextConfig: NextConfig = {
  images: {
    // Vercel's free image-optimization quota ran out (uncached images got a
    // 402), so images are served as-is. Uploads are already shrunk to a
    // 1600px WebP in the browser (lib/uploads/compress.ts). Remove this to
    // turn optimization back on (e.g. on a paid plan or a Cloudflare loader).
    unoptimized: true,
    // AVIF is ~30-50% smaller than WebP; browsers without it still get WebP.
    formats: ["image/avif", "image/webp"],
    qualities: [65, 75, 90],
    remotePatterns: [
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      ...(supabaseHostname !== legacySupabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: legacySupabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      ...(r2Hostname ? [{ protocol: "https" as const, hostname: r2Hostname, pathname: "/**" }] : []),
    ],
  },
};

export default nextConfig;
