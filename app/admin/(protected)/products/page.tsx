import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown, ChevronUp, Pencil, Plus } from "lucide-react";
import { ProductImage } from "@/components/products/ProductImage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Badge } from "@/components/ui/Badge";
import { SortWeightInput } from "@/components/admin/SortWeightInput";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { getAllProductsAdmin } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils/format";
import { moveProductSortOrderAction, setProductSortOrderAction, toggleProductActiveAction } from "./actions";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage(props: PageProps<"/admin/products">) {
  const searchParams = await props.searchParams;
  const search = typeof searchParams.search === "string" ? searchParams.search.trim().toLowerCase() : "";

  const allProducts = await getAllProductsAdmin();
  const products = search
    ? allProducts.filter(
        (p) => p.name.toLowerCase().includes(search) || p.code.toLowerCase().includes(search),
      )
    : allProducts;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Products</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <AdminSearchBar action="/admin/products" defaultValue={search} placeholder="Search by name or code..." />
          <ButtonLink href="/admin/products/new" size="sm">
            <Plus className="h-4 w-4" /> Add Product
          </ButtonLink>
        </div>
      </div>
      <p className="mt-1 text-sm text-ink-soft">
        Use the arrows to set display order across the storefront and homepage rows.
      </p>

      {products.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-border-soft py-16 text-center text-sm text-ink-soft">
          {search ? `No products match "${search}".` : "No products yet. Add your first one to get started."}
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <div key={product.id} className="overflow-hidden rounded-2xl border border-border-soft/70 bg-white">
              <div className="relative">
                <ProductImage src={product.images?.[0]} alt={product.name} className="aspect-video w-full" />
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-white/90 p-1 shadow-sm">
                  <SortWeightInput id={product.id} value={product.sort_order} action={setProductSortOrderAction} />
                  <div className="flex flex-col gap-0.5 overflow-hidden rounded-md">
                    <form action={moveProductSortOrderAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        disabled={index === 0}
                        className="flex h-6 w-6 items-center justify-center text-ink-soft hover:text-ink disabled:opacity-30"
                        aria-label={`Move ${product.name} up`}
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                    </form>
                    <form action={moveProductSortOrderAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        disabled={index === products.length - 1}
                        className="flex h-6 w-6 items-center justify-center text-ink-soft hover:text-ink disabled:opacity-30"
                        aria-label={`Move ${product.name} down`}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs text-ink-soft/70">{product.code}</span>
                    <h3 className="font-display text-base font-medium text-ink">{product.name}</h3>
                  </div>
                  <Badge className={product.is_active ? "border-green-200 bg-green-50 text-green-700" : "border-ink/10 bg-ink/5 text-ink-soft"}>
                    {product.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-ink-soft">{formatPrice(product.price)}</p>

                {product.categories.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {product.categories.map((category) => (
                      <Badge key={category.id} className="text-[11px]">
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-ink/15 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>

                  <form action={toggleProductActiveAction}>
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="nextActive" value={String(!product.is_active)} />
                    <button
                      type="submit"
                      className="rounded-full border border-ink/15 px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-ink/5"
                    >
                      {product.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </form>

                  <DeleteProductButton id={product.id} name={product.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
