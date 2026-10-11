import { cn } from "@/lib/utils/format";

export type ButtonVariant = "primary" | "secondary" | "outline" | "whatsapp" | "ghost";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-full font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";

// Primary is the deep-purple brand button (cream text passes WCAG AA on
// ink). The pink pastels fail AA with light text, so secondary keeps dark
// ink text on the light pink and only darkens on hover.
const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-cream hover:bg-plum",
  secondary: "bg-rose text-ink hover:bg-amber-dark hover:text-cream",
  outline: "border border-ink/40 text-ink hover:border-ink hover:bg-ink/5",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebc59]",
  ghost: "text-ink hover:bg-ink/5",
};

const sizes: Record<ButtonSize, string> = {
  xs: "h-8 gap-1 whitespace-nowrap px-2.5 text-xs",
  sm: "h-9 gap-2 px-4 text-sm",
  md: "h-11 gap-2 px-6 text-sm",
  lg: "h-13 gap-2 px-8 text-base",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}
