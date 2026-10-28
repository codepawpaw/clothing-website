"use client";

import Form from "next/form";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { site } from "@/config/site";
import type { CategoryNode } from "@/lib/types";
import { useCart } from "./CartProvider";

type NavItem = { label: string; href: string; children: { label: string; href: string }[] };

function buildNav(tree: CategoryNode[]): NavItem[] {
  return [
    { label: "New In", href: "/new-in", children: [] },
    ...tree.map((c) => ({
      label: c.name,
      href: `/c/${c.slug}`,
      children: c.children.map((child) => ({ label: child.name, href: `/c/${child.slug}` })),
    })),
    { label: "Sale", href: "/sale", children: [] },
  ];
}

export function Header({ tree }: { tree: CategoryNode[] }) {
  const nav = buildNav(tree);
  const { count, openDrawer } = useCart();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Close every overlay once a link inside the header is followed.
  const closeOnLinkClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) {
      setOpenMenu(null);
      setMobileOpen(false);
      setSearchOpen(false);
    }
  };

  useEffect(() => {
    if (!mobileOpen && !searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen, searchOpen]);

  const show = (label: string) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const hide = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const active = nav.find((n) => n.label === openMenu && n.children.length > 0);

  return (
    <header className="sticky top-0 z-40 bg-white" onClickCapture={closeOnLinkClick}>
      <div className="mx-auto flex h-[72px] max-w-[1920px] items-center px-4 sm:px-6 lg:h-[84px] lg:px-14">
        <button
          type="button"
          className="-ml-2 mr-2 p-2 lg:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="size-6" strokeWidth={1.25} />
        </button>

        <Link href="/" className="text-[22px] font-bold tracking-[0.06em] text-black lg:text-[26px]">
          {site.brandName}
        </Link>

        <nav className="ml-auto mr-auto hidden h-full items-center gap-8 lg:flex xl:gap-10" aria-label="Main">
          {nav.map((item) => (
            <div
              key={item.label}
              className="flex h-full items-center"
              onMouseEnter={() => (item.children.length ? show(item.label) : setOpenMenu(null))}
              onMouseLeave={hide}
            >
              <Link
                href={item.href}
                className="flex items-center gap-2 text-[15px] text-ink underline-offset-8 hover:underline"
                aria-expanded={item.children.length ? openMenu === item.label : undefined}
                onFocus={() => item.children.length && show(item.label)}
              >
                {item.label}
                {item.children.length > 0 && <ChevronDown className="size-4" strokeWidth={1.25} />}
              </Link>
            </div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-3 lg:ml-0">
          <button type="button" className="p-2" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <Search className="size-6" strokeWidth={1.25} />
          </button>
          <Link href="/admin" className="hidden p-2 sm:block" aria-label="Account">
            <User className="size-6" strokeWidth={1.25} />
          </Link>
          <button type="button" className="relative p-2" aria-label={`Shopping bag, ${count} items`} onClick={openDrawer}>
            <ShoppingBag className="size-6" strokeWidth={1.25} />
            <span className="absolute right-0.5 top-0.5 flex size-[17px] items-center justify-center rounded-full bg-ink text-[10px] font-medium text-white">
              {count > 99 ? "99" : count}
            </span>
          </button>
        </div>
      </div>

      {/* Mega menu */}
      {active && (
        <div
          className="absolute inset-x-0 top-full hidden border-t border-line bg-white shadow-[0_12px_24px_-12px_rgba(0,0,0,0.15)] lg:block"
          onMouseEnter={() => show(active.label)}
          onMouseLeave={hide}
        >
          <div className="mx-auto flex max-w-[1920px] gap-24 px-14 py-10">
            <div>
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">{active.label}</p>
              <ul className="space-y-3">
                <li>
                  <Link href={active.href} className="text-[15px] font-semibold text-ink hover:underline">
                    See all
                  </Link>
                </li>
                {active.children.map((child) => (
                  <li key={child.href}>
                    <Link href={child.href} className="text-[15px] text-ink hover:underline">
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
      {mobileOpen && <MobileNav nav={nav} onClose={() => setMobileOpen(false)} />}
    </header>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white px-4 py-8 sm:px-6 lg:px-14">
        <Form action="/search" onSubmit={onClose} className="mx-auto flex max-w-3xl items-center gap-4 border-b border-ink pb-3">
          <Search className="size-6 shrink-0" strokeWidth={1.25} />
          <input
            name="q"
            type="search"
            autoFocus
            placeholder="Search for a product"
            aria-label="Search"
            className="w-full bg-transparent text-lg outline-none"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="p-1">
            <X className="size-6" strokeWidth={1.25} />
          </button>
        </Form>
      </div>
    </div>
  );
}

function MobileNav({ nav, onClose }: { nav: NavItem[]; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col overflow-y-auto bg-white">
        <div className="flex h-[72px] items-center justify-between border-b border-line px-4">
          <span className="text-[22px] font-bold tracking-[0.06em] text-black">{site.brandName}</span>
          <button type="button" onClick={onClose} aria-label="Close menu" className="p-2">
            <X className="size-6" strokeWidth={1.25} />
          </button>
        </div>
        <ul className="px-4 py-2">
          {nav.map((item) => (
            <li key={item.label} className="border-b border-line">
              {item.children.length === 0 ? (
                <Link href={item.href} className="block py-4 text-base">
                  {item.label}
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-4 text-base"
                    aria-expanded={expanded === item.label}
                    onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown
                      className={`size-5 transition-transform ${expanded === item.label ? "rotate-180" : ""}`}
                      strokeWidth={1.25}
                    />
                  </button>
                  {expanded === item.label && (
                    <ul className="space-y-3 pb-4 pl-4">
                      <li>
                        <Link href={item.href} className="font-semibold">
                          See all
                        </Link>
                      </li>
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href}>{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
          <li>
            <Link href="/admin" className="block py-4 text-base">
              Account
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
