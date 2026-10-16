import type { Metadata } from "next";
import { Allura, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

// Display serif for headings, a clean geometric sans for body copy, and a
// script face for the handwritten accents ("Send us your reference").
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Spilled Colours | Handmade Resin Art",
    template: "%s | Spilled Colours",
  },
  description:
    "Handmade resin products and custom pieces, cast and finished by hand. Shop the collection and order directly — no account needed.",
  openGraph: {
    title: "Spilled Colours | Handmade Resin Art",
    description: "Handmade resin products and custom pieces, cast and finished by hand.",
    siteName: "Spilled Colours",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${allura.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-cream font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
