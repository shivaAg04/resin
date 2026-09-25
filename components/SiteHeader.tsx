import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-soft/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Spilled Colours" width={158} height={54} className="h-9 w-auto" preload />
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/products" className="text-ink-soft transition-colors hover:text-ink">
            Shop
          </Link>
        </nav>
      </div>
    </header>
  );
}
