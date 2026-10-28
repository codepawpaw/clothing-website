import type { Metadata } from "next";
import Form from "next/form";
import { Suspense } from "react";
import { ListingSkeleton, ListingView } from "@/components/ListingView";
import { applyFilters, getCatalog, parseFilters, searchProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage(props: PageProps<"/search">) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <SearchListing {...props} />
    </Suspense>
  );
}

async function SearchListing({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const q = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim().slice(0, 100) ?? "";
  const { categories, products } = await getCatalog();
  const results = searchProducts(products, categories, q);
  const filters = parseFilters(params);

  return (
    <ListingView
      breadcrumbs={[{ label: "Search" }]}
      title={q ? `Results for “${q}”` : "Search"}
      description={q ? undefined : "Type a product name, category or colour."}
      heroImage="/images/new-in.jpg"
      extra={
        <Form action="/search" className="mt-8 flex max-w-[540px] gap-3">
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Search for a product"
            aria-label="Search"
            className="h-[44px] w-full rounded-full border border-line px-6 text-[15px] outline-none focus:border-ink"
          />
          <button type="submit" className="h-[44px] shrink-0 rounded-full bg-ink px-8 text-[15px] text-white">
            Search
          </button>
        </Form>
      }
      allProducts={results}
      products={applyFilters(results, filters)}
      filters={filters}
      basePath="/search"
      baseQuery={q ? { q } : {}}
    />
  );
}
