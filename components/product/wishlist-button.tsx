"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToggleWishlist, useWishlist } from "@/hooks/use-wishlist";

export function WishlistButton({ productId, className, label }: { productId: string; className?: string; label?: string }) {
  let router = useRouter();
  let { status } = useSession();
  let wishlist = useWishlist();
  let toggle = useToggleWishlist();
  let inList = !!wishlist.data?.data.some((p) => p._id === productId);

  function onClick() {
    if (status !== "authenticated") return router.push("/login");
    toggle.mutate({ productId, inList });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={inList}
      aria-label={inList ? "Remove from wishlist" : "Add to wishlist"}
      className={cn("flex items-center justify-center gap-2 transition-colors", className)}
    >
      <Heart className={cn("h-4 w-4", inList ? "fill-accent-red text-accent-red" : "text-ink-600")} />
      {label && <span>{inList ? "In wishlist" : label}</span>}
    </button>
  );
}
