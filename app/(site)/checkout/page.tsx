import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { getProductBySlug } from "@/lib/data/products";
import { MAX_ORDER_QUANTITY } from "@/lib/utils/validation";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

function UnavailableState({ message }: { message: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <AlertCircle className="h-10 w-10 text-amber-dark" strokeWidth={1.5} />
      <h1 className="font-display text-2xl font-semibold text-ink">{message}</h1>
      <ButtonLink href="/products">Browse products</ButtonLink>
    </div>
  );
}

export default async function CheckoutPage(props: PageProps<"/checkout">) {
  const searchParams = await props.searchParams;
  const slug = typeof searchParams.product === "string" ? searchParams.product : undefined;
  const requestedQuantity = Number(searchParams.quantity) || 1;

  if (!slug) {
    return <UnavailableState message="No product selected." />;
  }

  const product = await getProductBySlug(slug);

  if (!product) {
    return <UnavailableState message="This product is no longer available." />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href={`/products/${product.slug}`} className="text-sm text-ink-soft hover:text-ink">
        &larr; Back to product
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Checkout</h1>

      <div className="mt-8">
        <CheckoutForm
          productSlug={product.slug}
          productName={product.name}
          productImage={product.images?.[0]}
          price={Number(product.price)}
          initialQuantity={Math.min(Math.max(requestedQuantity, 1), MAX_ORDER_QUANTITY)}
        />
      </div>
    </div>
  );
}
