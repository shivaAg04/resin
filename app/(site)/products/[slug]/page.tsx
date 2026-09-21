import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ImageGallery } from "@/components/products/ImageGallery";
import { BuyNowPanel } from "@/components/products/BuyNowPanel";
import { Badge } from "@/components/ui/Badge";
import { getProductBySlug } from "@/lib/data/products";
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
        </div>
      </div>
    </div>
  );
}
