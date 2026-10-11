import { Sparkle } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-lilac text-ink-soft">
      <p className="mx-auto flex h-8 max-w-6xl items-center justify-center gap-2 px-4 text-[11px] tracking-wide sm:text-xs">
        <Sparkle className="h-3 w-3 text-amber-dark" aria-hidden="true" />
        Custom Resin Creations
        <span aria-hidden="true" className="text-ink-soft/40">|</span>
        Made Just For You
        <Sparkle className="h-3 w-3 text-amber-dark" aria-hidden="true" />
      </p>
    </div>
  );
}
