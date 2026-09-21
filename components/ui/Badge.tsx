import { cn } from "@/lib/utils/format";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-ink/10 bg-white/70 px-3 py-1 text-xs font-medium tracking-wide text-ink-soft",
        className,
      )}
    >
      {children}
    </span>
  );
}
