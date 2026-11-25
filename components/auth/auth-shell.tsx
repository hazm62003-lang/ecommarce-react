import Link from "next/link";
import { ShieldCheck, Star, Truck } from "lucide-react";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="hidden flex-col justify-center gap-8 bg-gradient-to-br from-primary-700 to-primary-500 p-12 text-white lg:flex">
        <Link href="/" className="text-3xl font-bold">FreshCart</Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight">Welcome to FreshCart</h2>
          <p className="mt-3 max-w-md text-white/90">Join thousands of happy customers who enjoy fresh groceries delivered right to their doorstep.</p>
        </div>
        <ul className="space-y-4">
          <li className="flex items-center gap-3"><Star className="h-5 w-5" />Premium quality products from trusted suppliers</li>
          <li className="flex items-center gap-3"><Truck className="h-5 w-5" />Same-day delivery in most areas</li>
          <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5" />Your data and payments are completely secure</li>
        </ul>
      </aside>
      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div><h1 className="text-3xl font-bold text-ink-900">{title}</h1><p className="mt-1 text-ink-500">{subtitle}</p></div>
          {children}
        </div>
      </main>
    </div>
  );
}
