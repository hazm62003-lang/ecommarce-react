import type { Metadata } from "next";
import { OrdersView } from "@/components/account/orders-view";
import { PageHeader } from "@/components/account/page-header";

export const metadata: Metadata = { title: "My Orders" };

export default function OrdersPage() {
  return (
    <div className="container py-8">
      <PageHeader title="My Orders" subtitle="Track and manage your orders" crumbs={[{ label: "Home", href: "/" }, { label: "My Orders" }]} />
      <OrdersView />
    </div>
  );
}
