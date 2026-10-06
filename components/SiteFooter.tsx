import Link from "next/link";
import Image from "next/image";
import { Camera, Globe, Mail, MessageCircle, Users } from "lucide-react";
import { buildGenericWhatsAppUrl } from "@/lib/whatsapp";
import { getActiveCategories } from "@/lib/data/products";
import { BUSINESS, POLICY_LINKS } from "@/lib/legal";

export async function SiteFooter() {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "#";
  const whatsappUrl = buildGenericWhatsAppUrl();
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL;
  const communityUrl = process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL;
  const contactEmail = BUSINESS.email;
  const categories = await getActiveCategories();

  return (
    <footer className="border-t border-border-soft/70 bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.3fr_1fr_1fr]">
          <div className="max-w-xs">
            <Image src="/logo.png" alt="Spilled Colours" width={158} height={54} className="h-9 w-auto" />
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Handmade resin art, cast and finished by hand — one piece at a time.
            </p>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
            >
              <Camera className="h-4 w-4" /> @spilled.colours__
            </a>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <span className="font-display text-base font-semibold text-ink">Shop</span>
            <Link href="/products" className="text-ink-soft transition-colors hover:text-ink">
              All Products
            </Link>
            <Link href="/bulk-orders" className="text-ink-soft transition-colors hover:text-ink">
              Bulk Orders
            </Link>
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="text-ink-soft transition-colors hover:text-ink"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <span className="font-display text-base font-semibold text-ink">Get in Touch</span>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-ink-soft transition-colors hover:text-ink"
            >
              <Camera className="h-4 w-4" /> Follow on Instagram
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-ink-soft transition-colors hover:text-ink"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
            {communityUrl && (
              <a
                href={communityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-ink-soft transition-colors hover:text-ink"
              >
                <Users className="h-4 w-4" /> Join our WhatsApp Community
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-ink-soft transition-colors hover:text-ink"
              >
                <Globe className="h-4 w-4" /> Follow on Facebook
              </a>
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-2 text-ink-soft transition-colors hover:text-ink"
              >
                <Mail className="h-4 w-4" /> {contactEmail}
              </a>
            )}
          </div>
        </div>

        <nav
          aria-label="Policies"
          className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-border-soft/70 pt-6 text-xs"
        >
          {POLICY_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-ink-soft transition-colors hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-4 flex flex-col gap-2 border-border-soft/70 pt-6 text-xs text-ink-soft/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Spilled Colours. All rights reserved.</p>
          <p>Handmade with love, shipped worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
