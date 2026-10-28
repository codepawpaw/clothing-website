"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { ProductImage } from "@/components/ProductImage";
import { MAX_QTY, itemKey } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";
import { resolveCart, type CartProductInfo } from "../actions";

export function CartView() {
  const { items, setQty, remove } = useCart();
  // Server data, tagged with the product ids it was fetched for.
  const [resolved, setResolved] = useState<{ ids: string; map: Map<string, CartProductInfo> } | null>(null);
  const [loadError, setLoadError] = useState(false);
  const ids = useMemo(() => [...new Set(items.map((i) => i.productId))].sort().join(","), [items]);

  useEffect(() => {
    if (!ids) return;
    let cancelled = false;
    resolveCart(ids.split(","))
      .then((list) => {
        if (cancelled) return;
        setResolved({ ids, map: new Map(list.map((p) => [p.id, p])) });
        setLoadError(false);
      })
      .catch(() => !cancelled && setLoadError(true));
    return () => {
      cancelled = true;
    };
  }, [ids]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 py-24 text-center">
        <p className="text-muted">Your shopping bag is empty.</p>
        <Link href="/new-in" className="rounded-full bg-ink px-10 py-4 text-[15px] text-white hover:bg-black">
          Discover the new collection
        </Link>
      </div>
    );
  }

  const info = resolved?.ids === ids ? resolved.map : null;
  const loading = !info && !loadError;
  // Prices always come from the server; an item is unavailable when its product,
  // colour or size no longer exists.
  const lines = items.map((item) => {
    const product = info?.get(item.productId);
    const available =
      !!product && product.sizes.includes(item.size) && (product.colors.length === 0 || product.colors.includes(item.color));
    const unitPrice = product ? (product.salePrice ?? product.price) : item.unitPrice;
    return { item, product, available, unitPrice };
  });
  const orderable = lines.filter((l) => l.available);
  const total = orderable.reduce((sum, l) => sum + l.unitPrice * l.item.qty, 0);
  const checkoutUrl = whatsappLink(
    orderMessage(
      orderable.map((l) => ({
        name: l.product!.name,
        color: l.item.color,
        size: l.item.size,
        qty: l.item.qty,
        unitPrice: l.unitPrice,
      })),
    ),
  );

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-[58px]">
      <ul className="divide-y divide-line border-y border-line">
        {lines.map(({ item, available, unitPrice }) => {
          const key = itemKey(item);
          return (
            <li key={key} className={`flex gap-5 py-6 ${available || loading ? "" : "opacity-60"}`}>
              <Link href={`/p/${item.slug}`} className="relative size-28 shrink-0 bg-tile sm:size-36">
                <ProductImage src={item.image} alt={item.name} sizes="144px" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Link href={`/p/${item.slug}`} className="text-[15px] leading-snug hover:underline">
                  {item.name}
                </Link>
                <p className="text-sm text-muted">
                  {item.color} · Size {item.size}
                </p>
                {!loading && !available && (
                  <p className="text-sm text-red-700">No longer available. Please remove this item.</p>
                )}
                <div className="mt-auto flex flex-wrap items-center gap-4 pt-3">
                  <div className="flex items-center rounded-full border border-line">
                    <button
                      type="button"
                      onClick={() => setQty(key, item.qty - 1)}
                      disabled={item.qty <= 1}
                      aria-label="Decrease quantity"
                      className="p-2.5 disabled:opacity-30"
                    >
                      <Minus className="size-4" strokeWidth={1.5} />
                    </button>
                    <span className="w-6 text-center text-sm" aria-live="polite">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(key, item.qty + 1)}
                      disabled={item.qty >= MAX_QTY}
                      aria-label="Increase quantity"
                      className="p-2.5 disabled:opacity-30"
                    >
                      <Plus className="size-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  <button type="button" onClick={() => remove(key)} className="text-sm text-muted underline">
                    Remove
                  </button>
                </div>
              </div>
              <p className="shrink-0 text-[15px] font-semibold">{formatPrice(unitPrice * item.qty)}</p>
            </li>
          );
        })}
      </ul>

      <aside className="h-fit bg-footer p-7">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <div className="mt-6 flex justify-between text-[15px]">
          <span>Subtotal</span>
          <span>{loading ? "…" : formatPrice(total)}</span>
        </div>
        <div className="mt-3 flex justify-between text-[15px]">
          <span>Delivery</span>
          <span>Free</span>
        </div>
        <div className="mt-6 flex justify-between border-t border-line pt-6 text-[17px] font-semibold">
          <span>Total</span>
          <span>{loading ? "…" : formatPrice(total)}</span>
        </div>

        {loadError && (
          <p role="alert" className="mt-5 text-sm text-red-700">
            Could not check current prices. Please refresh the page.
          </p>
        )}

        {loading || loadError || orderable.length === 0 ? (
          <button
            type="button"
            disabled
            className="mt-7 h-[53px] w-full rounded-full bg-ink text-[15px] text-white opacity-40"
          >
            Checkout via WhatsApp
          </button>
        ) : (
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 flex h-[53px] w-full items-center justify-center rounded-full bg-ink text-[15px] text-white hover:bg-black"
          >
            Checkout via WhatsApp
          </a>
        )}
        <p className="mt-4 text-center text-[13px] leading-relaxed text-muted">
          You will be redirected to WhatsApp to confirm your order and payment with our team.
        </p>
      </aside>
    </div>
  );
}
