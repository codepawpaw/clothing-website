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
  return <p className="mb-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">{children}</p>;
}

export function Footer({ tree }: { tree: CategoryNode[] }) {
  const categoryLinks = tree.map((c) => ({ label: `${c.name} collection`, href: `/c/${c.slug}` }));

  return (
    <footer className="mt-24">
      <div className="mx-auto grid max-w-[1920px] grid-cols-2 gap-y-10 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-14">
        {REASSURANCE.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-4 text-center">
            <Icon className="size-8 text-ink" strokeWidth={1} />
            <p className="max-w-[190px] text-[13px] uppercase text-ink">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-footer">
        <div className="mx-auto grid max-w-[1920px] gap-14 px-4 pb-16 pt-16 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:px-14 lg:pt-[110px]">
          <div>
            <p className="text-[22px] leading-snug text-black lg:text-[26px]">
              <span className="font-semibold">Sign up for new stories,</span>
              <br />
              news and personal offers
            </p>
            <Newsletter />
            <div className="mt-14">
              <SocialIcons />
            </div>
          </div>

          <div>
            <Heading>About {site.brandName}</Heading>
            <ul className="space-y-[18px] text-[15px] text-ink">
              <li><Link href="/new-in" className="hover:underline">New collection</Link></li>
              <li><Link href="/sale" className="hover:underline">Sale</Link></li>
              <li><Link href="/search" className="hover:underline">Search</Link></li>
            </ul>
          </div>

          <div>
            <Heading>Categories</Heading>
            <ul className="space-y-[18px] text-[15px] text-ink">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:underline">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Heading>Help &amp; Contacts</Heading>
            <ul className="space-y-[18px] text-[15px] text-ink">
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
          <p className="mx-auto max-w-[1920px] px-4 py-8 text-[13px] text-muted sm:px-6 lg:px-14">
            © {site.brandName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
