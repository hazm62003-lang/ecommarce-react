import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

let banners = [
  { tag: "Deal of the Day", title: "Fresh Organic Fruits", text: "Get up to 40% off on selected organic fruits", off: "40% OFF", code: "ORGANIC40", cta: "Shop Now", bg: "from-primary-600 to-primary-500" },
  { tag: "New Arrivals", title: "Exotic Vegetables", text: "Discover our latest collection of premium vegetables", off: "25% OFF", code: "FRESH25", cta: "Explore Now", bg: "from-accent-orange to-accent-orange2" },
];

export function PromoBanners() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {banners.map((b) => (
        <div key={b.title} className={`rounded-2xl bg-gradient-to-br ${b.bg} p-8 text-white`}>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">{b.tag}</span>
          <h3 className="mt-4 text-3xl font-bold">{b.title}</h3>
          <p className="mt-2 text-white/90">{b.text}</p>
          <p className="mt-6 flex items-baseline gap-3"><span className="text-4xl font-bold">{b.off}</span><span className="text-sm text-white/80">Use code: {b.code}</span></p>
          <Button asChild variant="light" className="mt-6"><Link href="/products">{b.cta}<ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      ))}
    </div>
  );
}
