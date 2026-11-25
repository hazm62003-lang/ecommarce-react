import type { Metadata } from "next";
import { Suspense } from "react";
import { FilterSidebar } from "@/components/product/filter-sidebar";
import { Pagination } from "@/components/product/pagination";
import { ProductGrid } from "@/components/product/product-grid";
import { SortSelect } from "@/components/product/sort-select";
import { getBrands, getCategories, getProducts } from "@/lib/api/server";

export const metadata: Metadata = { title: "All Products" };

type SP = { [k: string]: string | undefined };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const page = Number(sp.page ?? 1) || 1;

  const [products, categories, brands] = await Promise.all([
    getProducts({
      limit: 40,
      page,
      keyword: sp.keyword,
      "category[in]": sp.category,
      brand: sp.brand,
      sort: sp.sort,
      "price[gte]": sp.minPrice,
      "price[lte]": sp.maxPrice,
    }),
    getCategories(),
    getBrands({ limit: 100 }),
  ]);

  const title = sp.keyword ? `Search results for "${sp.keyword}"` : "All Products";

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-ink-900">{title}</h1>
      <p className="mt-1 text-ink-500">Showing {products.data.length} products</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <Suspense fallback={null}>
          <FilterSidebar categories={categories.data} brands={brands.data} />
        </Suspense>
        <div>
          <div className="mb-4 flex justify-end"><Suspense fallback={null}><SortSelect /></Suspense></div>
          <ProductGrid products={products.data} />
          <Pagination current={products.metadata.currentPage} total={products.metadata.numberOfPages} params={sp} />
        </div>
      </div>
    </div>
  );
}
