import type { Metadata } from "next";
import { Camera, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PolicyPage } from "@/components/legal/PolicyPage";
import { BUSINESS, getDisplayPhone } from "@/lib/legal";
import { buildGenericWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactUsPage() {
  const phone = getDisplayPhone();
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

  const rows = [
    phone && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: phone,
      href: buildGenericWhatsAppUrl(),
    },
    phone && { icon: Phone, label: "Phone", value: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    BUSINESS.email && { icon: Mail, label: "Email", value: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
    instagramUrl && { icon: Camera, label: "Instagram", value: "@spilled.colours__", href: instagramUrl },
    BUSINESS.address && { icon: MapPin, label: "Address", value: BUSINESS.address },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <PolicyPage
      title="Contact Us"
      intro="Questions about an order, a custom piece, or a refund? Reach out and we usually reply within a day."
    >
      <div className="rounded-2xl border border-border-soft/70 bg-white p-5 sm:p-6">
        <p className="font-display text-base font-semibold text-ink">
          {BUSINESS.legalName || BUSINESS.brandName}
        </p>
        {BUSINESS.legalName && <p className="text-xs text-ink-soft">Trading as {BUSINESS.brandName}</p>}

        <dl className="mt-4 space-y-4">
          {rows.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-amber-dark" />
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-soft/80">{label}</dt>
                <dd className="text-ink">
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="!text-ink !no-underline hover:!underline"
                    >
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <p className="text-sm">Support hours: Monday to Saturday, 10 AM to 7 PM IST.</p>
    </PolicyPage>
  );
}
