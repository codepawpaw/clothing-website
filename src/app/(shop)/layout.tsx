import { CartDrawer } from "@/components/CartDrawer";
import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { buildCategoryTree, getCatalog } from "@/lib/catalog";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const { categories } = await getCatalog();
  const tree = buildCategoryTree(categories);
  return (
    <CartProvider>
      <Header tree={tree} />
      <main className="flex-1">{children}</main>
      <Footer tree={tree} />
      <CartDrawer />
    </CartProvider>
  );
}
