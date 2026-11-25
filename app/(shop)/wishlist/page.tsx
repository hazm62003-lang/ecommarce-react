import type { Metadata } from "next";
import { PageHeader } from "@/components/account/page-header";
import { WishlistView } from "@/components/account/wishlist-view";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <div className="container py-8">
      <PageHeader title="My Wishlist" crumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <WishlistView />
    </div>
  );
}
