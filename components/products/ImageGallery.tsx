"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/format";

const PLACEHOLDER = "/placeholder-product.svg";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const gallery = images.length > 0 ? images : [PLACEHOLDER];
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-amber-light/40">
        <Image
          src={gallery[active]}
          alt={alt}
          fill
          preload
          sizes="(min-width: 1024px) 500px, 100vw"
          className="object-cover"
        />
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {gallery.map((src, index) => (
            <button
              key={src + index}
              type="button"
              onClick={() => setActive(index)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                active === index ? "border-amber" : "border-transparent",
              )}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
