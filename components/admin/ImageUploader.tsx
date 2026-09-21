"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/format";

export function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (uploadError) {
        setError("Some images failed to upload. Please try again.");
        continue;
      }

      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    onChange([...images, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage(url: string) {
    onChange(images.filter((image) => image !== url));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((url) => (
          <div key={url} className="relative h-24 w-24 overflow-hidden rounded-xl border border-border-soft/70">
            <Image src={url} alt="" fill sizes="96px" className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border-soft text-ink-soft transition-colors hover:border-amber hover:text-amber-dark",
            uploading && "opacity-50",
          )}
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          <span className="text-xs">{uploading ? "Uploading..." : "Add photo"}</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
