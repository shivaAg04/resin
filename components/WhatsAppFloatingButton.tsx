import { buildGenericWhatsAppUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons/BrandIcons";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={buildGenericWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-20 left-4 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/15 transition-transform hover:scale-105 active:scale-95 sm:bottom-5 sm:left-auto sm:right-5 sm:h-14 sm:w-14"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
