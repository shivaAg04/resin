import { Search } from "lucide-react";

export function SearchBar({ defaultValue, category }: { defaultValue?: string; category?: string }) {
  return (
    <form action="/products" method="GET" role="search" className="relative w-full sm:max-w-xs">
      {category && <input type="hidden" name="category" value={category} />}
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
      <input
        type="search"
        name="search"
        defaultValue={defaultValue}
        placeholder="Search products or categories…"
        aria-label="Search products"
        className="w-full rounded-full border border-ink/15 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/20"
      />
    </form>
  );
}
