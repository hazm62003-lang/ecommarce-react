"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { API_BASE } from "@/lib/api/config";
import type { ShippingAddress } from "@/types";

type Result = { ok: true; url?: string } | { ok: false; error: string };

export async function placeOrder(input: { cartId: string; method: "cash" | "online"; shippingAddress: ShippingAddress }): Promise<Result> {
  const session = await getServerSession(authOptions);
  if (!session?.apiToken) return { ok: false, error: "Please sign in again to place your order." };

  const headers = { "Content-Type": "application/json", token: session.apiToken };
  const body = JSON.stringify({ shippingAddress: input.shippingAddress });
  const origin = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const url =
    input.method === "cash"
      ? `${API_BASE}/v2/orders/${input.cartId}`
      : `${API_BASE}/v1/orders/checkout-session/${input.cartId}?url=${encodeURIComponent(origin)}`;

  const res = await fetch(url, { method: "POST", headers, body, cache: "no-store" });
  const json = await res.json().catch(() => null);
  if (!res.ok) return { ok: false, error: json?.message ?? "Could not place your order." };
  return { ok: true, url: json?.session?.url };
}
