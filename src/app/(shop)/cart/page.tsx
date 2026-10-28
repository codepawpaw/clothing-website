import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CartView } from "./CartView";

export const metadata: Metadata = { title: "Shopping bag" };

export default function CartPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "Shopping bag" }]} />
      <div className="px-4 sm:px-6 lg:px-[55px]">
        <h1 className="mb-10 text-[22px] font-semibold lg:text-[26px]">Shopping bag</h1>
        <CartView />
      </div>
    </>
  );
}
