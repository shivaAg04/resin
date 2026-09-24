import { cn } from "@/lib/utils/format";

export type ButtonVariant = "primary" | "secondary" | "outline" | "whatsapp" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber";

// These pastels fail WCAG AA with white/cream text (best case ~2:1), so
// buttons pair a light pink background with dark ink text instead — and
// darken to amber-dark (with cream text) on hover, which does have enough
// contrast for light text.
const variants: Record<ButtonVariant, string> = {
  primary: "bg-amber text-ink hover:bg-amber-dark hover:text-cream",
  secondary: "bg-rose text-ink hover:bg-amber-dark hover:text-cream",
  outline: "border border-ink/20 text-ink hover:border-ink/40 hover:bg-ink/5",
  whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebc59]",
  ghost: "text-ink hover:bg-ink/5",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}
