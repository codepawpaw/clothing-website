import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { readDatabase } from "@/lib/db";
import { ProductForm } from "../../../_components/ProductForm";
import { PageHeader } from "../../../_components/ui";
import { categoryOptions } from "../category-options";

export const metadata: Metadata = { title: "Tambah produk" };

export default async function NewProductPage() {
  await requireAdmin();
  const { categories } = await readDatabase();
  return (
    <>
      <PageHeader title="Tambah produk" />
      {categories.length === 0 ? (
        <p className="bg-white p-6 text-[15px]">
          Buat kategori dulu sebelum menambah produk.{" "}
          <Link href="/admin/categories/new" className="underline">
            Tambah kategori
          </Link>
        </p>
      ) : (
        <ProductForm categories={categoryOptions(categories)} />
      )}
    </>
  );
}
