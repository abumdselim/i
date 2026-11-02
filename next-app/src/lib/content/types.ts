import type { IconName } from '@/components/icons';

/**
 * The shape of the capability and product content — the typed literals in
 * `capabilities.ts` and `products.ts`, checked by `satisfies`.
 *
 * Two modelling decisions live here:
 *
 *   - `meta` values are a discriminated union, not a string. A product's domain
 *     is a link and a capability's team size is text; passing HTML through the
 *     data layer would put markup back inside the content.
 *   - every icon is `IconName`, so a name that is missing from the sprite fails
 *     the build instead of rendering an empty 20x20 box.
 */
export type MetaValue =
  | { kind: 'text'; value: string }
  | { kind: 'link'; href: string; label: string };

export interface MetaItem {
  key: string;
  value: MetaValue;
}

export interface ContentItem {
  icon: IconName;
  title: string;
  body: string;
}

export interface RelatedItem {
  href: string;
  label: string;
  num: string;
}

export interface PageContent {
  slug: string;
  num: string;
  icon: IconName;
  h1: string;
  lead: string;
  meta: MetaItem[];
  problemHead: string;
  problem: string[];
  mapCore: string;
  mapNodes: string[];
  items: ContentItem[];
  rules: ContentItem[];
  stack: string[];
  stackNote: string;
  related: RelatedItem[];
}

export interface CapabilityContent extends PageContent {
  nav: string;
  /** How the engagement starts — capability pages only. */
  start: string;
}

export interface ProductContent extends PageContent {
  name: string;
  domain: string;
  card: string;
  builtFor: string[];
}
