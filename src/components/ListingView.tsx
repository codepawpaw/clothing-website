import Link from "next/link";
import { SORT_OPTIONS, filterOptions, type ListingFilters } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { Breadcrumb, type Crumb } from "./Breadcrumb";
import { ProductCard } from "./ProductCard";
import { ProductImage } from "./ProductImage";
import { SortFilterDrawer } from "./SortFilterDrawer";

type Props = {
  breadcrumbs: Crumb[];
  title: string;
  description?: string;
  heroImage: string;
  links?: { label: string; items: { label: string; href: string; active?: boolean }[] };
  /** All products in this listing before filters, used to build the filter options. */
  allProducts: Product[];
  products: Product[];
  filters: ListingFilters;
  basePath: string;
  baseQuery?: Record<string, string>;
  extra?: React.ReactNode;
};

// Number of products shown in the right-hand column next to the hero image.
const BESIDE_HERO = 4;

export function ListingView(props: Props) {
  const { products } = props;
  const beside = products.slice(0, BESIDE_HERO);
  const below = products.slice(BESIDE_HERO);

  return (
    <>
      <Breadcrumb items={props.breadcrumbs} />

      <section className="grid lg:grid-cols-2">
        <div className="relative aspect-[4/3] bg-tile lg:aspect-auto lg:min-h-[760px]">
          <ProductImage src={props.heroImage} alt={props.title} sizes="(min-width: 1024px) 50vw, 100vw" preload />
        </div>

        <div className="px-4 pt-8 sm:px-6 lg:pl-14 lg:pr-[52px] lg:pt-1">
          <h1 className="text-[22px] font-semibold text-ink lg:text-[26px]">{props.title}</h1>
          {props.description && (
            <p className="mt-6 max-w-[540px] text-[15px] leading-[1.75] text-ink lg:text-base">{props.description}</p>
          )}

          {props.links && props.links.items.length > 0 && (
            <div className="mt-9 flex gap-16 text-[15px] lg:text-base">
              <p className="w-20 shrink-0 font-semibold">{props.links.label}</p>
              <ul className="space-y-2.5">
                {props.links.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`hover:underline ${item.active ? "font-semibold underline underline-offset-4" : ""}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {props.extra}

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 lg:mt-[160px]">
            <p className="text-[15px] lg:text-base">
              See {products.length} {products.length === 1 ? "product" : "products"}
            </p>
            <SortFilterDrawer
              basePath={props.basePath}
              baseQuery={props.baseQuery}
              current={props.filters}
              options={filterOptions(props.allProducts)}
              sortOptions={SORT_OPTIONS}
            />
          </div>

          {products.length === 0 ? (
            <p className="mt-10 text-muted">No products match your selection.</p>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:gap-x-14">
              {beside.map((p, i) => (
                <ProductCard key={p.id} product={p} preload={i < 2} />
              ))}
            </div>
          )}
        </div>
      </section>

      {below.length > 0 && (
        <section className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 px-4 sm:gap-x-6 sm:px-6 lg:mt-16 lg:grid-cols-4 lg:gap-x-14 lg:gap-y-16 lg:px-[55px]">
          {below.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </section>
      )}
    </>
  );
}

export function ListingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[62px]" />
      <div className="grid lg:grid-cols-2">
        <div className="aspect-[4/3] bg-tile lg:aspect-auto lg:min-h-[760px]" />
        <div className="space-y-5 px-4 pt-8 lg:pl-14">
          <div className="h-7 w-2/3 bg-tile" />
          <div className="h-4 w-full max-w-[540px] bg-tile" />
          <div className="h-4 w-1/2 bg-tile" />
        </div>
      </div>
    </div>
  );
}
