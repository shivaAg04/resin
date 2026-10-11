import { HomeHero } from "@/components/home/HomeHero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { CustomOrderSection } from "@/components/home/CustomOrderSection";
import { NewArrivals } from "@/components/home/NewArrivals";
import { Bestsellers } from "@/components/home/Bestsellers";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { HomeTestimonials } from "@/components/home/HomeTestimonials";
import { CtaBand } from "@/components/home/CtaBand";
import { HorizontalProductRow } from "@/components/products/HorizontalProductRow";
import { ReelsRow } from "@/components/ReelsRow";
import {
  getActiveCategories,
  getBestsellers,
  getNewArrivals,
  getProductsByCategoryForHome,
} from "@/lib/data/products";
import { getHomeCategories } from "@/lib/data/categories";
import { getActiveReels } from "@/lib/data/reels";
import { getActiveTestimonials } from "@/lib/data/testimonials";

const NEW_ARRIVALS_COUNT = 5;

export default async function HomePage() {
  const [homeCategories, categories, recentProducts, bestsellers, reels, testimonials] = await Promise.all([
    getHomeCategories(),
    getActiveCategories(),
    getNewArrivals(12),
    getBestsellers(),
    getActiveReels(),
    getActiveTestimonials(),
  ]);

  // Per-category rows, switched on from /admin/categories ("Show on Home").
  const categoryRows = await Promise.all(
    homeCategories.map(async (category) => ({
      category,
      products: await getProductsByCategoryForHome(category.slug),
    })),
  );

  // Product photos for the hero and reference collages — one per product so
  // the same piece doesn't repeat.
  const photos = recentProducts.map((p) => p.images?.[0]).filter((src): src is string => Boolean(src));

  return (
    <div>
      <HomeHero images={photos.slice(0, 3)} />
      <CategoryGrid categories={categories} />
      <CustomOrderSection images={photos.slice(3, 6).length === 3 ? photos.slice(3, 6) : photos.slice(0, 3)} />
      <NewArrivals products={recentProducts.slice(0, NEW_ARRIVALS_COUNT)} storyImage={photos[photos.length - 1]} />
      <Bestsellers products={bestsellers} />

      {categoryRows.map(({ category, products }) => (
        <HorizontalProductRow key={category.id} category={category} products={products} />
      ))}

      <WhyChooseUs />
      <ReelsRow reels={reels} />
      <HomeTestimonials testimonials={testimonials} />
      <CtaBand />
    </div>
  );
}
