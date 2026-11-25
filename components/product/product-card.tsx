import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { discountPercent, formatEGP } from "@/lib/utils";
import type { Product } from "@/types";
import { RatingStars } from "./rating-stars";
import { QuickAddButton } from "./add-to-cart-button";
import { WishlistButton } from "./wishlist-button";

export function ProductCard({ product }: { product: Product }) {
  let off = discountPercent(product.price, product.priceAfterDiscount);
  let current = product.priceAfterDiscount && off ? product.priceAfterDiscount : product.price;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md">
      {off > 0 && <Badge className="absolute left-3 top-3 z-10 bg-accent-red text-white">-{off}%</Badge>}
      <WishlistButton productId={product._id} className="absolute right-3 top-3 z-10 h-8 w-8 rounded-full bg-white shadow" />

      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-square bg-muted/40">
          <Image
            src={product.imageCover}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
            className="object-contain p-3"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs text-ink-500">{product.category?.name}</p>
        <Link href={`/products/${product._id}`} className="line-clamp-2 min-h-10 text-sm font-semibold text-ink-900 hover:text-primary">
          {product.title}
        </Link>
        <RatingStars value={product.ratingsAverage} count={product.ratingsQuantity} />
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-ink-900">{formatEGP(current)}</span>
            {off > 0 && <span className="text-xs text-ink-400 line-through">{formatEGP(product.price)}</span>}
          </div>
          <QuickAddButton productId={product._id} />
        </div>
      </div>
    </article>
  );
}
