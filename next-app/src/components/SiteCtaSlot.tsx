import { getPage } from '@/lib/pages';
import { SiteCta } from './SiteCta';

/**
 * The closing call to action, rendered only when the page's `showCta` flag says
 * so (admin phase 2). The registry registers a `cta` slot on every route and
 * the studio toggles the flag — one switch, not a component per page.
 *
 * The flag lives in `data/pages.json`; this keeps the routes from having to
 * know it, and keeps the markup identical: when the flag is true the output is
 * exactly `<SiteCta />`, when false there is no node at all.
 */
export function SiteCtaSlot({ route }: { route: string }) {
  return getPage(route).showCta ? <SiteCta /> : null;
}
