import type { Metadata } from "next";
import { AddressesView } from "@/components/account/addresses-view";

export const metadata: Metadata = { title: "My Addresses" };

export default function AddressesPage() {
  return <AddressesView />;
}
