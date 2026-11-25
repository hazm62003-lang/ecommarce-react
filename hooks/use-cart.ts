"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { api, apiError } from "@/lib/api/client";
import type { Cart } from "@/types";

let CART = "/v2/cart";

export function normalizeCart(raw: any): Cart {
  let d = raw?.data ?? raw ?? {};
  let products = d.products ?? [];
  return {
    cartId: raw?.cartId ?? d._id ?? d.cartId,
    numOfCartItems: raw?.numOfCartItems ?? products.length,
    totalCartPrice: d.totalCartPrice ?? raw?.totalCartPrice ?? 0,
    products,
  };
}

export function useCart() {
  let { status } = useSession();
  return useQuery({
    queryKey: ["cart"],
    enabled: status === "authenticated",
    queryFn: async () => normalizeCart((await api.get(CART)).data),
  });
}

export let cartCount = (cart?: Cart) => cart?.numOfCartItems ?? 0;

export function useAddToCart() {
  let qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, count = 1 }: { productId: string; count?: number }) => {
      let res = await api.post(CART, { productId });
      if (count > 1) await api.put(`${CART}/${productId}`, { count });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Added to cart");
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (e) => toast.error(apiError(e, "Could not add to cart")),
  });
}

export function useUpdateCartItem() {
  let qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, count }: { productId: string; count: number }) => api.put(`${CART}/${productId}`, { count }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
    onError: (e) => toast.error(apiError(e, "Could not update quantity")),
  });
}

export function useRemoveCartItem() {
  let qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => api.delete(`${CART}/${productId}`),
    onSuccess: () => { toast.success("Item removed"); qc.invalidateQueries({ queryKey: ["cart"] }); },
    onError: (e) => toast.error(apiError(e, "Could not remove item")),
  });
}

export function useClearCart() {
  let qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete(CART),
    onSuccess: () => { toast.success("Cart cleared"); qc.invalidateQueries({ queryKey: ["cart"] }); },
    onError: (e) => toast.error(apiError(e, "Could not clear cart")),
  });
}

export function useApplyCoupon() {
  let qc = useQueryClient();
  return useMutation({
    mutationFn: (couponName: string) => api.put(`${CART}/applyCoupon`, { couponName }),
    onSuccess: () => { toast.success("Promo code applied"); qc.invalidateQueries({ queryKey: ["cart"] }); },
    onError: (e) => toast.error(apiError(e, "Invalid promo code")),
  });
}
