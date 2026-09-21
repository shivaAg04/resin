import { MessageCircle } from "lucide-react";
import { buildGenericWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={buildGenericWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/15 transition-transform hover:scale-105 active:scale-95"
    >
      <MessageCircle className="h-6 w-6" fill="white" strokeWidth={0} />
    </a>
  );
}
