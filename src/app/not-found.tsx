import Link from "next/link";
import { site } from "@/config/site";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-32 text-center">
      <Link href="/" className="text-[26px] font-bold tracking-[0.06em] text-black">
        {site.brandName}
      </Link>
      <h1 className="text-[22px] font-semibold">Page not found</h1>
      <p className="max-w-md text-muted">The page you are looking for does not exist.</p>
      <Link href="/" className="rounded-full bg-ink px-10 py-4 text-[15px] text-white hover:bg-black">
        Back to home
      </Link>
    </div>
  );
}
