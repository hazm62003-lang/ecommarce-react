"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Brand, Category } from "@/types";

export function FilterSidebar({ categories, brands }: { categories: Category[]; brands: Brand[] }) {
  let router = useRouter();
  let sp = useSearchParams();
  let [open, setOpen] = useState(false);

  function setParam(key: string, value?: string) {
    let next = new URLSearchParams(sp.toString());
    if (value) next.set(key, value); else next.delete(key);
    next.delete("page");
    router.push(`/products?${next}`);
  }

  function onPrice(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let f = new FormData(e.currentTarget);
    let next = new URLSearchParams(sp.toString());
    (["minPrice", "maxPrice"] as const).forEach((k) => {
      let v = String(f.get(k) ?? "");
      if (v) next.set(k, v); else next.delete(k);
    });
    next.delete("page");
    router.push(`/products?${next}`);
  }

  let cat = sp.get("category");
  let brand = sp.get("brand");

  return (
    <aside className="space-y-4">
      <Button variant="outline" className="w-full lg:hidden" onClick={() => setOpen((v) => !v)}>
        <SlidersHorizontal className="h-4 w-4" />Filters
      </Button>
      <div className={`${open ? "block" : "hidden"} space-y-6 rounded-xl border bg-white p-5 lg:block`}>
        <div>
          <h3 className="mb-3 font-semibold text-ink-900">Categories</h3>
          <ul className="space-y-1 text-sm">
            {categories.map((c) => (
              <li key={c._id}>
                <button onClick={() => setParam("category", cat === c._id ? undefined : c._id)} className={`w-full rounded-md px-2 py-1.5 text-left hover:bg-muted ${cat === c._id ? "bg-primary-50 font-semibold text-primary" : "text-ink-600"}`}>{c.name}</button>
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={onPrice} className="space-y-3">
          <h3 className="font-semibold text-ink-900">Price Range</h3>
          <div className="flex gap-2">
            <Input name="minPrice" type="number" min={0} placeholder="Min (EGP)" defaultValue={sp.get("minPrice") ?? ""} />
            <Input name="maxPrice" type="number" min={0} placeholder="Max" defaultValue={sp.get("maxPrice") ?? ""} />
          </div>
          <Button type="submit" size="sm" variant="outline" className="w-full">Apply</Button>
        </form>
        <div>
          <h3 className="mb-3 font-semibold text-ink-900">Brands</h3>
          <ul className="max-h-64 space-y-1 overflow-y-auto text-sm">
            {brands.map((b) => (
              <li key={b._id}>
                <button onClick={() => setParam("brand", brand === b._id ? undefined : b._id)} className={`w-full rounded-md px-2 py-1.5 text-left hover:bg-muted ${brand === b._id ? "bg-primary-50 font-semibold text-primary" : "text-ink-600"}`}>{b.name}</button>
              </li>
            ))}
          </ul>
        </div>
        {(cat || brand || sp.get("minPrice") || sp.get("maxPrice") || sp.get("keyword")) && (
          <Button variant="ghost" size="sm" className="w-full" onClick={() => router.push("/products")}>Clear all filters</Button>
        )}
      </div>
    </aside>
  );
}
