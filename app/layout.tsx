import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Spilled Colours | Handmade Resin Art",
    template: "%s | Spilled Colours",
  },
  description:
    "Handmade resin rodcuts and custom pieces, cast and finished by hand. Shop the collection and order directly — no account needed.",
  openGraph: {
    title: "Spilled Colours | Handmade Resin Art",
    description: "Handmade resin rodcuts and custom pieces, cast and finished by hand.",
    siteName: "Spilled Colours",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-cream font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
