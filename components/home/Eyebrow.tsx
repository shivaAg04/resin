import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/format";

/** Small uppercase label above a section heading */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft", className)}>
      <Sparkles className="h-3.5 w-3.5 text-amber-dark shrink-0" strokeWidth={1.8} aria-hidden="true" />
      {children}
    </p>
  );
}
