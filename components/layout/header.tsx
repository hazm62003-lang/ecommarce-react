"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Heart, Menu, Search, ShoppingCart, User, X, LogOut } from "lucide-react";
import { cartCount, useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";

let links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
];

function CountBadge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white">
      {n}
    </span>
  );
}

export function Header() {
  let router = useRouter();
  let { data: session, status } = useSession();
  let [open, setOpen] = useState(false);
  let cart = useCart();
  let wishlist = useWishlist();

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    router.push(q ? `/products?keyword=${encodeURIComponent(q)}` : "/products");
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="container flex h-16 items-center gap-4 lg:h-[72px] lg:gap-8">
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-ink-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">F</span>
          Fresh<span className="text-primary">Cart</span>
        </Link>

        <form onSubmit={onSearch} className="relative hidden flex-1 md:block" role="search">
          <input
            name="q"
            placeholder="Search for products, brands and more..."
            className="h-11 w-full rounded-full border bg-muted/50 pl-5 pr-14 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button aria-label="Search" className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
            <Search className="h-4 w-4" />
          </button>
        </form>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink-700 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-primary">{l.label}</Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link href="/wishlist" aria-label="Wishlist" className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted">
            <Heart className="h-5 w-5" /><CountBadge n={wishlist.data?.count ?? 0} />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-muted">
            <ShoppingCart className="h-5 w-5" /><CountBadge n={cartCount(cart.data)} />
          </Link>
          {status === "authenticated" ? (
            <div className="ml-2 flex items-center gap-2">
              <Link href="/profile/settings" className="flex items-center gap-2 text-sm font-medium hover:text-primary">
                <User className="h-5 w-5" /><span className="hidden xl:inline">{session.user?.name}</span>
              </Link>
              <Button variant="ghost" size="icon" aria-label="Sign out" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="ml-2 hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm"><Link href="/login">Sign In</Link></Button>
              <Button asChild size="sm"><Link href="/signup">Sign Up</Link></Button>
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t bg-white p-4 lg:hidden">
          <form onSubmit={onSearch} className="mb-3 md:hidden" role="search">
            <input name="q" placeholder="Search products..." className="h-11 w-full rounded-full border px-5 text-sm" />
          </form>
          <nav className="flex flex-col" aria-label="Mobile">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-medium hover:bg-muted">{l.label}</Link>
            ))}
            {status !== "authenticated" && (
              <div className="mt-2 flex gap-2">
                <Button asChild variant="outline" className="flex-1"><Link href="/login">Sign In</Link></Button>
                <Button asChild className="flex-1"><Link href="/signup">Sign Up</Link></Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
