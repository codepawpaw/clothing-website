"use client";

import Link from "next/link";
import { useEffect } from "react";
import { X } from "lucide-react";
import { itemKey } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { useCart } from "./CartProvider";
import { ProductImage } from "./ProductImage";

export function CartDrawer() {
  const { items, count, drawerOpen, closeDrawer, remove } = useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <div className="absolute inset-0 bg-black/40" onClick={closeDrawer} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-white">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <p className="text-lg">Shopping bag ({count})</p>
          <button type="button" onClick={closeDrawer} aria-label="Close" className="p-1">
            <X className="size-6" strokeWidth={1.25} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
            <p className="text-muted">Your shopping bag is empty.</p>
            <Link
              href="/new-in"
              onClick={closeDrawer}
              className="rounded-full bg-ink px-10 py-3.5 text-[15px] text-white"
            >
              Discover the new collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {items.map((item) => (
                <li key={itemKey(item)} className="flex gap-4 py-5">
                  <Link
                    href={`/p/${item.slug}`}
                    onClick={closeDrawer}
                    className="relative size-24 shrink-0 bg-tile"
                  >
                    <ProductImage src={item.image} alt={item.name} sizes="96px" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
                    <p className="text-[15px] leading-snug">{item.name}</p>
                    <p className="text-muted">
                      {item.color} · {item.size} · Qty {item.qty}
                    </p>
                    <p className="mt-auto font-semibold">{formatPrice(item.unitPrice * item.qty)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(itemKey(item))}
                    className="self-start text-xs text-muted underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-6 py-6">
              <div className="mb-5 flex justify-between text-[15px]">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="block rounded-full bg-ink py-4 text-center text-[15px] text-white hover:bg-black"
              >
                View shopping bag
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
