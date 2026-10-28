import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { readDatabase } from "./db";
import type { Category, CategoryNode, Product } from "./types";

export const CATALOG_TAG = "catalog";

export type Catalog = { categories: Category[]; products: Product[] };

/** Public catalog (active products only). Cached until an admin change calls updateTag(CATALOG_TAG). */
export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("max");
  const db = await readDatabase();
  return {
    categories: [...db.categories].sort(byOrder),
    products: db.products
      .filter((p) => p.isActive)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };
}

function byOrder(a: Category, b: Category) {
  return a.order - b.order || a.name.localeCompare(b.name);
}

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  return categories
    .filter((c) => c.parentId === null)
    .sort(byOrder)
    .map((c) => ({
      ...c,
      children: categories.filter((child) => child.parentId === c.id).sort(byOrder),
    }));
}

/** The category plus all its sub-category ids. */
export function categoryScope(categories: Category[], categoryId: string): Set<string> {
  return new Set([
    categoryId,
    ...categories.filter((c) => c.parentId === categoryId).map((c) => c.id),
  ]);
}

export type SortKey = "newest" | "price-asc" | "price-desc";
export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export type ListingFilters = { sort: SortKey; sizes: string[]; colors: string[] };

type RawSearchParams = Record<string, string | string[] | undefined>;

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return (Array.isArray(value) ? value : [value]).filter(Boolean);
}

export function parseFilters(params: RawSearchParams): ListingFilters {
  const sort = toArray(params.sort)[0];
  return {
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortKey) : "newest",
    sizes: toArray(params.size),
    colors: toArray(params.color),
  };
}

export function effectivePrice(p: Product): number {
  return p.salePrice ?? p.price;
}

export function applyFilters(products: Product[], filters: ListingFilters): Product[] {
  const colors = filters.colors.map((c) => c.toLowerCase());
  const result = products.filter(
    (p) =>
      (filters.sizes.length === 0 || p.sizes.some((s) => filters.sizes.includes(s))) &&
      (colors.length === 0 || p.colors.some((c) => colors.includes(c.name.toLowerCase()))),
  );
  if (filters.sort === "price-asc") result.sort((a, b) => effectivePrice(a) - effectivePrice(b));
  if (filters.sort === "price-desc") result.sort((a, b) => effectivePrice(b) - effectivePrice(a));
  return result;
}

/** Sizes and colours available in a product list, used to build filter options. */
export function filterOptions(products: Product[]) {
  const sizes = new Set<string>();
  const colors = new Map<string, { name: string; hex: string }>();
  for (const p of products) {
    p.sizes.forEach((s) => sizes.add(s));
    p.colors.forEach((c) => {
      const key = c.name.toLowerCase();
      if (!colors.has(key)) colors.set(key, { name: c.name, hex: c.hex });
    });
  }
  const order = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL"];
  const rank = (s: string) => (order.includes(s) ? order.indexOf(s) : 100);
  return {
    sizes: [...sizes].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b, undefined, { numeric: true })),
    colors: [...colors.values()],
  };
}

export function searchProducts(products: Product[], categories: Category[], query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const categoryName = new Map(categories.map((c) => [c.id, c.name]));
  return products.filter((p) => {
    const haystack = [p.name, p.description, categoryName.get(p.categoryId) ?? "", ...p.colors.map((c) => c.name)]
      .join(" ")
      .toLowerCase();
    return terms.every((t) => haystack.includes(t));
  });
}
