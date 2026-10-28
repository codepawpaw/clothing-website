import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { readDatabase } from "@/lib/db";
import { PageHeader, primaryButton, secondaryButton } from "../_components/ui";

export default async function DashboardPage() {
  await requireAdmin();
  const db = await readDatabase();
  const stats = [
    { label: "Kategori", value: db.categories.length, href: "/admin/categories" },
    { label: "Produk", value: db.products.length, href: "/admin/products" },
    { label: "Produk aktif", value: db.products.filter((p) => p.isActive).length, href: "/admin/products" },
    { label: "Pelanggan newsletter", value: db.subscribers.length },
  ];
  const subscribers = [...db.subscribers].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 50);

  return (
    <>
      <PageHeader
        title="Dashboard"
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/categories/new" className={secondaryButton}>
              Tambah kategori
            </Link>
            <Link href="/admin/products/new" className={primaryButton}>
              Tambah produk
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const body = (
            <>
              <p className="text-[13px] text-muted">{s.label}</p>
              <p className="mt-2 text-[32px] font-semibold">{s.value}</p>
            </>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="bg-white p-6 hover:outline hover:outline-line">
              {body}
            </Link>
          ) : (
            <div key={s.label} className="bg-white p-6">
              {body}
            </div>
          );
        })}
      </div>

      <section className="mt-10 bg-white p-6">
        <h2 className="text-lg font-semibold">Pelanggan newsletter terbaru</h2>
        {subscribers.length === 0 ? (
          <p className="mt-4 text-[14px] text-muted">Belum ada yang mendaftar.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line text-[14px]">
            {subscribers.map((s) => (
              <li key={s.email} className="flex justify-between gap-4 py-2.5">
                <span className="truncate">{s.email}</span>
                <span className="shrink-0 text-muted">
                  {new Date(s.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
