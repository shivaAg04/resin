import { Sparkle } from "lucide-react";

const ANNOUNCEMENTS = [
  "Custom Resin Creations",
  "PAN-India Shipping Available",
  "Worldwide International Delivery",
  "Handcrafted & Made Just For You",
  "Bulk & Corporate Gifting",
  "Your Idea · Our Creativity",
];

// Repeat to ensure seamless scrolling even on ultra-wide screens
const ITEMS = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

export function AnnouncementBar() {
  return (
    <div className="overflow-hidden border-b border-border-soft/60 bg-lilac text-ink-soft select-none py-0.5">
      <div className="flex h-7 items-center">
        <div className="animate-marquee flex shrink-0 items-center">
          {/* Half 1 */}
          {ITEMS.map((item, idx) => (
            <div key={`h1-${idx}`} className="flex shrink-0 items-center gap-3 px-6 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
              <Sparkle className="h-2.5 w-2.5 text-amber-dark shrink-0" aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
          {/* Half 2 (identical duplicate for infinite loop) */}
          {ITEMS.map((item, idx) => (
            <div key={`h2-${idx}`} className="flex shrink-0 items-center gap-3 px-6 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-soft">
              <Sparkle className="h-2.5 w-2.5 text-amber-dark shrink-0" aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
