import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="px-4 py-5 text-[13px] text-muted sm:px-6 lg:px-[50px] lg:py-6">
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        {[{ label: "Home", href: "/" }, ...items].map((item, i, all) => (
          <li key={i} className="flex items-center gap-2.5">
            {item.href && i < all.length - 1 ? (
              <Link href={item.href} className="underline underline-offset-2 hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
            {i < all.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
