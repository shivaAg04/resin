import { getBusinessWhatsAppNumber } from "@/lib/whatsapp";

/**
 * Business details shown on the policy and contact pages. Razorpay checks
 * these pages during account activation, so the legal name and address
 * must match what you submitted in your Razorpay KYC. Edit the values here
 * (or set the env vars) — the policy text reads everything from this one
 * place, so the numbers stay consistent across pages.
 */
export const BUSINESS = {
  brandName: "Spilled Colours",
  /** Name of the proprietor/company exactly as registered with Razorpay. */
  legalName: process.env.NEXT_PUBLIC_BUSINESS_LEGAL_NAME ?? "",
  /** Full postal address, one line. */
  address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ?? "",
  email: "spilled.colours.sc@gmail.com",
  jurisdictionCity: process.env.NEXT_PUBLIC_BUSINESS_CITY ?? "",
  lastUpdated: "6 October 2026",
  supportHours: "Monday to Saturday, 12 PM to 7 PM IST",
} as const;

export const POLICY = {
  /** Days to make and dispatch an order. */
  turnaroundDays: "15–20",
  /** Business days for the courier to deliver within India after dispatch. */
  deliveryDays: "4–8",
  /** Hours after delivery within which damage must be reported. */
  damageReportHours: 48,
  /** Business days for a refund to reach the customer after approval. */
  refundDays: "5–7",
} as const;

/** "+91 98765 43210" from the env WhatsApp number, or "" if unset. */
export function getDisplayPhone(): string {
  const digits = getBusinessWhatsAppNumber();
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return digits ? `+${digits}` : "";
}

export const POLICY_LINKS = [
  { href: "/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/refund-policy", label: "Refund & Cancellation" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/contact-us", label: "Contact Us" },
] as const;
