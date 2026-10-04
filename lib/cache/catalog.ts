import { revalidateTag } from "next/cache";

/** Cache tag on the product/category listing queries behind /products. */
export const CATALOG_TAG = "catalog";

/** Safety net: even without an admin edit, cached listings refresh at least this often (seconds). */
export const CATALOG_REVALIDATE_SECONDS = 300;

/** Expires the cached listings immediately, so the next /products visit shows the admin's change. */
export function revalidateCatalog() {
  revalidateTag(CATALOG_TAG, { expire: 0 });
}
