import Link from "next/link";
import { CreditCard, Headphones, RotateCcw, Truck } from "lucide-react";
import { site } from "@/config/site";
import type { CategoryNode } from "@/lib/types";
import { whatsappLink } from "@/lib/whatsapp";
import { Newsletter } from "./Newsletter";
import { SocialIcons } from "./SocialIcons";

const REASSURANCE = [
  { icon: RotateCcw, label: "Free returns" },
  { icon: CreditCard, label: "Safe & secure payment" },
  { icon: Truck, label: "Free delivery (T&C applies)" },
  { icon: Headphones, label: "Customer service" },
];

function Heading({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle lg:mb-7">{children}</p>;
}

export function Footer({ tree }: { tree: CategoryNode[] }) {
  const categoryLinks = tree.map((c) => ({ label: `${c.name} collection`, href: `/c/${c.slug}` }));

  return (
    <footer className="mt-24">
      <div className="mx-auto grid max-w-[1920px] grid-cols-2 gap-y-10 border-t border-line px-4 py-10 sm:px-6 lg:grid-cols-4 lg:border-0 lg:px-14 lg:py-12">
        {REASSURANCE.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-4 text-center">
            <Icon className="size-8 text-ink" strokeWidth={1} />
            <p className="max-w-[190px] text-[13px] uppercase text-ink">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-footer">
        {/* Mobile: newsletter centred on top, then About + Help on the left and Categories on the right. */}
        <div className="mx-auto grid max-w-[1920px] grid-cols-2 gap-x-6 gap-y-12 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-14 lg:px-14 lg:pb-16 lg:pt-[110px]">
          <div className="col-span-2 text-center lg:col-span-1 lg:text-left">
            <p className="text-[20px] leading-snug text-black lg:text-[26px]">
              <span className="font-semibold">Sign up for new stories,</span>
              <br />
              news and personal offers
            </p>
            <Newsletter />
            <div className="mt-10 flex justify-center lg:mt-14 lg:block">
              <SocialIcons />
            </div>
          </div>

          <div className="col-start-1 row-start-2 lg:col-auto lg:row-auto">
            <Heading>About {site.brandName}</Heading>
            <ul className="space-y-[18px] text-[13px] text-ink lg:text-[15px]">
              <li><Link href="/new-in" className="hover:underline">New collection</Link></li>
              <li><Link href="/sale" className="hover:underline">Sale</Link></li>
              <li><Link href="/search" className="hover:underline">Search</Link></li>
            </ul>
          </div>

          <div className="col-start-2 row-start-2 row-end-4 lg:col-auto lg:row-auto">
            <Heading>Categories</Heading>
            <ul className="space-y-[18px] text-[13px] text-ink lg:text-[15px]">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:underline">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-start-1 row-start-3 lg:col-auto lg:row-auto">
            <Heading>Help &amp; Contacts</Heading>
            <ul className="space-y-[18px] text-[13px] text-ink lg:text-[15px]">
              <li>
                <a href={`mailto:${site.email}`} className="hover:underline">By email</a>
              </li>
              <li>
                <a href={whatsappLink("Hello!")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:underline">
                  By WhatsApp
                  <span className="inline-block size-[18px] rounded-full bg-[#4fce5d]" aria-hidden />
                </a>
              </li>
              <li>
                <Link href="/cart" className="hover:underline">Shopping bag</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-line">
          <p className="mx-auto max-w-[1920px] px-4 py-8 text-center text-[13px] text-muted sm:px-6 lg:px-14 lg:text-left">
            © {site.brandName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
