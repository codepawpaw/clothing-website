import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingSkeleton, ListingView } from "@/components/ListingView";
import { site } from "@/config/site";
import { applyFilters, buildCategoryTree, getCatalog, parseFilters } from "@/lib/catalog";

export const metadata: Metadata = { title: "New In" };

export default function NewInPage(props: PageProps<"/new-in">) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <NewInListing {...props} />
    </Suspense>
  );
}

async function NewInListing({ searchParams }: PageProps<"/new-in">) {
  const { categories, products } = await getCatalog();
  const newIn = products.filter((p) => p.isNew);
  const filters = parseFilters(await searchParams);
  return (
    <ListingView
      breadcrumbs={[{ label: "New In" }]}
      title={`${site.brandName} New Collection`}
      description={site.tagline}
      heroImage="/placeholder/hero-new-in.svg"
      links={{
        label: "New In",
        items: buildCategoryTree(categories).map((c) => ({ label: c.name, href: `/c/${c.slug}` })),
      }}
      allProducts={newIn}
      products={applyFilters(newIn, filters)}
      filters={filters}
      basePath="/new-in"
    />
  );
}
