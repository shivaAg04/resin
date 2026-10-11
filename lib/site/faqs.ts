import { POLICY } from "@/lib/legal";

/**
 * FAQ answers. Keep these in line with the policy pages — timings come
 * from POLICY so they stay in sync when those numbers change.
 */
export const FAQS: { question: string; answer: string }[] = [
  {
    question: "Can I send a reference?",
    answer:
      "Yes, please do! A screenshot, a Pinterest image, a sketch, a colour palette or even a rough description — send it on WhatsApp and we'll work from it.",
  },
  {
    question: "Can I customise colours?",
    answer:
      "Yes. Most pieces can be made in your colours — tell us your palette or theme, or send a photo of the colours you like.",
  },
  {
    question: "Can you create something not listed on the website?",
    answer:
      "Absolutely. Many of our pieces are made from customers' own ideas. Share what you have in mind, along with the occasion and budget, and we'll suggest what's possible.",
  },
  {
    question: "How long does a custom order take?",
    answer: `Each piece is handmade, so it usually takes ${POLICY.turnaroundDays} days from order confirmation to dispatch. For an urgent order, please WhatsApp us before ordering so we can check if it's possible.`,
  },
  {
    question: "Do you accept bulk orders?",
    answer:
      "Yes — for weddings, festive gifting, return gifts and corporate orders. Use the Bulk & Corporate page or WhatsApp us with the quantity, occasion and date you need it by.",
  },
  {
    question: "Do you ship across India?",
    answer: `Yes, we ship across India. Delivery usually takes ${POLICY.deliveryDays} business days after dispatch, depending on your location.`,
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship worldwide. Delivery time depends on the destination country and the courier — WhatsApp us your address and we'll confirm the charges and timeline.",
  },
  {
    question: "How much is shipping?",
    answer:
      "Shipping isn't shown at checkout. It depends on the parcel's weight and your location, so we send you the exact charge on WhatsApp after you order. Your order is dispatched once shipping is paid.",
  },
  {
    question: "Can I cancel a custom order?",
    answer:
      "Custom pieces are made specially for you, so orders can't be cancelled once they're in process. If something changes, message us as early as possible.",
  },
  {
    question: "How do I place a custom order?",
    answer:
      "Send us your idea, reference, colours, occasion and budget on WhatsApp (or via the Custom Orders page). We'll share options and a quote, and start making it once you confirm.",
  },
  {
    question: "Will I see my piece before it's shipped?",
    answer:
      "Yes. Before dispatch we send you photos and videos of your finished piece, and we ship it only once you approve.",
  },
  {
    question: "How do I care for my resin piece?",
    answer:
      "Wipe it with a soft, dry or slightly damp cloth. Keep it away from direct sunlight and heat, avoid harsh chemicals and the dishwasher, and handle it gently — resin can chip if dropped.",
  },
];
