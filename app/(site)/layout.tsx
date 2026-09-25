import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="cursor-resin flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFloatingButton />
      <ScrollToTopButton />
    </div>
  );
}
