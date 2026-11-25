import Link from "next/link";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getToken } from "next-auth/jwt";
import { CheckCircle2 } from "lucide-react";
import { stripe } from "@/lib/stripe";
import { createCashOrder, getCart } from "@/lib/checkout-api";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  if (!session_id) redirect("/checkout");

  const jwt = await getToken({
    req: {
      headers: Object.fromEntries(await headers()),
      cookies: Object.fromEntries((await cookies()).getAll().map((c) => [c.name, c.value])),
    } as never,
  });
  const token = (jwt as { accessToken?: string } | null)?.accessToken;
  if (!token) redirect("/login");

  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.payment_status !== "paid") redirect("/checkout");

  const cart = await getCart(token);
  const m = session.metadata ?? {};
  if (cart && cart.cartId === m.cartId) {
    await createCashOrder(cart.cartId, token, { details: m.details, phone: m.phone, city: m.city });
  }

  return (
    <main className="container flex flex-col items-center py-16 text-center">
      <CheckCircle2 className="h-14 w-14 text-primary-600" />
      <h1 className="mt-4 text-2xl font-bold text-ink-900">Payment successful</h1>
      <p className="mt-2 text-ink-500">Thank you! Your order has been placed.</p>
      <Link href="/orders" className="mt-6 rounded-md bg-primary-600 px-6 py-2.5 font-semibold text-white hover:bg-primary-700">
        View my orders
      </Link>
    </main>
  );
}
