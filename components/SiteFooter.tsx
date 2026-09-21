import Link from "next/link";
import { Camera, MessageCircle, Sparkles } from "lucide-react";
import { buildGenericWhatsAppUrl } from "@/lib/whatsapp";

export function SiteFooter() {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "#";
  const whatsappUrl = buildGenericWhatsAppUrl();

  return (
    <footer className="border-t border-border-soft/70 bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 font-display text-lg font-semibold">
              <Sparkles className="h-5 w-5 text-amber" strokeWidth={1.5} />
              Spilled&nbsp;Colours
            </div>
            <p className="mt-2 text-sm text-ink-soft">
              Handmade resin art, cast and finished by hand — one piece at a time.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <span className="font-medium text-ink">Get in touch</span>
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
            <Link href="/admin/login" className="text-xs text-ink-soft/60 transition-colors hover:text-ink-soft">
              Admin login
            </Link>
          </div>
        </div>

        <p className="mt-10 border-t border-border-soft/70 pt-6 text-xs text-ink-soft/70">
          © {new Date().getFullYear()} Spilled Colours. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
