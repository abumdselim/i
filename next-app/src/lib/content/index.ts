import { CAPABILITIES, PRODUCTS } from './loader';
import type { CapabilityContent, ProductContent } from './types';

/**
 * The content layer's front door.
 *
 * The data is JSON in `data/` (admin phase 1), validated at import time by the
 * runtime schema — an icon name missing from the sprite fails the build with
 * its JSON path, the successor to the compile-time `satisfies` the typed
 * literals carried. The export names below are unchanged; no consumer import
 * moved. `capabilityBySlug` and `productBySlug` still throw on a missing slug
 * rather than returning partial pages.
 */
export { CAPABILITIES, PRODUCTS };

const CAPABILITY_BY_SLUG = new Map(CAPABILITIES.map((page) => [page.slug, page]));
const PRODUCT_BY_SLUG = new Map(PRODUCTS.map((page) => [page.slug, page]));

export function capabilityBySlug(slug: string): CapabilityContent {
  const page = CAPABILITY_BY_SLUG.get(slug);
  if (!page) throw new Error(`content: no capability "${slug}"`);
  return page;
}

export function productBySlug(slug: string): ProductContent {
  const page = PRODUCT_BY_SLUG.get(slug);
  if (!page) throw new Error(`content: no product "${slug}"`);
  return page;
}

/** Slugs rendered by the shared templated route (src/app/[slug]/page.tsx). */
export const TEMPLATED_SLUGS: string[] = [...CAPABILITIES, ...PRODUCTS].map((page) => page.slug);

export function isCapability(slug: string): boolean {
  return CAPABILITY_BY_SLUG.has(slug);
}

export function isProduct(slug: string): boolean {
  return PRODUCT_BY_SLUG.has(slug);
}

export type { CapabilityContent, ContentItem, MetaItem, MetaValue, PageContent, ProductContent, RelatedItem } from './types';
