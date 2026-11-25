import "server-only";
import { API_BASE } from "./config";
import type { Brand, Category, ItemResponse, ListResponse, Product, SubCategory } from "@/types";

type Params = Record<string, string | number | undefined | null>;

async function get<T>(path: string, params?: Params, revalidate = 300): Promise<T> {
  let qs = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });
  let url = `${API_BASE}${path}${qs.size ? `?${qs}` : ""}`;
  let res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`);
  return res.json();
}

export let getCategories = () => get<ListResponse<Category>>("/v1/categories");
export let getCategorySubcategories = (id: string) =>
  get<ListResponse<SubCategory>>(`/v1/categories/${id}/subcategories`);
export let getBrands = (params?: Params) => get<ListResponse<Brand>>("/v1/brands", params);
export let getProducts = (params?: Params) => get<ListResponse<Product>>("/v1/products", params);
export let getProduct = (id: string) => get<ItemResponse<Product>>(`/v1/products/${id}`);
