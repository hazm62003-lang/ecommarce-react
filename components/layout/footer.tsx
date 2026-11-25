import Link from "next/link";
import { TrustBar } from "./trust-bar";

let cols = [
  { title: "Shop", links: [["All Products", "/products"], ["Categories", "/categories"], ["Brands", "/brands"]] },
  { title: "Account", links: [["My Account", "/profile/settings"], ["Order History", "/orders"], ["Wishlist", "/wishlist"], ["Shopping Cart", "/cart"]] },
  { title: "Support", links: [["Contact Us", "#"], ["Help Center", "#"], ["Shipping Info", "#"], ["Returns & Refunds", "#"]] },
];

export function Footer() {
  return (
    <>
      <TrustBar />
      <footer id="footer" className="bg-ink-900 text-ink-400">
        <div className="container grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <p className="text-2xl font-bold text-white">Fresh<span className="text-primary-500">Cart</span></p>
            <p className="text-sm leading-6">FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the best brands at competitive prices with a seamless shopping experience.</p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h3 className="mb-4 font-semibold text-white">{c.title}</h3>
              <ul className="space-y-2 text-sm">
                {c.links.map(([label, href]) => (
                  <li key={label}><Link href={href} className="hover:text-white">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 py-5 text-center text-sm">© {new Date().getFullYear()} FreshCart. All rights reserved.</div>
      </footer>
    </>
  );
}
