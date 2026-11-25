"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/use-cart";
import { formatEGP } from "@/lib/utils";
import { WishlistButton } from "./wishlist-button";

export function PurchasePanel({ productId, unitPrice, stock }: { productId: string; unitPrice: number; stock: number }) {
  let router = useRouter();
  let { status } = useSession();
  let add = useAddToCart();
  let [qty, setQty] = useState(1);
  let total = useMemo(() => unitPrice * qty, [unitPrice, qty]);
  let needLogin = () => status !== "authenticated" && (router.push("/login"), true);

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium text-ink-700">Quantity</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-lg border">
            <Button variant="ghost" size="icon" aria-label="Decrease" disabled={qty <= 1} onClick={() => setQty((q) => q - 1)}><Minus className="h-4 w-4" /></Button>
            <span className="w-10 text-center font-semibold" aria-live="polite">{qty}</span>
            <Button variant="ghost" size="icon" aria-label="Increase" disabled={qty >= stock} onClick={() => setQty((q) => q + 1)}><Plus className="h-4 w-4" /></Button>
          </div>
          <span className="text-sm text-ink-500">{stock} available</span>
        </div>
      </div>

      <p className="flex items-center justify-between rounded-lg bg-primary-50 px-4 py-3 text-sm">
        <span className="text-ink-600">Total Price:</span>
        <span className="text-lg font-bold text-primary-600">{formatEGP(total)}</span>
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button size="lg" disabled={add.isPending || stock < 1} onClick={() => !needLogin() && add.mutate({ productId, count: qty })}>
          <ShoppingCart className="h-4 w-4" />Add to Cart
        </Button>
        <Button
          size="lg"
          variant="outline"
          disabled={add.isPending || stock < 1}
          onClick={() => !needLogin() && add.mutate({ productId, count: qty }, { onSuccess: () => router.push("/checkout") })}
        >
          Buy Now
        </Button>
      </div>
      <WishlistButton productId={productId} label="Add to Wishlist" className="w-full rounded-lg border py-3 text-sm font-medium hover:bg-muted" />
    </div>
  );
}
