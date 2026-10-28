"use server";

import { z } from "zod";
import { getCatalog } from "@/lib/catalog";
import { transaction } from "@/lib/db";

export type SubscribeState = { ok: boolean; message: string } | null;

export async function subscribe(_prev: SubscribeState, formData: FormData): Promise<SubscribeState> {
  const parsed = z.email().max(254).safeParse(String(formData.get("email") ?? "").trim().toLowerCase());
  if (!parsed.success) return { ok: false, message: "Please enter a valid email address." };
  const email = parsed.data;
  await transaction((db) => {
    if (!db.subscribers.some((s) => s.email === email)) {
      db.subscribers.push({ email, createdAt: new Date().toISOString() });
    }
  });
  return { ok: true, message: "Thank you! You're on the list." };
}

export type CartProductInfo = {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  colors: string[];
  sizes: string[];
};

/** Current data for the products in a cart, so prices are never trusted from the browser. */
export async function resolveCart(productIds: string[]): Promise<CartProductInfo[]> {
  const ids = new Set(z.array(z.string().max(100)).max(200).parse(productIds));
  const { products } = await getCatalog();
  return products
    .filter((p) => ids.has(p.id))
    .map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      salePrice: p.salePrice,
      colors: p.colors.map((c) => c.name),
      sizes: p.sizes,
    }));
}
