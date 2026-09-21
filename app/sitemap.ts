import type { MetadataRoute } from "next";
import { getActiveProducts } from "@/lib/data/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const products = await getActiveProducts();

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: product.updated_at,
    changeFrequency: "weekly",
  }));

  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/products`, changeFrequency: "daily", priority: 0.9 },
    ...productEntries,
  ];
}
