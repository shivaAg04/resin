import { Fingerprint, HeartHandshake, Lightbulb, Users } from "lucide-react";

const REASONS = [
  {
    icon: Lightbulb,
    title: "Ideas, not templates.",
    desc: "Because your product doesn't have to look like everyone else's.",
  },
  {
    icon: Fingerprint,
    title: "Personal, down to the details.",
    desc: "Colours, names, designs and little things that make it yours.",
  },
  {
    icon: Users,
    title: "Made for your moment.",
    desc: "From one meaningful piece to hundreds for your celebration.",
  },
  {
    icon: HeartHandshake,
    title: "You bring the thought.",
    desc: "We bring the creativity, craftsmanship and resin.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-lilac">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_repeat(4,1fr)] lg:gap-0">
        <div className="lg:pr-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">Why people choose us</p>
          <h2 className="mt-2 font-display text-2xl font-medium uppercase leading-tight text-ink">
            What makes it
            <br />
            Spilled Colours?
          </h2>
        </div>
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
