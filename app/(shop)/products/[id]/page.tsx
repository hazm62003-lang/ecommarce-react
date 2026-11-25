import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductTabs } from "@/components/product/product-tabs";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { RatingStars } from "@/components/product/rating-stars";
import { SectionHeading } from "@/components/home/section-heading";
import { Badge } from "@/components/ui/badge";
import { getProduct, getProducts } from "@/lib/api/server";
import { discountPercent, formatEGP } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const { data } = await getProduct(id);
    return { title: data.title, description: data.description?.slice(0, 160), openGraph: { images: [data.imageCover] } };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id).then((r) => r.data).catch(() => null);
  if (!product) notFound();

  const related = await getProducts({ "category[in]": product.category._id, limit: 6 }).catch(() => null);
  const off = discountPercent(product.price, product.priceAfterDiscount);
  const price = off && product.priceAfterDiscount ? product.priceAfterDiscount : product.price;
  const images = [product.imageCover, ...(product.images ?? [])].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="container space-y-10 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
        <Link href="/" className="hover:text-primary">Home</Link> / <Link href={`/products?category=${product.category._id}`} className="hover:text-primary">{product.category.name}</Link> / <span className="text-ink-900">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery images={images} title={product.title} />
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary-50 text-primary-700">{product.category.name}</Badge>
            {product.brand && <Badge className="bg-muted text-ink-600">{product.brand.name}</Badge>}
          </div>
          <h1 className="text-2xl font-bold text-ink-900 md:text-3xl">{product.title}</h1>
          <RatingStars value={product.ratingsAverage} count={product.ratingsQuantity} />
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary-600">{formatEGP(price)}</span>
            {off > 0 && <span className="text-ink-400 line-through">{formatEGP(product.price)}</span>}
            {off > 0 && <Badge className="bg-accent-red text-white">-{off}%</Badge>}
          </div>
          <p className={`flex items-center gap-1.5 text-sm font-medium ${product.quantity > 0 ? "text-primary-600" : "text-destructive"}`}>
            <Check className="h-4 w-4" />{product.quantity > 0 ? "In Stock" : "Out of stock"}
          </p>
          <p className="line-clamp-3 text-sm leading-6 text-ink-600">{product.description}</p>
          <PurchasePanel productId={product._id} unitPrice={price} stock={product.quantity} />
          <ul className="grid gap-3 border-t pt-5 text-sm sm:grid-cols-3">
            <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" />Free Delivery</li>
            <li className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-primary" />14 Days Return</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />Secure Payment</li>
          </ul>
        </div>
      </div>

      <ProductTabs product={product} />

      {related && related.data.filter((p) => p._id !== product._id).length > 0 && (
        <section>
          <SectionHeading title="You May Also Like" />
          <ProductGrid products={related.data.filter((p) => p._id !== product._id).slice(0, 5)} />
        </section>
      )}
    </div>
  );
}
