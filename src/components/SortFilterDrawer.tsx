"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { ListingFilters, SortKey } from "@/lib/catalog";

type Props = {
  basePath: string;
  baseQuery?: Record<string, string>; // e.g. { q } on the search page
  current: ListingFilters;
  options: { sizes: string[]; colors: { name: string; hex: string }[] };
  sortOptions: { value: SortKey; label: string }[];
};

export function SortFilterDrawer({ basePath, baseQuery = {}, current, options, sortOptions }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState(current.sort);
  const [sizes, setSizes] = useState(current.sizes);
  const [colors, setColors] = useState(current.colors.map((c) => c.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openDrawer = () => {
    setSort(current.sort);
    setSizes(current.sizes);
    setColors(current.colors.map((c) => c.toLowerCase()));
    setOpen(true);
  };

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const apply = (next: { sort: SortKey; sizes: string[]; colors: string[] }) => {
    const params = new URLSearchParams(baseQuery);
    if (next.sort !== "newest") params.set("sort", next.sort);
    next.sizes.forEach((s) => params.append("size", s));
    next.colors.forEach((c) => params.append("color", c));
    const qs = params.toString();
    setOpen(false);
    router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
  };

  const activeCount = current.sizes.length + current.colors.length + (current.sort !== "newest" ? 1 : 0);

  return (
    <>
      <button
        type="button"
        onClick={openDrawer}
        className="flex h-[44px] items-center gap-4 self-center rounded-full border border-line bg-white px-[30px] text-[15px] text-ink hover:border-ink lg:self-auto lg:border-0 lg:bg-ink lg:px-10 lg:text-white lg:hover:bg-black"
      >
        <SlidersHorizontal className="size-5" strokeWidth={1.25} />
        Sort and filter{activeCount > 0 && ` (${activeCount})`}
      </button>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Sort and filter">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-white">
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <p className="text-lg">Sort and filter</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="p-1">
                <X className="size-6" strokeWidth={1.25} />
              </button>
            </div>

            <div className="flex-1 space-y-9 overflow-y-auto px-6 py-7">
              <fieldset>
                <legend className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">Sort by</legend>
                <div className="space-y-3">
                  {sortOptions.map((o) => (
                    <label key={o.value} className="flex cursor-pointer items-center gap-3 text-[15px]">
                      <input
                        type="radio"
                        name="sort"
                        checked={sort === o.value}
                        onChange={() => setSort(o.value)}
                        className="size-4 accent-ink"
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {options.sizes.length > 0 && (
                <fieldset>
                  <legend className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">Size</legend>
                  <div className="flex flex-wrap gap-2">
                    {options.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={sizes.includes(s)}
                        onClick={() => setSizes(toggle(sizes, s))}
                        className={`min-w-12 rounded-full border px-4 py-2 text-sm ${
                          sizes.includes(s) ? "border-ink bg-ink text-white" : "border-line hover:border-ink"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}

              {options.colors.length > 0 && (
                <fieldset>
                  <legend className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">Colour</legend>
                  <div className="grid grid-cols-2 gap-3">
                    {options.colors.map((c) => {
                      const key = c.name.toLowerCase();
                      return (
                        <label key={key} className="flex cursor-pointer items-center gap-3 text-[15px]">
                          <input
                            type="checkbox"
                            checked={colors.includes(key)}
                            onChange={() => setColors(toggle(colors, key))}
                            className="size-4 accent-ink"
                          />
                          <span className="size-4 rounded-full border border-line" style={{ background: c.hex }} />
                          {c.name}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}
            </div>

            <div className="flex gap-3 border-t border-line px-6 py-5">
              <button
                type="button"
                onClick={() => apply({ sort: "newest", sizes: [], colors: [] })}
                className="flex-1 rounded-full border border-line py-3.5 text-[15px] hover:border-ink"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => apply({ sort, sizes, colors })}
                className="flex-1 rounded-full bg-ink py-3.5 text-[15px] text-white hover:bg-black"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
