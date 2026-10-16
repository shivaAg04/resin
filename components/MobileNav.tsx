"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/site/nav";
import type { Category } from "@/types";

const emptySubscribe = () => () => {};

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const pathname = usePathname();

  // Close the drawer after navigating.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="animate-fade-in absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
            />
            <nav className="animate-slide-in-left absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col overflow-y-auto bg-cream px-6 pb-10 pt-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center">
                  <Image
                    src="/logo.png"
                    alt="Spilled Colours"
                    width={130}
                    height={44}
                    className="h-7 w-auto"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-ink/5 active:scale-95 transition-transform"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
                Shop
              </p>
              <div className="mt-3 flex flex-col gap-3">
                <Link
                  href="/products"
                  onClick={() => setOpen(false)}
                  className="font-display text-xl text-ink transition-colors hover:text-amber-dark"
                >
                  All Products
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    onClick={() => setOpen(false)}
                    className="font-display text-xl text-ink transition-colors hover:text-amber-dark"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <div className="my-6 h-px bg-border-soft" />

              <div className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-xl text-ink transition-colors hover:text-amber-dark"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>,
          document.body
        )}
    </>
  );
}
