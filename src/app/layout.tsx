import type { Metadata } from "next";
import localFont from "next/font/local";
import { site } from "@/config/site";
import "./globals.css";

// Metropolis is the typeface lacoste.com uses (open source, from @fontsource/metropolis).
// Self-hosting it makes Safari, Chrome and every device render the same letters.
const metropolis = localFont({
  variable: "--font-metropolis",
  display: "swap",
  src: [
    { path: "../../node_modules/@fontsource/metropolis/files/metropolis-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../../node_modules/@fontsource/metropolis/files/metropolis-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../../node_modules/@fontsource/metropolis/files/metropolis-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../../node_modules/@fontsource/metropolis/files/metropolis-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: { default: site.brandName, template: `%s | ${site.brandName}` },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${metropolis.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
