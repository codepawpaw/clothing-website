const idr = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

export function formatPrice(value: number): string {
  return `Rp${idr.format(value)}`;
}

export function discountPercent(price: number, salePrice: number | null): number | null {
  if (salePrice === null || salePrice >= price) return null;
  return Math.round((1 - salePrice / price) * 100);
}

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
