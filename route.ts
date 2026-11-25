import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { createCashOrder, getCart } from "@/lib/checkout-api";
import { stripe } from "@/lib/stripe";

const schema = z.object({
  method: z.enum(["cash", "card"]),
  shippingAddress: z.object({
    details: z.string().min(5),
    phone: z.string().regex(/^01[0125][0-9]{8}$/),
    city: z.string().min(2),
  }),
});

export async function POST(req: NextRequest) {
  const jwt = await getToken({ req });
  const token = (jwt as { accessToken?: string } | null)?.accessToken;
  if (!token) return NextResponse.json({ message: "Please sign in again" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "Invalid shipping details" }, { status: 400 });
  const { method, shippingAddress } = parsed.data;

  try {
    const cart = await getCart(token);
    if (!cart || !cart.items.length) return NextResponse.json({ message: "Your cart is empty" }, { status: 400 });

    if (method === "cash") {
      await createCashOrder(cart.cartId, token, shippingAddress);
      return NextResponse.json({ redirectTo: "/orders" });
    }

    const origin = process.env.NEXTAUTH_URL ?? req.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: cart.items.map((i) => ({
        quantity: i.count,
        price_data: {
          currency: "egp",
          unit_amount: Math.round(i.price * 100),
          product_data: {
            name: i.product.title,
            images: i.product.imageCover ? [i.product.imageCover] : undefined,
          },
        },
      })),
      metadata: { cartId: cart.cartId, ...shippingAddress },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });
    return NextResponse.json({ redirectTo: session.url });
  } catch (e) {
    return NextResponse.json({ message: e instanceof Error ? e.message : "Payment failed" }, { status: 502 });
  }
}
