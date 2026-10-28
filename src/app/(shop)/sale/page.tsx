import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingSkeleton, ListingView } from "@/components/ListingView";
import { applyFilters, getCatalog, parseFilters } from "@/lib/catalog";

export const metadata: Metadata = { title: "Sale" };

export default function SalePage(props: PageProps<"/sale">) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <SaleListing {...props} />
    </Suspense>
  );
}

async function SaleListing({ searchParams }: PageProps<"/sale">) {
  const { products } = await getCatalog();
  const onSale = products.filter((p) => p.salePrice !== null && p.salePrice < p.price);
  const filters = parseFilters(await searchParams);
  return (
    <ListingView
      breadcrumbs={[{ label: "Sale" }]}
      title="Sale"
      description="Selected pieces at reduced prices, while stocks last."
      heroImage="/images/sale.jpg"
      allProducts={onSale}
      products={applyFilters(onSale, filters)}
      filters={filters}
      basePath="/sale"
    />
  );
}
