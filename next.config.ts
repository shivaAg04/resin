import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;
const r2Url = process.env.R2_PUBLIC_URL;
const r2Hostname = r2Url ? new URL(r2Url).hostname : undefined;

const nextConfig: NextConfig = {
  images: {
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
      ...(r2Hostname ? [{ protocol: "https" as const, hostname: r2Hostname, pathname: "/**" }] : []),
    ],
  },
};

export default nextConfig;
