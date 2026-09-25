"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Clapperboard, LayoutDashboard, MessageSquareQuote, Package, Receipt, Tags } from "lucide-react";
import { cn } from "@/lib/utils/format";
import { LogoutButton } from "@/components/admin/LogoutButton";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/reels", label: "Reels", icon: Clapperboard },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col justify-between border-r border-border-soft/70 bg-white p-4 sm:w-56">
      <div>
        <div className="flex items-center gap-2 px-2 py-2">
          <Image src="/logo.png" alt="Spilled Colours" width={158} height={54} className="h-7 w-auto" />
          <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">Admin</span>
        </div>
        <nav className="mt-4 flex gap-1 sm:flex-col">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-ink text-cream" : "text-ink-soft hover:bg-ink/5 hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4" /> {label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="hidden sm:block">
        <LogoutButton />
      </div>
    </aside>
  );
}
