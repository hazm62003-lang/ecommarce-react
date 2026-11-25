"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { Product, Review } from "@/types";
import { RatingStars } from "./rating-stars";
import { Skeleton } from "@/components/ui/skeleton";

const tabs = ["details", "reviews", "shipping"] as const;
type Tab = (typeof tabs)[number];

function Reviews({ productId }: { productId: string }) {
  let q = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => (await api.get<{ data: Review[] }>(`/v1/products/${productId}/reviews`)).data.data,
  });
  if (q.isLoading) return <Skeleton className="h-24" />;
  if (q.isError) return <p className="text-sm text-destructive">Could not load reviews.</p>;
  if (!q.data?.length) return <p className="text-sm text-ink-500">No reviews yet.</p>;
  return (
    <ul className="space-y-4">
      {q.data.map((r) => (
        <li key={r._id} className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-ink-900">{r.user?.name}</p>
            <RatingStars value={r.rating} />
          </div>
          <p className="mt-2 text-sm text-ink-600">{r.review}</p>
        </li>
      ))}
    </ul>
  );
}

export function ProductTabs({ product }: { product: Product }) {
  let [tab, setTab] = useState<Tab>("details");
  let label: Record<Tab, string> = { details: "Product Details", reviews: `Reviews (${product.ratingsQuantity})`, shipping: "Shipping & Returns" };

  return (
    <section className="rounded-xl border bg-white">
      <div role="tablist" className="flex overflow-x-auto border-b">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn("whitespace-nowrap px-6 py-4 text-sm font-semibold", tab === t ? "border-b-2 border-primary text-primary" : "text-ink-500 hover:text-ink-900")}
          >
            {label[t]}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="p-6">
        {tab === "details" && (
          <div className="space-y-6">
            <div><h3 className="mb-2 font-semibold text-ink-900">About this Product</h3><p className="text-sm leading-6 text-ink-600">{product.description}</p></div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="flex justify-between rounded-lg bg-muted/50 px-4 py-3"><dt className="text-ink-500">Category</dt><dd className="font-medium">{product.category?.name}</dd></div>
              <div className="flex justify-between rounded-lg bg-muted/50 px-4 py-3"><dt className="text-ink-500">Subcategory</dt><dd className="font-medium">{product.subcategory?.[0]?.name ?? "-"}</dd></div>
              <div className="flex justify-between rounded-lg bg-muted/50 px-4 py-3"><dt className="text-ink-500">Brand</dt><dd className="font-medium">{product.brand?.name ?? "-"}</dd></div>
              <div className="flex justify-between rounded-lg bg-muted/50 px-4 py-3"><dt className="text-ink-500">Items Sold</dt><dd className="font-medium">{product.sold}</dd></div>
            </dl>
          </div>
        )}
        {tab === "reviews" && <Reviews productId={product._id} />}
        {tab === "shipping" && <p className="text-sm leading-6 text-ink-600">Free shipping on orders over 500 EGP. You can return most items within 14 days of delivery for a full refund.</p>}
      </div>
    </section>
  );
}
