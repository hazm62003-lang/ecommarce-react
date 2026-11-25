import { HeroSlider } from "@/components/home/hero-slider";
import { CategoryGrid } from "@/components/home/category-grid";
import { PromoBanners } from "@/components/home/promo-banners";
import { SectionHeading } from "@/components/home/section-heading";
import { ProductGrid } from "@/components/product/product-grid";
import { getCategories, getProducts } from "@/lib/api/server";

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts({ limit: 20 })]);

  return (
    <>
      <HeroSlider />
      <div className="container space-y-16 py-12">
        <section>
          <SectionHeading title="Shop By Category" href="/categories" linkLabel="View All Categories" />
          <CategoryGrid categories={categories.data.slice(0, 12)} />
        </section>
        <PromoBanners />
        <section>
          <SectionHeading title="Featured Products" href="/products" />
          <ProductGrid products={products.data} />
        </section>
      </div>
    </>
  );
}
