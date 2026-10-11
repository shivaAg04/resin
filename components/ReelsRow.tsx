import { Eyebrow } from "@/components/home/Eyebrow";
import { ReelsCarousel } from "@/components/ReelsCarousel";
import type { Reel } from "@/types";

export function ReelsRow({ reels }: { reels: Reel[] }) {
  if (reels.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <Eyebrow className="justify-center">Straight from our Reels</Eyebrow>
        <h2 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">As Seen On Instagram</h2>
      </div>
      <ReelsCarousel reels={reels} />
    </section>
  );
}
