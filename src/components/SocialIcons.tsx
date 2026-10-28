import { site } from "@/config/site";

// Simple brand glyphs (lucide-react no longer ships brand icons).
const ICONS: Record<keyof typeof site.social, { label: string; path: React.ReactNode }> = {
  instagram: {
    label: "Instagram",
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
      </>
    ),
  },
  facebook: {
    label: "Facebook",
    path: <path fill="currentColor" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />,
  },
  x: {
    label: "X",
    path: <path fill="currentColor" d="M17.8 3h3l-6.6 7.6L22 21h-6.1l-4.8-6.3L5.6 21h-3l7.1-8.1L2.2 3h6.2l4.3 5.7L17.8 3zm-1 16.2h1.7L7.3 4.7H5.5l11.3 14.5z" />,
  },
  tiktok: {
    label: "TikTok",
    path: <path fill="currentColor" d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v2.8c-1.4.1-2.6-.3-3.9-1.1v5.7c0 7.3-8 9.6-11.2 4.4-2.1-3.4-.8-9.3 5.9-9.5v3c-.5.1-1.1.2-1.6.4-1.5.5-2.4 1.5-2.1 3.2.5 3.2 6.4 4.2 5.9-2.1V3h3.1z" />,
  },
  youtube: {
    label: "YouTube",
    path: <path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" />,
  },
};

export function SocialIcons() {
  const entries = (Object.keys(site.social) as (keyof typeof site.social)[]).filter((k) => site.social[k]);
  return (
    <ul className="flex flex-wrap gap-8 sm:gap-11">
      {entries.map((key) => (
        <li key={key}>
          <a
            href={site.social[key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ICONS[key].label}
            className="block text-icon hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="size-[22px]" aria-hidden>
              {ICONS[key].path}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
