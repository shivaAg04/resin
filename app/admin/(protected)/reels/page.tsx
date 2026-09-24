import type { Metadata } from "next";
import { AddReelForm } from "@/components/admin/AddReelForm";
import { ReelRow } from "@/components/admin/ReelRow";
import { getAllReelsAdmin } from "@/lib/data/reels";

export const metadata: Metadata = { title: "Reels" };

export default async function AdminReelsPage() {
  const reels = await getAllReelsAdmin();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Reels</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Paste an Instagram Reel or post link to show it on the homepage. Use the arrows or the
        weight field to set the order, and the toggle to hide a reel without deleting it.
      </p>

      <div className="mt-6">
        <AddReelForm />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {reels.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border-soft py-10 text-center text-sm text-ink-soft">
            No reels yet. Paste a link above to add your first one.
          </p>
        ) : (
          reels.map((reel, index) => (
            <ReelRow key={reel.id} reel={reel} isFirst={index === 0} isLast={index === reels.length - 1} />
          ))
        )}
      </div>
    </div>
  );
}
