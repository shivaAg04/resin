import { cn } from "@/lib/utils/format";

export function StatCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border-soft/70 bg-white p-5", className)}>
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
