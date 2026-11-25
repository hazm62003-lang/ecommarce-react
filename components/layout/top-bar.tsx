import { Truck, Sparkles, Phone, Mail } from "lucide-react";

export function TopBar() {
  return (
    <div className="hidden border-b bg-white text-sm text-ink-600 md:block">
      <div className="container flex h-10 items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" />Free Shipping on Orders 500 EGP</span>
          <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />New Arrivals Daily</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="tel:+18001234567" className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4" />+1 (800) 123-4567</a>
          <a href="mailto:support@freshcart.com" className="flex items-center gap-2 hover:text-primary"><Mail className="h-4 w-4" />support@freshcart.com</a>
        </div>
      </div>
    </div>
  );
}
