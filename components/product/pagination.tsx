import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ current, total, params }: { current: number; total: number; params: Record<string, string | undefined> }) {
  if (total <= 1) return null;
  let href = (page: number) => {
    let qs = new URLSearchParams();
    Object.entries({ ...params, page: String(page) }).forEach(([k, v]) => v && qs.set(k, v));
    return `/products?${qs}`;
  };
  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2">
      {current > 1 && <Link href={href(current - 1)} aria-label="Previous page" className="flex h-10 w-10 items-center justify-center rounded-lg border hover:bg-muted"><ChevronLeft className="h-4 w-4" /></Link>}
      <span className="px-3 text-sm text-ink-600">Page {current} of {total}</span>
      {current < total && <Link href={href(current + 1)} aria-label="Next page" className="flex h-10 w-10 items-center justify-center rounded-lg border hover:bg-muted"><ChevronRight className="h-4 w-4" /></Link>}
    </nav>
  );
}
