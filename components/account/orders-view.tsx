"use client";
import Image from "next/image";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./empty-state";
import { api } from "@/lib/api/client";
import { cn, formatEGP } from "@/lib/utils";
import type { Order } from "@/types";

function status(o: Order) {
  if (o.isDelivered) return { label: "Delivered", cls: "bg-primary-100 text-primary-700" };
  if (o.isPaid) return { label: "On the way", cls: "bg-blue-100 text-blue-700" };
  return { label: "Processing", cls: "bg-yellow-100 text-yellow-800" };
}

export function OrdersView() {
  let { data: session, status: auth } = useSession();
  let [open, setOpen] = useState<string>();
  let userId = session?.user?.id;

  let q = useQuery({
    queryKey: ["orders", userId],
    enabled: auth === "authenticated" && !!userId,
    queryFn: async () => {
      let d = (await api.get(`/v1/orders/user/${userId}`)).data;
      return (Array.isArray(d) ? d : d?.data ?? []) as Order[];
    },
  });

  if (q.isLoading || auth === "loading") return <Skeleton className="h-48" />;
  if (q.isError) return <p className="text-destructive">Could not load your orders.</p>;
  if (!q.data?.length) return <EmptyState title="No orders yet" text="When you place an order it will appear here." />;

  return (
    <ul className="space-y-4">
      {[...q.data].reverse().map((o) => {
        let s = status(o);
        let isOpen = open === o._id;
        return (
          <li key={o._id} className="rounded-xl border bg-white">
            <button className="flex w-full flex-wrap items-center gap-4 p-4 text-left" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? undefined : o._id)}>
              <Badge className={s.cls}>{s.label}</Badge>
              <span className="font-semibold text-ink-900">#{o.id ?? o._id.slice(-6)}</span>
              <span className="text-sm text-ink-500">{new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              <span className="text-sm text-ink-500">{o.cartItems.length} items</span>
              <span className="ml-auto font-bold text-ink-900">{formatEGP(o.totalOrderPrice)}</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
              <div className="grid gap-6 border-t p-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 font-semibold text-ink-900">Order Items</h3>
                  <ul className="space-y-3">
                    {o.cartItems.map((i) => (
                      <li key={i._id} className="flex items-center gap-3 text-sm">
                        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted/40"><Image src={i.product.imageCover} alt="" fill sizes="48px" className="object-contain" /></span>
                        <span className="flex-1">{i.product.title}</span>
                        <span className="text-ink-500">{i.count} × {formatEGP(i.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <h3 className="mb-1 font-semibold text-ink-900">Delivery Address</h3>
                    <p className="text-ink-600">{o.shippingAddress?.city}{o.shippingAddress?.details && `, ${o.shippingAddress.details}`}</p>
                    <p className="text-ink-600">{o.shippingAddress?.phone}</p>
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-ink-900">Payment</h3>
                    <p className="text-ink-600">{o.paymentMethodType === "card" ? "Card" : "Cash on delivery"}</p>
                  </div>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
