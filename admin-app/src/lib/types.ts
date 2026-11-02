/**
 * The shapes the studio reads and writes. They mirror the site's content layer
 * (`next-app/src/lib/content/types.ts` and `next-app/data/*.json`); the studio
 * keeps its own copy because it is a separate application and must not import
 * the site's bundler-resolved modules. `site.ts` is the only reader/writer.
 */

export type PageKind = 'home' | 'page' | 'capability' | 'product' | 'hub' | 'not-found';

export interface PageEntry {
  slug: string;
  file: string;
  route: string;
  title: string;
  description: string;
  robots: string;
  navKey: string;
  kind: PageKind;
  showCta: boolean;
}

export type SectionKind = 'head' | 'hero' | 'content' | 'grid' | 'list' | 'faq' | 'cta';
export type SectionMount = 'body' | 'shell';

export interface SectionDefinition {
  page: string;
  id: string;
  title: string;
  kind: SectionKind;
  mount: SectionMount;
  locked: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  key: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SiteConfig {
  version: number;
  hidden: { route: string; id: string }[];
  order: Record<string, string[]>;
  nav: NavItem[];
  footer: {
    brand: { blurb: string; email: string };
    columns: FooterColumn[];
  };
}

export interface MetaValue {
  kind: 'text';
  value: string;
}

export interface MetaLink {
  kind: 'link';
  href: string;
  label: string;
}

export interface MetaItem {
  key: string;
  value: MetaValue | MetaLink;
}

export interface ContentItem {
  icon: string;
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
  icon: string;
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
  start: string;
}

export interface ProductContent extends PageContent {
  name: string;
  domain: string;
  card: string;
  builtFor: string[];
}

export type ContentType = 'capability' | 'product';

export interface SpriteIcon {
  name: string;
  viewBox: string;
  body: string;
}

export interface PlannedSection extends SectionDefinition {
  hidden: boolean;
}
