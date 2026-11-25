export interface Category { _id: string; name: string; slug: string; image: string }
export interface Brand { _id: string; name: string; slug: string; image: string }
export interface SubCategory { _id: string; name: string; slug: string; category: string }

export interface Product {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  sold: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images: string[];
  category: Category;
  subcategory: SubCategory[];
  brand: Brand;
  ratingsAverage: number;
  ratingsQuantity: number;
}

export interface Review {
  _id: string;
  review: string;
  rating: number;
  createdAt: string;
  user: { _id: string; name: string };
}

export interface ListResponse<T> {
  results: number;
  metadata: { currentPage: number; numberOfPages: number; limit: number; nextPage?: number; prevPage?: number };
  data: T[];
}
export interface ItemResponse<T> { data: T }

export interface CartItem { _id: string; count: number; price: number; product: Pick<Product, "_id" | "title" | "imageCover" | "category" | "quantity"> & { id?: string } }
export interface Cart { cartId?: string; numOfCartItems: number; totalCartPrice: number; products: CartItem[] }
export interface Address { _id: string; name: string; details: string; phone: string; city: string }
export interface ShippingAddress { details: string; phone: string; city: string; postalCode?: string }
export interface Order {
  _id: string;
  id?: number;
  totalOrderPrice: number;
  shippingPrice?: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  shippingAddress?: ShippingAddress;
  cartItems: { _id: string; count: number; price: number; product: { title: string; imageCover: string } }[];
}
