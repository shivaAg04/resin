import { MessageCircle } from "lucide-react";
import { buildGenericWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={buildGenericWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-20 left-4 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/15 transition-transform hover:scale-105 active:scale-95 sm:bottom-5 sm:left-auto sm:right-5 sm:h-14 sm:w-14"
    >
      <MessageCircle className="h-6 w-6" fill="white" strokeWidth={0} />
    </a>
  );
}
