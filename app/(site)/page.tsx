import {
  ArrowRight,
  Camera,
  Droplets,
  Gem,
  MessageCircle,
  PenTool,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { HeroVideo } from "@/components/HeroVideo";
import { ProductCard } from "@/components/products/ProductCard";
import { HorizontalProductRow } from "@/components/products/HorizontalProductRow";
import { ReviewsCarousel } from "@/components/products/ReviewsCarousel";
import { ReelsRow } from "@/components/ReelsRow";
import { getFeaturedProducts, getProductsByCategoryForHome } from "@/lib/data/products";
import { getHomeCategories } from "@/lib/data/categories";
import { getActiveReels } from "@/lib/data/reels";
import { getActiveTestimonials } from "@/lib/data/testimonials";
import { buildGenericWhatsAppUrl } from "@/lib/whatsapp";

export default async function HomePage() {
  const homeCategories = await getHomeCategories();
  const categoryRows = await Promise.all(
    homeCategories.map(async (category) => ({
      category,
      products: await getProductsByCategoryForHome(category.slug),
    })),
  );

  // No homepage categories configured yet (fresh install) — fall back to a
  // simple "recently added" section so the homepage is never empty.
  const featuredProducts = homeCategories.length === 0 ? await getFeaturedProducts(4) : [];
  const reels = await getActiveReels();
  const testimonials = await getActiveTestimonials();
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "#";
  const whatsappUrl = buildGenericWhatsAppUrl();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border-soft/70">
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-amber/20 via-blush/15 to-cream" />
        <div className="absolute inset-0 -z-10">
          <HeroVideo src="/video/hero-pour.mp4" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/70 to-cream" />
        </div>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-14 text-center sm:gap-6 sm:px-6 sm:py-28">
          <span className="animate-fade-in-up inline-flex items-center gap-1.5 rounded-full border border-amber/30 bg-white/70 px-4 py-1.5 text-xs font-medium tracking-wide text-amber-dark">
            <Sparkles className="h-3.5 w-3.5" /> Handmade in small batches
          </span>
          <h1
            className="animate-fade-in-up max-w-2xl text-balance font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            Where every spill of colour becomes art
          </h1>
          <p
            className="animate-fade-in-up max-w-md text-balance text-base text-ink-soft sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            Hand-poured resin pieces in bold, painterly colour — the same ones you&apos;ve seen on
            our Reels, now just a tap away.
          </p>
          <div
            className="animate-fade-in-up flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "240ms" }}
          >
            <ButtonLink href="/products" size="lg">
              Shop Now <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg">
              <MessageCircle className="h-4 w-4" /> Order on WhatsApp
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Homepage category rows — configured from /admin/categories */}
      {categoryRows.map(({ category, products }) => (
        <HorizontalProductRow key={category.id} category={category} products={products} />
      ))}

      {/* Fallback when no homepage categories are configured yet */}
      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                Featured Pieces
              </h2>
              <p className="mt-1 text-sm text-ink-soft">Fresh from the studio, ready to ship.</p>
            </div>
            <ButtonLink href="/products" variant="ghost" size="sm" className="hidden sm:inline-flex">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </ButtonLink>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <ButtonLink href="/products" variant="outline" className="mt-8 w-full sm:hidden">
            View all products
          </ButtonLink>
        </section>
      )}

      {/* Meet the Maker */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-peach/60 via-amber-light to-amber/50 text-amber-dark">
            <Droplets className="h-10 w-10" strokeWidth={1.5} />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              The Hands Behind Spilled Colours
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-soft">
              Every piece here starts as a swirl of colour and a few quiet hours of pouring, sanding,
              and polishing. What began as a small hobby slowly turned into making resin art for
              friends, then for Instagram — and now, for you. Each order is still mixed, poured, and
              packed by hand, one piece at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-y border-border-soft/70 bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-center font-display text-2xl font-semibold text-ink sm:text-3xl">
            Why Choose Us
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: PenTool, title: "Handmade", desc: "Every piece is cast, sanded and polished by hand." },
              { icon: Gem, title: "Premium Quality", desc: "Food-safe, UV-resistant resin that lasts for years." },
              { icon: Sparkles, title: "Custom Designs", desc: "Personalize colors, names and finishes on request." },
              { icon: ShieldCheck, title: "Easy Ordering", desc: "No sign-up — order directly and confirm on WhatsApp." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-light/60 text-amber-dark">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 font-display text-lg font-medium text-ink">{title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reels — added/reordered from /admin/reels */}
      <ReelsRow reels={reels} />

      {/* Testimonials — added from /admin/testimonials */}
      {testimonials.length > 0 && (
        <section className="border-t border-border-soft/70 bg-white/60">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
            <ReviewsCarousel title="What Our Customers Say" reviews={testimonials} />
          </div>
        </section>
      )}

      {/* Instagram */}
      <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
        <Camera className="mx-auto h-8 w-8 text-amber-dark" strokeWidth={1.5} />
        <h2 className="mt-4 font-display text-2xl font-semibold text-ink sm:text-3xl">
          Follow us on Instagram
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          See new pieces first, behind-the-scenes process reels, and customer favorites.
        </p>
        <ButtonLink
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          className="mt-6"
        >
          <Camera className="h-4 w-4" /> @spilled.colours__
        </ButtonLink>
      </section>

      {/* WhatsApp CTA */}
      <section className="border-t border-border-soft/70 bg-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-14 text-center sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-cream sm:text-3xl">
            Have a question?
          </h2>
          <p className="max-w-sm text-sm text-cream/70">
            Chat with us directly on WhatsApp for custom orders, bulk pricing, or anything else.
          </p>
          <ButtonLink href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg">
            <MessageCircle className="h-4 w-4" /> Chat with us on WhatsApp
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
