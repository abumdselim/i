import type { Metadata } from 'next';
import { NAV } from './config';
import { PAGES, type PageEntry } from './content/pages';

export type { PageEntry, PageKind } from './content/pages';
export { PAGES, NAV };
export type { NavItem } from './config';

/**
 * The manifest itself lives in content/pages.ts, beside the capability and
 * product copy. This module is the reading side: lookup by route, the nav
 * mapping, and per-route metadata. Since admin phase 2 the seven links come
 * from `data/site-config.json` through `lib/config.ts` — the studio edits them
 * there, and the header and footer read the same file.
 */

const BY_ROUTE = new Map(PAGES.map((page) => [page.route, page]));
const NAV_BY_HREF = new Map(NAV.map((item) => [item.href, item.key]));

export function getPage(route: string): PageEntry {
  const page = BY_ROUTE.get(route);
  if (!page) throw new Error(`No manifest entry for route ${route}`);
  return page;
}

/**
 * Which nav link is current for a pathname.
 *
 * Read from the manifest's `active` column rather than derived with startsWith:
 * the six capability pages and four product pages are siblings under
 * /custom-software and /shamlai, so a prefix match highlights nothing on ten of
 * the nineteen routes. The manifest also preserves the legacy quirk that
 * /shamlai marks Products as current.
 */
export function navKeyFor(pathname: string): string | null {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const direct = NAV_BY_HREF.get(clean);
  if (direct) return direct;
  return BY_ROUTE.get(clean)?.navKey || null;
}

/**
 * Per-route metadata. Both `alternates.canonical` and `openGraph.url` are set
 * explicitly: neither is derived from the other, and the legacy head wrote
 * og:url for every page.
 */
export function metadataFor(route: string): Metadata {
  const page = getPage(route);
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.route },
    openGraph: {
      type: 'website',
      siteName: 'Intactic',
      title: page.title,
      description: page.description,
      url: page.route,
      images: [
        {
          url: '/assets/img/og-1200x630.png',
          width: 1200,
          height: 630,
          alt: 'Intactic — software engineering studio',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/assets/img/og-1200x630.png'],
    },
    robots: page.robots,
  };
}
