import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { PageHeader } from "@/components/account/page-header";

export const metadata: Metadata = { title: "Shopping Cart" };

export default function CartPage() {
  return (
    <div className="container py-8">
      <PageHeader title="Shopping Cart" crumbs={[{ label: "Home", href: "/" }, { label: "Shopping Cart" }]} />
      <CartView />
    </div>
  );
}
