import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons/BrandIcons";
import { PolicyPage } from "@/components/legal/PolicyPage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { BUSINESS, getDisplayPhone } from "@/lib/legal";
import { buildGenericWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Have a question about an order, custom piece, bulk gifting, shipping or refund? Contact Spilled Colours on WhatsApp, phone or email.",
};

export default function ContactUsPage() {
  const phone = getDisplayPhone() || "+91 74510 11567";
  const instagramUrl =
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/spilled.colours__";

  const rows = [
    {
      icon: WhatsAppIcon,
      label: "WhatsApp / Phone",
      value: phone,
      href: buildGenericWhatsAppUrl(),
    },
    {
      icon: Mail,
      label: "Email",
      value: BUSINESS.email,
      href: `mailto:${BUSINESS.email}`,
    },
    {
      icon: InstagramIcon,
      label: "Instagram",
      value: "@spilled.colours__",
      href: instagramUrl,
    },
    BUSINESS.address && {
      icon: MapPin,
      label: "Address",
      value: BUSINESS.address,
    },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <PolicyPage
      title="Contact Us"
      intro={
        <>
          Have a question about an order, a custom piece, bulk gifting, shipping or a refund? We&apos;re happy to help.
          <br />
          <span className="mt-1 block font-medium text-ink">We usually respond within 1 business day.</span>
        </>
      }
    >
      <div className="rounded-2xl border border-border-soft/70 bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl font-semibold text-ink">
          {BUSINESS.brandName}
        </h2>
        {BUSINESS.legalName && (
          <p className="mt-0.5 text-xs text-ink-soft">Operated by {BUSINESS.legalName}</p>
        )}

        <dl className="mt-6 space-y-5">
          {rows.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lilac text-amber-dark">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <dt className="text-xs uppercase tracking-wider text-ink-soft">{label}</dt>
                <dd className="mt-0.5 text-sm font-medium text-ink">
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

      <div className="rounded-2xl border border-amber/30 bg-gradient-to-r from-lilac to-amber-light/30 p-6">
        <p className="font-display text-lg font-medium text-ink">Urgent or Custom Enquiry?</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
          For urgent orders or customisation enquiries, WhatsApp us with your requirements and we&apos;ll get back to you as soon as possible.
        </p>
        <ButtonLink
          href={buildGenericWhatsAppUrl("Hi! I have an urgent / custom order enquiry.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-xs uppercase tracking-[0.12em]"
        >
          Message on WhatsApp
        </ButtonLink>
      </div>
    </PolicyPage>
  );
}
