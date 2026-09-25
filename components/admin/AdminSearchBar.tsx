import { Search } from "lucide-react";

export function AdminSearchBar({
  action,
  defaultValue,
  placeholder,
}: {
  action: string;
  defaultValue?: string;
  placeholder: string;
}) {
  return (
    <form action={action} method="GET" role="search" className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
      <input
        type="search"
        name="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-full border border-ink/15 bg-white py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/20"
      />
    </form>
  );
}
