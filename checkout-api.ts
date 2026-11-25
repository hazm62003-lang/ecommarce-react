import "server-only";

const API = process.env.API_BASE_URL ?? "https://ecommerce.routemisr.com/api/v1";

export type ShippingAddress = { details: string; phone: string; city: string };
export type CartItem = { count: number; price: number; product: { title: string; imageCover?: string } };

async function request<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", token },
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message ?? `Request failed (${res.status})`);
  return data as T;
}

export async function getCart(token: string) {
  const data = await request<{ cartId?: string; numOfCartItems?: number; data?: { products?: CartItem[] } }>("/cart", token);
  if (!data.numOfCartItems || !data.cartId) return null;
  return { cartId: data.cartId, items: data.data?.products ?? [] };
}

export const createCashOrder = (cartId: string, token: string, shippingAddress: ShippingAddress) =>
  request(`/orders/${cartId}`, token, { method: "POST", body: JSON.stringify({ shippingAddress }) });
