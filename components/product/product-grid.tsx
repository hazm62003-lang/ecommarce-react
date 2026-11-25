import type { Product } from "@/types";
import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="rounded-xl border border-dashed py-16 text-center">
        <p className="font-semibold text-ink-900">No products found</p>
        <p className="mt-1 text-sm text-ink-500">Try a different search or clear your filters.</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
      {products.map((p) => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}
