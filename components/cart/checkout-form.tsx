"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Banknote, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { placeOrder } from "@/app/actions/orders";
import { EmptyState } from "@/components/account/empty-state";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { api } from "@/lib/api/client";
import { cn, formatEGP } from "@/lib/utils";
import type { Address } from "@/types";

let schema = z.object({
  city: z.string().min(2, "City is required"),
  details: z.string().min(5, "Enter your street address"),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, "Enter an Egyptian number (01xxxxxxxxx)"),
});
type Values = z.infer<typeof schema>;

export function CheckoutForm() {
  let router = useRouter();
  let qc = useQueryClient();
  let cart = useCart();
  let addresses = useQuery({ queryKey: ["addresses"], queryFn: async () => (await api.get<{ data: Address[] }>("/v1/addresses")).data.data });
  let [method, setMethod] = useState<"cash" | "online">("cash");
  let [saved, setSaved] = useState<string>();
  let [busy, setBusy] = useState(false);
  let { register, handleSubmit, setValue, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) });

  if (cart.isLoading) return <Skeleton className="h-64" />;
  if (!cart.data?.products.length || !cart.data.cartId) return <EmptyState title="Nothing to check out" text="Your cart is empty." />;
  let { cartId, products, totalCartPrice } = cart.data;

  function pick(a: Address) {
    setSaved(a._id);
    setValue("city", a.city, { shouldValidate: true });
    setValue("details", a.details, { shouldValidate: true });
    setValue("phone", a.phone, { shouldValidate: true });
  }

  async function onSubmit(v: Values) {
    setBusy(true);
    let res = await placeOrder({ cartId: cartId!, method, shippingAddress: v });
    setBusy(false);
    if (!res.ok) return toast.error(res.error);
    qc.invalidateQueries({ queryKey: ["cart"] });
    if (res.url) { window.location.href = res.url; return; }
    toast.success("Order placed");
    router.push("/orders");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_380px]" noValidate>
      <div className="space-y-6">
        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-bold text-ink-900">Shipping Address</h2>
          <p className="text-sm text-ink-500">Where should we deliver your order?</p>
          {!!addresses.data?.length && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Saved addresses">
              {addresses.data.map((a) => (
                <button type="button" key={a._id} role="radio" aria-checked={saved === a._id} onClick={() => pick(a)} className={cn("rounded-lg border p-3 text-left text-sm", saved === a._id && "border-primary bg-primary-50")}>
                  <p className="font-semibold text-ink-900">{a.name} · {a.city}</p>
                  <p className="text-ink-500">{a.details}</p><p className="text-ink-500">{a.phone}</p>
                </button>
              ))}
            </div>
          )}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FormField label="City *" htmlFor="city" error={errors.city?.message}><Input id="city" placeholder="e.g. Cairo, Alexandria, Giza" aria-invalid={!!errors.city} {...register("city")} /></FormField>
            <FormField label="Phone Number *" htmlFor="phone" error={errors.phone?.message}><Input id="phone" type="tel" placeholder="01xxxxxxxxx" aria-invalid={!!errors.phone} {...register("phone")} /></FormField>
            <div className="sm:col-span-2"><FormField label="Street Address *" htmlFor="details" error={errors.details?.message}><Input id="details" placeholder="Street name, building number, floor, apartment..." aria-invalid={!!errors.details} {...register("details")} /></FormField></div>
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-lg font-bold text-ink-900">Payment Method</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
            {([["cash", Banknote, "Cash on Delivery", "Pay when your order arrives"], ["online", CreditCard, "Pay Online", "Credit/Debit Card via Stripe"]] as const).map(([val, Icon, title, text]) => (
              <button type="button" key={val} role="radio" aria-checked={method === val} onClick={() => setMethod(val)} className={cn("flex items-start gap-3 rounded-lg border p-4 text-left", method === val && "border-primary bg-primary-50")}>
                <Icon className="mt-0.5 h-5 w-5 text-primary" /><span><span className="block font-semibold text-ink-900">{title}</span><span className="text-sm text-ink-500">{text}</span></span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <aside className="h-fit space-y-4 rounded-xl border bg-white p-6">
        <h2 className="text-lg font-bold text-ink-900">Order Summary</h2>
        <ul className="max-h-64 space-y-3 overflow-y-auto">
          {products.map((i) => (
            <li key={i._id} className="flex items-center gap-3 text-sm">
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted/40"><Image src={i.product.imageCover} alt="" fill sizes="48px" className="object-contain" /></span>
              <span className="line-clamp-1 flex-1">{i.product.title}</span>
              <span className="text-ink-500">{i.count} × {formatEGP(i.price)}</span>
            </li>
          ))}
        </ul>
        <p className="flex justify-between border-t pt-3 text-base font-bold"><span>Total</span><span>{formatEGP(totalCartPrice)}</span></p>
        <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}{method === "cash" ? "Place Order" : "Continue to Payment"}</Button>
        <Link href="/cart" className="block text-center text-sm font-medium text-primary hover:underline">Back to Cart</Link>
      </aside>
    </form>
  );
}
