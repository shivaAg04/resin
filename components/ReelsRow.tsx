import { Eyebrow } from "@/components/home/Eyebrow";
import { ReelsCarousel } from "@/components/ReelsCarousel";
import type { Reel } from "@/types";

export function ReelsRow({ reels }: { reels: Reel[] }) {
  if (reels.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <Eyebrow className="justify-center">Our creations, on your feed</Eyebrow>
        <h2 className="mx-auto mt-2 max-w-2xl font-display text-2xl font-medium leading-tight text-ink sm:text-3xl">
          Watch Spilled Colours come to life through our Instagram Reels.
        </h2>
      </div>
      <ReelsCarousel reels={reels} />
    </section>
  );
}
