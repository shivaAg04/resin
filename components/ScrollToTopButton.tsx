"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils/format";

const SHOW_AFTER_PX = 400;

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    function handleScroll() {
      const y = window.scrollY;
      const scrollingUp = y < lastY.current;

      if (y <= SHOW_AFTER_PX) {
        setVisible(false);
      } else if (scrollingUp) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      lastY.current = y;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleClick() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Scroll back to top"
      className={cn(
        "fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-cream shadow-lg shadow-black/15 transition-all duration-300 hover:bg-amber-dark sm:bottom-24 sm:right-5 sm:h-13 sm:w-13",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
