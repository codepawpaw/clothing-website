import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ListingSkeleton, ListingView } from "@/components/ListingView";
import { applyFilters, categoryScope, getCatalog, parseFilters } from "@/lib/catalog";

export async function generateMetadata({ params }: PageProps<"/c/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { categories } = await getCatalog();
  const category = categories.find((c) => c.slug === slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default function CategoryPage(props: PageProps<"/c/[slug]">) {
  return (
    <Suspense fallback={<ListingSkeleton />}>
      <CategoryListing {...props} />
    </Suspense>
  );
}

async function CategoryListing({ params, searchParams }: PageProps<"/c/[slug]">) {
  const { slug } = await params;
  const { categories, products } = await getCatalog();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const parent = category.parentId ? categories.find((c) => c.id === category.parentId) : undefined;
  const scope = categoryScope(categories, category.id);
  const inCategory = products.filter((p) => scope.has(p.categoryId));
  const filters = parseFilters(await searchParams);

  // A top-level category lists its sub-categories; a sub-category lists its siblings.
  const group = parent ?? category;
  const children = categories.filter((c) => c.parentId === group.id);

  return (
    <ListingView
      breadcrumbs={[
        ...(parent ? [{ label: parent.name, href: `/c/${parent.slug}` }] : []),
        { label: category.name },
      ]}
      title={parent ? `${parent.name} ${category.name}` : category.name}
      description={category.description}
      heroImage={category.image ?? parent?.image ?? "/placeholder/hero-new-in.svg"}
      links={{
        label: group.name,
        items: children.map((c) => ({ label: c.name, href: `/c/${c.slug}`, active: c.id === category.id })),
      }}
      allProducts={inCategory}
      products={applyFilters(inCategory, filters)}
      filters={filters}
      basePath={`/c/${category.slug}`}
    />
  );
}
