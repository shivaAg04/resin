import { InstagramEmbed } from "@/components/InstagramEmbed";
import { InstagramEmbedsLoader } from "@/components/InstagramEmbedsLoader";
import type { Reel } from "@/types";

export function ReelsRow({ reels }: { reels: Reel[] }) {
  if (reels.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">As Seen On Instagram</h2>
        <p className="mt-1 text-sm text-ink-soft">Straight from our Reels.</p>
      </div>

      <InstagramEmbedsLoader className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {reels.map((reel) => (
          <div key={reel.id} className="w-[300px] shrink-0 snap-start">
            <InstagramEmbed url={reel.url} caption={reel.caption} />
          </div>
        ))}
      </InstagramEmbedsLoader>
    </section>
  );
}
