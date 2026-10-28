import { site } from "@/config/site";
import { formatPrice } from "./format";

export function whatsappLink(text: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export type OrderLine = {
  name: string;
  color: string;
  size: string;
  qty: number;
  unitPrice: number;
};

export function orderMessage(lines: OrderLine[]): string {
  const total = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
  const body = lines
    .map(
      (l, i) =>
        `${i + 1}. ${l.name}\n` +
        `   Warna: ${l.color} | Ukuran: ${l.size} | Qty: ${l.qty}\n` +
        `   ${formatPrice(l.unitPrice)} x ${l.qty} = ${formatPrice(l.unitPrice * l.qty)}`,
    )
    .join("\n\n");
  return `Halo ${site.brandName}, saya ingin memesan:\n\n${body}\n\nTotal: ${formatPrice(total)}\n\nMohon info ketersediaan dan cara pembayarannya. Terima kasih!`;
}
