import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Search } from "lucide-react";
import { CartIcon } from "@/components/CartIcon";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { MobileNav } from "@/components/MobileNav";
import { getActiveCategories } from "@/lib/data/products";
import { NAV_LINKS } from "@/lib/site/nav";

const navLinkClasses = "text-[13px] tracking-wide text-ink transition-colors hover:text-amber-dark";

export async function SiteHeader() {
  const categories = await getActiveCategories();

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 border-b border-border-soft/70 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px]">
          <div className="flex items-center gap-1 lg:w-44">
            <MobileNav categories={categories} />
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Spilled Colours"
                width={158}
                height={54}
                className="h-8 w-auto lg:h-10"
                preload
              />
            </Link>
          </div>

          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {/* Pure-CSS dropdown: opens on hover and on keyboard focus. */}
            <div className="group relative">
              <Link href="/products" className={`${navLinkClasses} flex items-center gap-1`}>
                Shop <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
              </Link>
              <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-4 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                <div className="flex flex-col rounded-2xl border border-border-soft bg-cream p-2 shadow-xl shadow-ink/5">
                  <Link href="/products" className="rounded-xl px-4 py-2.5 text-sm text-ink hover:bg-lilac">
                    All Products
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      className="rounded-xl px-4 py-2.5 text-sm text-ink-soft hover:bg-lilac hover:text-ink"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClasses}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-4 lg:w-44">
            <Link href="/products" aria-label="Search products" className="text-ink transition-colors hover:text-amber-dark">
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </Link>
            <CartIcon />
          </div>
        </div>
      </header>
    </>
  );
}
