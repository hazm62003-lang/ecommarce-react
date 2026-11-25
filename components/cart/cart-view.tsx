"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/account/empty-state";
import { useApplyCoupon, useCart, useClearCart, useRemoveCartItem, useUpdateCartItem } from "@/hooks/use-cart";
import { formatEGP } from "@/lib/utils";

let FREE_SHIPPING_FROM = 500;

export function CartView() {
  let cart = useCart();
  let update = useUpdateCartItem();
  let remove = useRemoveCartItem();
  let clear = useClearCart();
  let coupon = useApplyCoupon();
  let [code, setCode] = useState("");

  if (cart.isLoading) return <Skeleton className="h-64" />;
  if (cart.isError) return <p className="text-destructive">Could not load your cart. Please refresh.</p>;
  let data = cart.data;
  if (!data?.products.length) return <EmptyState title="Your cart is empty" text="Add a few products and they will show up here." />;

  let free = data.totalCartPrice >= FREE_SHIPPING_FROM;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="space-y-4">
        <ul className="space-y-4">
          {data.products.map((item) => (
            <li key={item._id} className="flex gap-4 rounded-xl border bg-white p-4">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted/40">
                <Image src={item.product.imageCover} alt="" fill sizes="96px" className="object-contain p-1" />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link href={`/products/${item.product._id ?? item.product.id}`} className="font-semibold text-ink-900 hover:text-primary">{item.product.title}</Link>
                    <p className="text-xs text-ink-500">{item.product.category?.name}</p>
                  </div>
                  <Button variant="ghost" size="icon" aria-label="Remove item" disabled={remove.isPending} onClick={() => remove.mutate(item.product._id ?? item.product.id!)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center rounded-lg border">
                    <Button variant="ghost" size="icon" aria-label="Decrease" disabled={item.count <= 1 || update.isPending} onClick={() => update.mutate({ productId: item.product._id ?? item.product.id!, count: item.count - 1 })}><Minus className="h-4 w-4" /></Button>
                    <span className="w-9 text-center font-semibold">{item.count}</span>
                    <Button variant="ghost" size="icon" aria-label="Increase" disabled={update.isPending} onClick={() => update.mutate({ productId: item.product._id ?? item.product.id!, count: item.count + 1 })}><Plus className="h-4 w-4" /></Button>
                  </div>
                  <p className="text-sm text-ink-500">{formatEGP(item.price)} per unit</p>
                  <p className="font-bold text-ink-900">{formatEGP(item.price * item.count)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between">
          <Link href="/products" className="text-sm font-semibold text-primary hover:underline">Continue Shopping</Link>
          <Button variant="ghost" size="sm" className="text-destructive" disabled={clear.isPending} onClick={() => clear.mutate()}>Clear all items</Button>
        </div>
      </section>

      <aside className="h-fit space-y-4 rounded-xl border bg-white p-6">
        <h2 className="text-lg font-bold text-ink-900">Order Summary</h2>
        <p className="text-sm text-ink-500">{data.numOfCartItems} items in your cart</p>
        {free && <p className="rounded-lg bg-primary-50 px-3 py-2 text-sm font-medium text-primary-700">Free Shipping! You qualify for free delivery</p>}
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-ink-500">Subtotal</dt><dd className="font-medium">{formatEGP(data.totalCartPrice)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-500">Shipping</dt><dd className="font-medium text-primary-600">{free ? "FREE" : "Calculated at checkout"}</dd></div>
          <div className="flex justify-between border-t pt-3 text-base font-bold"><dt>Total</dt><dd>{formatEGP(data.totalCartPrice)}</dd></div>
        </dl>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (code.trim()) coupon.mutate(code.trim()); }}>
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Promo code" aria-label="Promo code" />
          <Button type="submit" variant="outline" disabled={coupon.isPending}>Apply</Button>
        </form>
        <Button asChild size="lg" className="w-full"><Link href="/checkout">Proceed to Checkout</Link></Button>
      </aside>
    </div>
  );
}
