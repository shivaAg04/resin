import { Plus } from "lucide-react";

/** Native <details> expand/collapse row with a + that turns into ×. No JavaScript needed. */
export function Disclosure({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-border-soft">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <Plus className="h-4 w-4 shrink-0 text-ink-soft transition-transform group-open:rotate-45" />
      </summary>
      <div className="pb-5 text-sm leading-relaxed text-ink-soft">{children}</div>
    </details>
  );
}
