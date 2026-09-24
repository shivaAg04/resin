"use client";

import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { SortWeightInput } from "@/components/admin/SortWeightInput";
import {
  deleteReelAction,
  moveReelSortOrderAction,
  setReelSortOrderAction,
  toggleReelActiveAction,
} from "@/app/admin/(protected)/reels/actions";
import type { Reel } from "@/types";

export function ReelRow({
  reel,
  isFirst,
  isLast,
}: {
  reel: Reel;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border-soft/70 bg-white p-3">
      <div className="flex items-center gap-2">
        <SortWeightInput id={reel.id} value={reel.sort_order} action={setReelSortOrderAction} />
        <div className="flex flex-col gap-0.5">
          <form action={moveReelSortOrderAction}>
            <input type="hidden" name="id" value={reel.id} />
            <input type="hidden" name="direction" value="up" />
            <button
              type="submit"
              disabled={isFirst}
              className="flex h-6 w-6 items-center justify-center text-ink-soft hover:text-ink disabled:opacity-20"
              aria-label="Move up"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
          </form>
          <form action={moveReelSortOrderAction}>
            <input type="hidden" name="id" value={reel.id} />
            <input type="hidden" name="direction" value="down" />
            <button
              type="submit"
              disabled={isLast}
              className="flex h-6 w-6 items-center justify-center text-ink-soft hover:text-ink disabled:opacity-20"
              aria-label="Move down"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
        <div className="min-w-0">
          <a
            href={reel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-sm font-medium text-amber-dark hover:underline"
          >
            {reel.url}
          </a>
          {reel.caption && <p className="truncate text-xs text-ink-soft">{reel.caption}</p>}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <form action={toggleReelActiveAction}>
          <input type="hidden" name="id" value={reel.id} />
          <input type="hidden" name="nextActive" value={String(!reel.is_active)} />
          <button
            type="submit"
            className={
              reel.is_active
                ? "rounded-full border border-ink bg-ink px-3 py-1.5 text-xs font-medium text-cream"
                : "rounded-full border border-border-soft px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-ink/30"
            }
          >
            {reel.is_active ? "Active" : "Hidden"}
          </button>
        </form>
        <form
          action={deleteReelAction}
          onSubmit={(e) => {
            if (!confirm("Remove this reel from the homepage?")) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={reel.id} />
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-full text-red-600 transition-colors hover:bg-red-50"
            aria-label="Delete reel"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
