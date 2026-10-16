"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { Input } from "@/components/ui/Field";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/format";

export interface DesignOptionRow {
  name: string;
  image: string;
}

/** One row per design: its name plus its photo (uploaded here, or picked from the product's photos). */
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
        <DesignRow
          key={index}
          index={index}
          design={design}
          productImages={images}
          onChange={(patch) => update(index, patch)}
          onRemove={() => onChange(designs.filter((_, i) => i !== index))}
        />
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

function DesignRow({
  index,
  design,
  productImages,
  onChange,
  onRemove,
}: {
  index: number;
  design: DesignOptionRow;
  productImages: string[];
  onChange: (patch: Partial<DesignOptionRow>) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `designs/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError("Upload failed. Please try again.");
    } else {
      onChange({ image: supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl });
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="rounded-2xl border border-border-soft bg-white p-3">
      <div className="flex items-start gap-3">
        {design.image ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border-soft">
            <Image src={design.image} alt="" fill sizes="80px" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange({ image: "" })}
              aria-label="Remove design photo"
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              "flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border-soft text-ink-soft transition-colors hover:border-amber hover:text-amber-dark",
              uploading && "opacity-50",
            )}
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            <span className="text-[10px] font-medium">{uploading ? "Uploading" : "Upload Photo"}</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Input
            aria-label={`Design ${index + 1} name`}
            placeholder={`e.g. Design ${index + 1}`}
            value={design.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove design ${index + 1}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink-soft hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}

      {!design.image && productImages.length > 0 && (
        <div className="mt-2.5">
          <p className="text-xs text-ink-soft">…or use one of the product photos:</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {productImages.map((src, imageIndex) => (
              <button
                key={src}
                type="button"
                onClick={() => onChange({ image: src })}
                aria-label={`Use product photo ${imageIndex + 1}`}
                className="relative h-12 w-12 overflow-hidden rounded-lg border-2 border-transparent opacity-70 transition-colors hover:border-ink/30 hover:opacity-100"
              >
                <Image src={src} alt="" fill sizes="48px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
