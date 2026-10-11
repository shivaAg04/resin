import { Fingerprint, HeartHandshake, MessagesSquare, Users } from "lucide-react";

const REASONS = [
  { icon: HeartHandshake, title: "Made around your idea", desc: "Don't see exactly what you want? Send us your reference." },
  { icon: Fingerprint, title: "No two orders are the same", desc: "Colours, sizes, names, details — make it yours." },
  { icon: Users, title: "From one piece to bulk orders", desc: "Individual gifts, weddings, festive gifting and corporate orders." },
  { icon: MessagesSquare, title: "You don't need to know exactly what you want", desc: "Tell us the occasion + budget. We'll help you figure out the rest." },
];

export function WhyChooseUs() {
  return (
    <section className="bg-lilac">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_repeat(4,1fr)] lg:gap-0">
        <h2 className="font-display text-2xl font-medium uppercase leading-tight text-ink lg:pr-6">
          Why people choose
          <br />
          Spilled Colours
        </h2>
        {REASONS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex gap-4 lg:flex-col lg:gap-0 lg:border-l lg:border-ink/10 lg:px-6">
            <Icon className="h-6 w-6 shrink-0 text-amber-dark" strokeWidth={1.3} />
            <div>
              <h3 className="text-sm font-medium text-ink lg:mt-4">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
