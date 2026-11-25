import Link from "next/link";
import { PageHeader } from "@/components/account/page-header";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-8">
      <PageHeader title="My Account" subtitle="Manage your addresses and account settings" crumbs={[{ label: "Home", href: "/" }, { label: "My Account" }]} />
      <nav className="mb-6 flex gap-2 border-b" aria-label="Account sections">
        <Link href="/profile/addresses" className="px-4 py-3 text-sm font-semibold text-ink-600 hover:text-primary">My Addresses</Link>
        <Link href="/profile/settings" className="px-4 py-3 text-sm font-semibold text-ink-600 hover:text-primary">Settings</Link>
      </nav>
      {children}
    </div>
  );
}
