"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/format";

const PLACEHOLDER = "/placeholder-product.svg";

/** Fired by the design picker so the gallery shows the chosen design's photo. */
export const SHOW_GALLERY_IMAGE_EVENT = "product-gallery:show";

export function showGalleryImage(src: string) {
  window.dispatchEvent(new CustomEvent(SHOW_GALLERY_IMAGE_EVENT, { detail: src }));
}

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const gallery = images.length > 0 ? images : [PLACEHOLDER];
  const [active, setActive] = useState(0);
  const hasMultiple = gallery.length > 1;

  useEffect(() => {
    function handleShow(event: Event) {
      // `gallery` only differs from `images` when it's the placeholder, which never matches.
      const index = images.indexOf((event as CustomEvent<string>).detail);
      if (index >= 0) setActive(index);
    }
    window.addEventListener(SHOW_GALLERY_IMAGE_EVENT, handleShow);
    return () => window.removeEventListener(SHOW_GALLERY_IMAGE_EVENT, handleShow);
  }, [images]);

  function goTo(index: number) {
    setActive((index + gallery.length) % gallery.length);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!hasMultiple) return;
    if (event.key === "ArrowLeft") goTo(active - 1);
    if (event.key === "ArrowRight") goTo(active + 1);
  }

  return (
    <div className={cn("flex gap-3", hasMultiple && "flex-row-reverse")}>
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={`${alt} photos`}
        tabIndex={hasMultiple ? 0 : -1}
        onKeyDown={handleKeyDown}
        className="relative aspect-square min-w-0 flex-1 overflow-hidden rounded-lg bg-amber-light/40 outline-none focus-visible:ring-2 focus-visible:ring-amber"
      >
        <Image
          key={active}
          src={gallery[active]}
          alt={alt}
          fill
          preload
          sizes="(min-width: 1024px) 500px, 100vw"
          className="object-cover"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white">
              {active + 1} / {gallery.length}
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        // Absolutely-filled so the thumbnail column scrolls within the main
        // photo's height instead of stretching the gallery taller.
        <div className="relative w-14 shrink-0 sm:w-16">
          <div className="absolute inset-0 flex flex-col gap-2 overflow-y-auto">
            {gallery.map((src, index) => (
              <button
                key={src + index}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`View photo ${index + 1}`}
                aria-current={active === index}
                className={cn(
                  "relative aspect-square w-full shrink-0 overflow-hidden rounded-md border-2 transition-colors",
                  active === index ? "border-ink" : "border-transparent hover:border-ink/30",
                )}
              >
                <Image src={src} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
