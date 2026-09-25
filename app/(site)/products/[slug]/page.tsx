import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageGallery } from "@/components/products/ImageGallery";
import { BuyNowPanel } from "@/components/products/BuyNowPanel";
import { ProductImage } from "@/components/products/ProductImage";
import { ReviewsCarousel } from "@/components/products/ReviewsCarousel";
import { InstagramEmbed, processInstagramEmbeds } from "@/components/InstagramEmbed";
import { Badge } from "@/components/ui/Badge";
import { getProductBySlug } from "@/lib/data/products";
import { getActiveReviewsForProduct } from "@/lib/data/reviews";
import { formatPrice } from "@/lib/utils/format";

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductDetailPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const reviews = await getActiveReviewsForProduct(product.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ImageGallery images={product.images ?? []} alt={product.name} />

        <div className="flex flex-col gap-5">
          {product.categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {product.categories.map((category) => (
                <Badge key={category.id}>{category.name}</Badge>
              ))}
            </div>
          )}

          <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{product.name}</h1>
          <p className="font-display text-2xl font-medium text-amber-dark">{formatPrice(product.price)}</p>

          {product.description && (
            <p className="text-base leading-relaxed text-ink-soft">{product.description}</p>
          )}

          <div className="mt-2 border-t border-border-soft/70 pt-6">
            <BuyNowPanel slug={product.slug} price={Number(product.price)} />
          </div>

          {product.bundle_items.length > 0 && (
            <div className="border-t border-border-soft/70 pt-6">
              <h2 className="mb-3 font-display text-lg font-semibold text-ink">This Bundle Includes</h2>
              <div className="flex flex-col gap-2">
                {product.bundle_items.map((item) => (
                  <Link
                    key={item.product_id}
                    href={`/products/${item.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-border-soft/70 bg-white p-2.5 transition-colors hover:border-amber/40"
                  >
                    <ProductImage src={item.images?.[0]} alt={item.name} className="h-12 w-12 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{item.name}</p>
                      <p className="text-xs text-ink-soft">
                        {item.quantity > 1 ? `${item.quantity} × ` : ""}
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {product.reel_url && (
            <div className="border-t border-border-soft/70 pt-6">
              <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" onLoad={processInstagramEmbeds} />
              <h2 className="mb-3 font-display text-lg font-semibold text-ink">See it in action</h2>
              <div className="max-w-sm">
                <InstagramEmbed url={product.reel_url} caption={product.name} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 border-t border-border-soft/70 pt-8">
        <ReviewsCarousel title="Customer Reviews" reviews={reviews} />
      </div>
    </div>
  );
}
