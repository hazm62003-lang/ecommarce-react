import { RotateCcw, ShieldCheck, Headphones, Truck } from "lucide-react";

let items = [
  { icon: Truck, title: "Free Shipping", text: "On orders over 500 EGP" },
  { icon: RotateCcw, title: "Easy Returns", text: "14-day return policy" },
  { icon: ShieldCheck, title: "Secure Payment", text: "100% secure checkout" },
  { icon: Headphones, title: "24/7 Support", text: "Contact us anytime" },
];

export function TrustBar() {
  return (
    <section className="bg-primary-50 py-6">
      <div className="container grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary"><Icon className="h-5 w-5" /></span>
            <div><p className="font-semibold text-ink-900">{title}</p><p className="text-sm text-ink-500">{text}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}
