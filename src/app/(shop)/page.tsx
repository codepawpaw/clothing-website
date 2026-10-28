import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";
import { site } from "@/config/site";
import { buildCategoryTree, getCatalog } from "@/lib/catalog";

export default async function HomePage() {
  const { categories, products } = await getCatalog();
  const tree = buildCategoryTree(categories);
  const newIn = products.filter((p) => p.isNew).slice(0, 8);

  return (
    <>
      <section className="relative h-[70vh] min-h-[460px] lg:h-[calc(100vh-84px)] lg:max-h-[900px]">
        <ProductImage src="/images/home.jpg" alt="" sizes="100vw" preload />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/35 to-transparent px-4 pb-12 pt-32 text-white sm:px-6 lg:px-14 lg:pb-16">
          <h1 className="text-[30px] font-semibold leading-tight lg:text-[44px]">{site.brandName} New Collection</h1>
          <p className="mt-3 max-w-xl text-[15px] lg:text-base">{site.tagline}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {tree.slice(0, 2).map((c) => (
              <Link
                key={c.id}
                href={`/c/${c.slug}`}
                className="rounded-full bg-white px-8 py-3.5 text-[15px] text-ink hover:bg-footer"
              >
                Shop {c.name}
              </Link>
            ))}
            <Link href="/new-in" className="rounded-full border border-white px-8 py-3.5 text-[15px] hover:bg-white/10">
              New In
            </Link>
          </div>
        </div>
      </section>

      {tree.length > 0 && (
        <section className="mt-16 px-4 sm:px-6 lg:mt-24 lg:px-[55px]">
          <h2 className="mb-8 text-[22px] font-semibold lg:text-[26px]">Shop by category</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-[58px]">
            {tree.map((c) => (
              <Link key={c.id} href={`/c/${c.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-tile">
                  <ProductImage
                    src={c.image ?? "/images/new-in.jpg"}
                    alt={c.name}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-4 text-[15px] underline-offset-4 group-hover:underline">{c.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {newIn.length > 0 && (
        <section className="mt-20 px-4 sm:px-6 lg:mt-28 lg:px-[55px]">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-[22px] font-semibold lg:text-[26px]">New In</h2>
            <Link href="/new-in" className="text-[15px] underline underline-offset-4">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-[58px] lg:gap-y-16">
            {newIn.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-20 grid items-center gap-10 lg:mt-28 lg:grid-cols-2 lg:gap-[58px]">
        <div className="px-4 sm:px-6 lg:pl-[48px] lg:pr-[10%]">
          <h2 className="text-[22px] font-semibold lg:text-[26px]">{site.storyTitle}</h2>
          <p className="mt-6 text-[15px] leading-[1.75] text-subtle lg:text-base">{site.story}</p>
          <Link
            href="/new-in"
            className="mt-8 inline-block rounded-full bg-ink px-10 py-4 text-[15px] text-white hover:bg-black"
          >
            Discover the collection
          </Link>
        </div>
        <div className="relative aspect-[4/5] bg-tile lg:aspect-auto lg:h-[720px]">
          <ProductImage src="/images/story.jpg" alt="" sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </section>
    </>
  );
}
