import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {categories.map((c) => (
        <Link
          key={c._id}
          href={`/products?category=${c._id}`}
          className="flex flex-col items-center gap-3 rounded-xl border bg-white p-4 text-center transition-shadow hover:shadow-md"
        >
          <span className="relative h-20 w-20 overflow-hidden rounded-full bg-muted">
            <Image src={c.image} alt="" fill sizes="80px" className="object-cover" />
          </span>
          <span className="text-sm font-semibold text-ink-800">{c.name}</span>
        </Link>
      ))}
    </div>
  );
}
