import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/checkout-form";
import { PageHeader } from "@/components/account/page-header";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container py-8">
      <PageHeader title="Complete Your Order" subtitle="Review your items and complete your purchase" crumbs={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <CheckoutForm />
    </div>
  );
}
