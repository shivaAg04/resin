import { PackageX } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <PackageX className="h-10 w-10 text-amber-dark" strokeWidth={1.5} />
      <h1 className="font-display text-2xl font-semibold text-ink">Product not found</h1>
      <p className="text-sm text-ink-soft">
        This product may have been removed or is no longer available.
      </p>
      <ButtonLink href="/products">Browse all products</ButtonLink>
    </div>
  );
}
