"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Receipt, Sparkles, Tags } from "lucide-react";
import { cn } from "@/lib/utils/format";
import { LogoutButton } from "@/components/admin/LogoutButton";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col justify-between border-r border-border-soft/70 bg-white p-4 sm:w-56">
      <div>
        <div className="flex items-center gap-2 px-2 py-2 font-display text-lg font-semibold">
          <Sparkles className="h-5 w-5 text-amber" strokeWidth={1.5} />
          Admin
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
