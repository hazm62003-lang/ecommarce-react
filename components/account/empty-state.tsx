import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState({ title, text, cta = "Continue Shopping", href = "/products" }: { title: string; text: string; cta?: string; href?: string }) {
  return (
    <div className="rounded-xl border border-dashed py-16 text-center">
      <p className="text-lg font-semibold text-ink-900">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500">{text}</p>
      <Button asChild className="mt-6"><Link href={href}>{cta}</Link></Button>
    </div>
  );
}
