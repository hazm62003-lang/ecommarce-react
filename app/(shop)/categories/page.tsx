import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/api/server";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const { data } = await getCategories();
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-ink-900">All Categories</h1>
      <p className="mt-1 text-ink-500">Browse our wide range of product categories</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {data.map((c) => (
          <Link key={c._id} href={`/products?category=${c._id}`} className="group overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md">
            <div className="relative aspect-[4/3] bg-muted">
              <Image src={c.image} alt="" fill sizes="(min-width: 1280px) 20vw, 50vw" className="object-cover" />
            </div>
            <div className="p-4">
              <p className="font-semibold text-ink-900">{c.name}</p>
              <p className="text-sm text-primary group-hover:underline">View products</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
