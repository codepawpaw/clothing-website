import Link from "next/link";
import { discountPercent, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProductImage } from "./ProductImage";

export function Badges({ product }: { product: Product }) {
  const pct = discountPercent(product.price, product.salePrice);
  if (!pct && !product.badge) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {pct && (
        <span className="rounded-[3px] bg-sale-badge px-2.5 py-1 text-[12px] leading-none text-white">
          {pct}% off
        </span>
      )}
      {product.badge && (
        <span className="rounded-[3px] bg-badge px-2.5 py-1 text-[12px] leading-none text-white">
          {product.badge}
        </span>
      )}
    </div>
  );
}

export function Price({ product, large = false }: { product: Product; large?: boolean }) {
  // Lacoste shows the product-page price in capitals ("RP1.979.400").
  const size = large ? "text-[18px] uppercase" : "text-[15px]";
  if (product.salePrice !== null && product.salePrice < product.price) {
    return (
      <p className={`flex flex-wrap items-baseline gap-x-3 ${size}`}>
        <span className="font-semibold text-sale">{formatPrice(product.salePrice)}</span>
        <span className="text-[13px] text-muted line-through">{formatPrice(product.price)}</span>
      </p>
    );
  }
  return <p className={`font-semibold text-ink ${size}`}>{formatPrice(product.price)}</p>;
}

export function ProductCard({ product, preload = false }: { product: Product; preload?: boolean }) {
  const extraColours = product.colors.length - 1;
  const [first, second] = product.images;
  const sizes = "(min-width: 1024px) 25vw, 50vw";
  return (
    <Link href={`/p/${product.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-tile">
        <ProductImage src={first} alt={product.name} sizes={sizes} preload={preload} />
        {second && (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <ProductImage src={second} alt="" sizes={sizes} />
          </div>
        )}
        {extraColours > 0 && (
          <span className="absolute bottom-3 left-1.5 bg-white px-3 py-1.5 text-[13px] text-ink sm:left-2">
            + {extraColours} {extraColours === 1 ? "colour" : "colours"}
          </span>
        )}
      </div>
      <div className="mt-3.5">
        <Badges product={product} />
      </div>
      <p className="mt-3 text-[14px] leading-snug text-ink underline-offset-4 group-hover:underline sm:text-[15px]">
        {product.name}
      </p>
      <div className="mt-3">
        <Price product={product} />
      </div>
    </Link>
  );
}
