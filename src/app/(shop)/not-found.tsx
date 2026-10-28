import Link from "next/link";

export default function ShopNotFound() {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-32 text-center">
      <h1 className="text-[26px] font-semibold">Page not found</h1>
      <p className="max-w-md text-muted">The page or product you are looking for no longer exists.</p>
      <Link href="/" className="rounded-full bg-ink px-10 py-4 text-[15px] text-white hover:bg-black">
        Back to home
      </Link>
    </div>
  );
}
