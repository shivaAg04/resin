import Link from "next/link";
import Image from "next/image";
import { Camera, Globe, Mail, MapPin, MessageCircle, Users } from "lucide-react";
import { buildGenericWhatsAppUrl } from "@/lib/whatsapp";
import { getActiveCategories } from "@/lib/data/products";
import { BUSINESS } from "@/lib/legal";

const headingClasses = "text-[11px] font-medium uppercase tracking-[0.2em] text-ink";
const linkClasses = "text-ink-soft transition-colors hover:text-ink";

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-2.5 text-sm">
      <span className={headingClasses}>{title}</span>
      {links.map((link) => (
        <Link key={link.href + link.label} href={link.href} className={linkClasses}>
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export async function SiteFooter() {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "#";
  const whatsappUrl = buildGenericWhatsAppUrl();
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL;
  const communityUrl = process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL;
  const contactEmail = BUSINESS.email;
  const categories = await getActiveCategories();

  const socialIconClasses =
    "flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:border-ink/40 hover:text-ink";

  return (
    <footer className="border-t border-border-soft/70 bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-[1.3fr_0.9fr_1fr_1fr_1fr_1.6fr]">
          <div className="col-span-2 max-w-xs sm:col-span-3 lg:col-span-1">
            <Image src="/logo.png" alt="Spilled Colours" width={158} height={54} className="h-10 w-auto" />
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              Handmade resin art, personalised pieces &amp; custom creations — made around your idea.
            </p>
            <div className="mt-5 flex gap-2">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={socialIconClasses}>
                <Camera className="h-4 w-4" />
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={socialIconClasses}>
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href={`mailto:${contactEmail}`} aria-label="Email" className={socialIconClasses}>
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <FooterColumn
            title="Shop"
            links={[
              { href: "/products", label: "All Products" },
              ...categories.slice(0, 6).map((c) => ({ href: `/products?category=${c.slug}`, label: c.name })),
            ]}
          />
          <FooterColumn
            title="Custom"
            links={[
              { href: "/custom-orders", label: "Custom Orders" },
              { href: "/bulk-orders", label: "Bulk & Corporate" },
            ]}
          />
          <FooterColumn
            title="Help"
            links={[
              { href: "/faq", label: "FAQs" },
              { href: "/reviews", label: "Reviews" },
              { href: "/shipping-policy", label: "Shipping" },
              { href: "/refund-policy", label: "Returns & Cancellation" },
              { href: "/contact-us", label: "Contact Us" },
            ]}
          />
          <FooterColumn
            title="Policy"
            links={[
              { href: "/terms-and-conditions", label: "Terms & Conditions" },
              { href: "/privacy-policy", label: "Privacy Policy" },
              { href: "/refund-policy", label: "Refund & Cancellation" },
              { href: "/shipping-policy", label: "Shipping Policy" },
            ]}
          />

          <div className="col-span-2 flex flex-col gap-2.5 text-sm sm:col-span-1">
            <span className={headingClasses}>Get in Touch</span>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 ${linkClasses}`}>
              <Camera className="h-4 w-4 shrink-0" /> @spilled.colours__
            </a>
            <a href={`mailto:${contactEmail}`} className={`flex items-center gap-2 break-all ${linkClasses}`}>
              <Mail className="h-4 w-4 shrink-0" /> {contactEmail}
            </a>
            {communityUrl && (
              <a href={communityUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 ${linkClasses}`}>
                <Users className="h-4 w-4 shrink-0" /> WhatsApp Community
              </a>
            )}
            {facebookUrl && (
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 ${linkClasses}`}>
                <Globe className="h-4 w-4 shrink-0" /> Facebook
              </a>
            )}
            <span className="flex items-center gap-2 text-ink-soft">
              <MapPin className="h-4 w-4 shrink-0" /> India · Worldwide shipping
            </span>
          </div>
        </div>

        <div className="mt-12 border-t border-border-soft/70 pt-6 text-xs text-ink-soft/80">
          <p>© {new Date().getFullYear()} Spilled Colours. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
