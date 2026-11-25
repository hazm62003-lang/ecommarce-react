"use client";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./empty-state";
import { useAddToCart } from "@/hooks/use-cart";
import { useToggleWishlist, useWishlist } from "@/hooks/use-wishlist";
import { formatEGP } from "@/lib/utils";

export function WishlistView() {
  let q = useWishlist();
  let toggle = useToggleWishlist();
  let add = useAddToCart();

  if (q.isLoading) return <Skeleton className="h-48" />;
  if (q.isError) return <p className="text-destructive">Could not load your wishlist.</p>;
  if (!q.data?.data.length) return <EmptyState title="Your wishlist is empty" text="Tap the heart on any product to save it here." />;

  return (
    <ul className="divide-y rounded-xl border bg-white">
      {q.data.data.map((p) => (
        <li key={p._id} className="flex flex-wrap items-center gap-4 p-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted/40"><Image src={p.imageCover} alt="" fill sizes="80px" className="object-contain p-1" /></div>
          <div className="min-w-0 flex-1">
            <Link href={`/products/${p._id}`} className="line-clamp-2 font-semibold text-ink-900 hover:text-primary">{p.title}</Link>
            <p className="text-xs text-ink-500">{p.category?.name}</p>
          </div>
          <p className="font-bold">{formatEGP(p.priceAfterDiscount ?? p.price)}</p>
          <p className={p.quantity > 0 ? "text-sm font-medium text-primary-600" : "text-sm font-medium text-destructive"}>{p.quantity > 0 ? "In Stock" : "Out of stock"}</p>
          <Button size="sm" disabled={add.isPending || p.quantity < 1} onClick={() => add.mutate({ productId: p._id })}>Add to Cart</Button>
          <Button variant="ghost" size="icon" aria-label="Remove from wishlist" onClick={() => toggle.mutate({ productId: p._id, inList: true })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </li>
      ))}
    </ul>
  );
}
