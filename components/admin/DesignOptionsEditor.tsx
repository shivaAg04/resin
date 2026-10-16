"use client";

import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Field";
import { cn } from "@/lib/utils/format";

export interface DesignOptionRow {
  name: string;
  image: string;
}

/** One row per design: its name plus which of the product's photos shows it. */
export function DesignOptionsEditor({
  designs,
  images,
  onChange,
}: {
  designs: DesignOptionRow[];
  images: string[];
  onChange: (designs: DesignOptionRow[]) => void;
}) {
  function update(index: number, patch: Partial<DesignOptionRow>) {
    onChange(designs.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  return (
    <div className="flex flex-col gap-3">
      {designs.map((design, index) => (
        <div key={index} className="rounded-2xl border border-border-soft bg-white p-3">
          <div className="flex items-center gap-2">
            <Input
              aria-label={`Design ${index + 1} name`}
              placeholder={`e.g. Design ${index + 1}`}
              value={design.name}
              onChange={(e) => update(index, { name: e.target.value })}
            />
            <button
              type="button"
              onClick={() => onChange(designs.filter((_, i) => i !== index))}
              aria-label={`Remove design ${index + 1}`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink-soft hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {images.length > 0 ? (
            <div className="mt-2.5">
              <p className="text-xs text-ink-soft">Photo for this design:</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {images.map((src, imageIndex) => {
                  const selected = design.image === src;
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => update(index, { image: selected ? "" : src })}
                      aria-label={`Use photo ${imageIndex + 1}`}
                      aria-pressed={selected}
                      className={cn(
                        "relative h-14 w-14 overflow-hidden rounded-lg border-2 transition-colors",
                        selected ? "border-ink" : "border-transparent opacity-70 hover:border-ink/30 hover:opacity-100",
                      )}
                    >
                      <Image src={src} alt="" fill sizes="56px" className="object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="mt-2 text-xs text-ink-soft">Upload product images above to link a photo to this design.</p>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...designs, { name: `Design ${designs.length + 1}`, image: "" }])}
        className="inline-flex items-center gap-2 self-start rounded-full border border-dashed border-ink/30 px-4 py-2 text-xs font-medium text-ink hover:border-ink"
      >
        <Plus className="h-4 w-4" /> Add Design
      </button>
    </div>
  );
}
