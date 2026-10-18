import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageGallery } from "@/components/products/ImageGallery";
import { BuyNowPanel } from "@/components/products/BuyNowPanel";
import { ProductImage } from "@/components/products/ProductImage";
import { ProductReviewsSection } from "@/components/products/ProductReviewsSection";
import { InstagramEmbed } from "@/components/InstagramEmbed";
import { InstagramEmbedsLoader } from "@/components/InstagramEmbedsLoader";
import { Badge } from "@/components/ui/Badge";
import { TrackPixelEvent } from "@/components/MetaPixel";
import {
  getActiveProducts,
  getDisplayReelsForProduct,
  getGalleryImagesForProduct,
  getProductBySlug,
} from "@/lib/data/products";
import { getReviewsForProductPage } from "@/lib/data/reviews";
import { formatPrice } from "@/lib/utils/format";
import { getProductBadgeLabels } from "@/lib/products/badges";
import { ProductPrice } from "@/components/products/ProductCard";
import { ProductFeatureTiles, ProductInfoSections } from "@/components/products/ProductInfoSections";

// Prerenders every active product at build time so PDPs are served from
// cache instead of hitting Supabase on every visit. New/edited products
// still work via on-demand generation (dynamicParams defaults to true) and
// get cached from their first request; admin mutations invalidate the
// cache for a given slug via revalidatePath.
export async function generateStaticParams() {
  const products = await getActiveProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product not found" };
  const shareImage = getGalleryImagesForProduct(product)[0];

  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: shareImage ? [{ url: shareImage }] : undefined,
    },
  };
}

export default async function ProductDetailPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const reviews = await getReviewsForProductPage(product);
  const reels = getDisplayReelsForProduct(product);

  const bundleSubtotal = product.bundle_items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  const bundleSavings = product.bundle_items.length > 0 ? Math.max(0, bundleSubtotal - Number(product.price)) : 0;
  const badgeLabels = getProductBadgeLabels(product);

  // Extra bottom padding on mobile clears BuyNowPanel's sticky Buy Now bar.
  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:py-12">
      <TrackPixelEvent
        event="ViewContent"
        params={{
          content_ids: [product.slug],
          content_type: "product",
          content_name: product.name,
          value: Number(product.price),
          currency: "INR",
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-ink-soft">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        {product.categories[0] ? (
          <Link href={`/products?category=${product.categories[0].slug}`} className="hover:text-ink">
            {product.categories[0].name}
          </Link>
        ) : (
          <Link href="/products" className="hover:text-ink">
            Shop
          </Link>
        )}
        <span aria-hidden="true">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ImageGallery images={getGalleryImagesForProduct(product)} alt={product.name} />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-display text-3xl font-medium leading-tight text-ink sm:text-4xl">{product.name}</h1>
            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <ProductPrice product={product} className="font-sans text-2xl font-semibold tabular-nums text-amber-dark" />
              {bundleSavings > 0 && (
                <>
                  <span className="text-base text-ink-soft/60 line-through">{formatPrice(bundleSubtotal)}</span>
                  <Badge className="border-green-200 bg-green-50 text-green-700">Save {formatPrice(bundleSavings)}</Badge>
                </>
              )}
            </div>
            {badgeLabels.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {badgeLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-lilac px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-amber-dark"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <ProductFeatureTiles product={product} />

          <div>
            <BuyNowPanel
              slug={product.slug}
              name={product.name}
              price={Number(product.price)}
              image={product.images?.[0]}
              isCustomisable={product.is_customisable}
              allowCustomerImage={product.allow_customer_image}
              designs={(product.design_options ?? []).map((name, i) => ({
                name,
                image: product.design_images?.[i] ?? "",
              }))}
            />
            <p className="mt-4 text-sm text-ink-soft">
              Want this in a different colour, size or style?{" "}
              <Link
                href="/custom-orders"
                className="font-medium text-ink underline underline-offset-2 hover:text-amber-dark"
              >
                Send us your reference
              </Link>
            </p>
          </div>

          <ProductInfoSections product={product} />

          {product.bundle_items.length > 0 && (
            <div>
              <h2 className="mb-3 font-display text-lg font-semibold text-ink">This Bundle Includes</h2>
              <div className="flex flex-col gap-2">
                {product.bundle_items.map((item) => (
                  <Link
                    key={item.product_id}
                    href={`/products/${item.slug}`}
                    className="flex items-center gap-3 rounded-lg border border-border-soft/70 bg-white p-2.5 transition-colors hover:border-ink/20"
                  >
                    <ProductImage src={item.images?.[0]} alt={item.name} className="h-12 w-12 shrink-0 rounded-md" />
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

          {reels.length > 0 && (
            <InstagramEmbedsLoader>
              <h2 className="mb-3 font-display text-lg font-semibold text-ink">See it in action</h2>
              {reels.length === 1 ? (
                <div className="max-w-sm">
                  <InstagramEmbed url={reels[0].url} caption={reels[0].caption} />
                </div>
              ) : (
                <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
                  {reels.map((reel) => (
                    <div key={reel.url} className="w-[260px] shrink-0 snap-start">
                      <InstagramEmbed url={reel.url} caption={reel.caption} />
                    </div>
                  ))}
                </div>
              )}
            </InstagramEmbedsLoader>
          )}
        </div>
      </div>

      <div className="mt-14 border-t border-border-soft/70 pt-10">
        <ProductReviewsSection
          productId={product.id}
          productSlug={product.slug}
          productName={product.name}
          reviews={reviews}
        />
      </div>
    </div>
  );
}
