import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductImage } from "@/components/ProductImage";
import { ProductPurchase } from "@/components/ProductPurchase";
import { site } from "@/config/site";
import { categoryScope, getCatalog } from "@/lib/catalog";

export async function generateMetadata({ params }: PageProps<"/p/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { products } = await getCatalog();
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: product.images[0] ? { images: [product.images[0]] } : undefined,
  };
}

export default function ProductPage(props: PageProps<"/p/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetails {...props} />
    </Suspense>
  );
}

async function ProductDetails({ params }: PageProps<"/p/[slug]">) {
  const { slug } = await params;
  const { categories, products } = await getCatalog();
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const category = categories.find((c) => c.id === product.categoryId);
  const parent = category?.parentId ? categories.find((c) => c.id === category.parentId) : undefined;
  const scope = categoryScope(categories, parent?.id ?? product.categoryId);
  const related = products.filter((p) => p.id !== product.id && scope.has(p.categoryId)).slice(0, 4);
  const detailImages = product.images.slice(1);

  return (
    <>
      <Breadcrumb
        items={[
          ...(parent ? [{ label: parent.name, href: `/c/${parent.slug}` }] : []),
          ...(category ? [{ label: category.name, href: `/c/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <section className="grid lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />
        <div className="px-4 pt-8 sm:px-6 lg:px-[8%] lg:pt-[56px] xl:px-[160px]">
          <div className="lg:sticky lg:top-[120px]">
            <ProductPurchase product={product} />
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-10 px-4 sm:px-6 lg:mt-24 lg:grid-cols-2 lg:gap-[58px] lg:px-[48px]">
        <div className="lg:pr-[10%]">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">Description</h2>
          <p className="mt-5 whitespace-pre-line text-[15px] leading-[1.75] text-subtle lg:text-base">
            {product.description}
          </p>
          <h2 className="mt-12 text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">
            {site.storyTitle}
          </h2>
          <p className="mt-5 text-[15px] leading-[1.75] text-subtle lg:text-base">{site.story}</p>
        </div>
        {detailImages.length > 0 && (
          <div className="grid gap-10 sm:grid-cols-1 lg:gap-[58px]">
            {detailImages.slice(0, 1).map((src) => (
              <div key={src} className="relative aspect-square bg-tile">
                <ProductImage src={src} alt={product.name} sizes="(min-width: 1024px) 50vw, 100vw" />
              </div>
            ))}
          </div>
        )}
      </section>

      {detailImages.length > 1 && (
        <section className="mt-10 grid gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:mt-[58px] lg:gap-[58px] lg:px-[48px]">
          {detailImages.slice(1).map((src) => (
            <div key={src} className="relative aspect-square bg-tile">
              <ProductImage src={src} alt={product.name} sizes="(min-width: 640px) 50vw, 100vw" />
            </div>
          ))}
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-24 px-4 sm:px-6 lg:px-[55px]">
          <h2 className="mb-8 text-[22px] font-semibold">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-14">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[62px]" />
      <div className="grid lg:grid-cols-2">
        <div className="aspect-square bg-tile lg:aspect-auto lg:h-[calc(100vh-84px)]" />
        <div className="space-y-5 px-4 pt-14 lg:px-[160px]">
          <div className="h-6 w-2/3 bg-tile" />
          <div className="h-5 w-1/3 bg-tile" />
          <div className="mt-10 h-[53px] w-full rounded-full bg-tile" />
        </div>
      </div>
    </div>
  );
}
