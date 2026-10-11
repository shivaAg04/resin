import { cn } from "@/lib/utils/format";

/** Small uppercase label above a section heading, with the brush-stroke flourish from the design. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft", className)}>
      <svg viewBox="0 0 24 12" className="h-3 w-6 text-amber-dark" fill="none" aria-hidden="true">
        <path d="M1 10c4-1 7-4 10-7M8 11c4-1 9-5 15-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      {children}
    </p>
  );
}
