"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Plus } from "lucide-react";
import { useAddToCart } from "@/hooks/use-cart";

export function QuickAddButton({ productId }: { productId: string }) {
  let router = useRouter();
  let { status } = useSession();
  let add = useAddToCart();

  return (
    <button
      type="button"
      aria-label="Add to cart"
      disabled={add.isPending}
      onClick={() => (status === "authenticated" ? add.mutate({ productId }) : router.push("/login"))}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
    >
      {add.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
    </button>
  );
}
