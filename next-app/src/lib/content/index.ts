import { CAPABILITIES } from './capabilities';
import { PRODUCTS } from './products';
import type { CapabilityContent, ProductContent } from './types';

/**
 * The content layer's front door.
 *
 * The pages are typed literals next door (capabilities.ts, products.ts), so an
 * icon name that is missing from the sprite is a compile error rather than a
 * blank square at render time — the runtime guard that used to resolve JSON
 * strings has nothing left to check.
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
