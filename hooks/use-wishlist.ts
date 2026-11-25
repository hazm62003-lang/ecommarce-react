"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { api, apiError } from "@/lib/api/client";
import type { Product } from "@/types";

export function useWishlist() {
  let { status } = useSession();
  return useQuery({
    queryKey: ["wishlist"],
    enabled: status === "authenticated",
    queryFn: async () => (await api.get<{ count: number; data: Product[] }>("/v1/wishlist")).data,
  });
}

export function useToggleWishlist() {
  let qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, inList }: { productId: string; inList: boolean }) =>
      inList ? api.delete(`/v1/wishlist/${productId}`) : api.post("/v1/wishlist", { productId }),
    onMutate: async ({ productId, inList }) => {
      await qc.cancelQueries({ queryKey: ["wishlist"] });
      let prev = qc.getQueryData<{ count: number; data: Product[] }>(["wishlist"]);
      if (prev) {
        let data = inList
          ? prev.data.filter((p) => p._id !== productId)
          : [...prev.data, { _id: productId } as Product];
        qc.setQueryData(["wishlist"], { ...prev, data, count: data.length });
      }
      return { prev };
    },
    onError: (e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(["wishlist"], ctx.prev);
      toast.error(apiError(e, "Could not update wishlist"));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}
