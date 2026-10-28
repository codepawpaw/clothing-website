import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, FolderTree, LayoutDashboard, LogOut, Shirt } from "lucide-react";
import { site } from "@/config/site";
import { logout } from "../actions";

export const metadata: Metadata = {
  title: { default: "Admin", template: `%s | Admin ${site.brandName}` },
  robots: { index: false },
};

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Kategori", icon: FolderTree },
  { href: "/admin/products", label: "Produk", icon: Shirt },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-footer lg:flex-row">
      <aside className="flex shrink-0 flex-col bg-white lg:sticky lg:top-0 lg:h-screen lg:w-[240px] lg:border-r lg:border-line">
        <div className="flex items-center justify-between px-6 py-5 lg:block lg:py-7">
          <Link href="/admin" className="text-[22px] font-bold tracking-[0.06em] text-black">
            {site.brandName}
          </Link>
          <p className="text-[12px] uppercase tracking-[0.18em] text-muted lg:mt-1">Admin</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-y border-line px-3 py-2 lg:flex-1 lg:flex-col lg:border-0 lg:py-0">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-[15px] hover:bg-footer"
            >
              <Icon className="size-[18px]" strokeWidth={1.5} />
              {label}
            </Link>
          ))}
          <Link
            href="/"
            target="_blank"
            className="flex shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-[15px] hover:bg-footer"
          >
            <ExternalLink className="size-[18px]" strokeWidth={1.5} />
            Lihat toko
          </Link>
          <form action={logout} className="lg:mt-auto lg:pb-6">
            <button
              type="submit"
              className="flex w-full shrink-0 items-center gap-3 rounded-full px-4 py-2.5 text-[15px] hover:bg-footer"
            >
              <LogOut className="size-[18px]" strokeWidth={1.5} />
              Keluar
            </button>
          </form>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-10">{children}</main>
    </div>
  );
}
