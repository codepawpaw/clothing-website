"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { site } from "@/config/site";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import { Badges, Price } from "./ProductCard";

export function ProductPurchase({ product }: { product: Product }) {
  const { add, openDrawer } = useCart();
  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState<string | null>(product.sizes.length === 1 ? product.sizes[0] : null);
  const [sizesOpen, setSizesOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const color = product.colors[colorIndex];

  const chooseSize = (s: string) => {
    setSize(s);
    setSizesOpen(false);
    setError(null);
  };

  const addToBag = () => {
    if (!size) {
      setSizesOpen(true);
      setError("Please select a size.");
      return;
    }
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? null,
      color: color?.name ?? "-",
      size,
      qty: 1,
      unitPrice: product.salePrice ?? product.price,
    });
    setError(null);
    openDrawer();
  };

  const sizePill = (s: string) => (
    <button
      key={s}
      type="button"
      onClick={() => chooseSize(s)}
      aria-pressed={size === s}
      className={`h-[44px] min-w-[96px] shrink-0 rounded-full border px-5 text-[15px] lg:h-auto lg:min-w-14 lg:px-4 lg:py-2.5 lg:text-sm ${
        size === s ? "border-ink bg-ink text-white" : "border-line hover:border-ink"
      }`}
    >
      {s}
    </button>
  );

  return (
    <div>
      <Badges product={product} />
      <h1 className="mt-3 text-[18px] leading-snug text-ink lg:text-[22px]">{product.name}</h1>

      <div className="mt-6 flex items-start justify-between gap-6 lg:mt-8">
        {color && (
          <p className="flex items-center gap-2.5 text-[13px] uppercase lg:text-[15px]">
            <span className="size-3 rounded-full border border-line" style={{ background: color.hex }} />
            {color.name}
          </p>
        )}
        <div className="ml-auto text-right [&_p]:flex-col [&_p]:items-end [&_p]:gap-1">
          <Price product={product} large />
        </div>
      </div>

      <div className="-mx-[30px] mt-5 border-t border-line px-[30px] pt-6 lg:mx-0 lg:mt-0 lg:border-0 lg:px-0 lg:pt-0">
        {product.colors.length > 1 && (
          <p className="text-[15px] lg:mt-6 lg:text-[17px]">{product.colors.length} colours available</p>
        )}
        {product.colors.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {product.colors.map((c, i) => (
              <button
                key={c.name + i}
                type="button"
                onClick={() => setColorIndex(i)}
                aria-label={c.name}
                aria-pressed={i === colorIndex}
                title={c.name}
                className={`flex size-[34px] items-center justify-center rounded-full border ${
                  i === colorIndex ? "border-ink" : "border-transparent hover:border-muted lg:border-line"
                }`}
              >
                <span className="size-[26px] rounded-full border border-black/5" style={{ background: c.hex }} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile: sizes always visible as pills */}
      <div className="mt-6 lg:hidden">
        <p className="text-[15px]">
          {size ? (
            <>
              Selected size — <span className="font-semibold">{size}</span>
            </>
          ) : (
            "Select a size"
          )}
        </p>
        <div className="-mx-[30px] mt-4 flex gap-2.5 overflow-x-auto px-[30px] pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {product.sizes.map(sizePill)}
        </div>
      </div>

      {/* Desktop: "Select a size" pill that opens the sizes */}
      <div className="mt-3 hidden lg:block">
        <button
          type="button"
          onClick={() => setSizesOpen(!sizesOpen)}
          aria-expanded={sizesOpen}
          className="flex h-[43px] w-full max-w-[196px] items-center justify-between rounded-full border border-line px-7 text-[15px] hover:border-ink"
        >
          {size ? `Size: ${size}` : "Select a size"}
          <ChevronRight className={`size-5 transition-transform ${sizesOpen ? "rotate-90" : ""}`} strokeWidth={1.25} />
        </button>
        {sizesOpen && <div className="mt-4 flex flex-wrap gap-2">{product.sizes.map(sizePill)}</div>}
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="-mx-[30px] mt-6 border-t border-line px-4 pt-7 lg:mx-0 lg:mt-8 lg:border-0 lg:px-0 lg:pt-0">
        <button
          type="button"
          onClick={addToBag}
          // Lacoste turns the button green once a size is chosen.
          className={`h-[54px] w-full rounded-full text-[15px] text-white transition-colors lg:h-[53px] lg:text-[16px] ${
            size ? "bg-cta hover:bg-cta-dark" : "bg-ink hover:bg-black"
          }`}
        >
          Add to shopping bag
        </button>
      </div>

      <div className="mt-6 space-y-1.5 text-center text-[15px] leading-relaxed text-muted">
        {site.delivery.map((line, i) => (
          <p key={line}>
            {i === 0 && line.startsWith("FREE") ? (
              <>
                <span className="font-semibold">FREE</span>
                {line.slice(4)}
              </>
            ) : (
              line
            )}
          </p>
        ))}
      </div>
    </div>
  );
}
