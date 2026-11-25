import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBrands } from "@/lib/api/server";

export const metadata: Metadata = { title: "Brands" };

export default async function BrandsPage() {
  const { data } = await getBrands({ limit: 100 });
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-ink-900">Top Brands</h1>
      <p className="mt-1 text-ink-500">Shop from your favorite brands</p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
        {data.map((b) => (
          <Link key={b._id} href={`/products?brand=${b._id}`} className="flex flex-col items-center gap-3 rounded-xl border bg-white p-5 text-center transition-shadow hover:shadow-md">
            <div className="relative h-20 w-full"><Image src={b.image} alt={b.name} fill sizes="200px" className="object-contain" /></div>
            <p className="font-semibold text-ink-900">{b.name}</p>
            <span className="text-sm text-primary">View Products</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
