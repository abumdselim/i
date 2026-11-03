import type { IconName } from '@/components/icons';

/**
 * The shape of the content — the types the JSON in `data/` is validated
 * against at runtime (src/lib/content/schema.ts). Until admin phase 1 the
 * values were typed literals checked by `satisfies`; the types survived that
 * move unchanged (docs/admin.md §6, decision D-16).
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

/**
 * The route manifest entry (moved here from pages.ts in admin phase 1; the
 * data itself lives in data/pages.json).
 */
export type PageKind = 'home' | 'page' | 'capability' | 'product' | 'hub' | 'not-found';

export interface PageEntry {
  /** Route without the leading slash; '' for the home page. */
  slug: string;
  /** Legacy output file, kept so the parity gate can diff route by route. */
  file: string;
  route: string;
  title: string;
  description: string;
  robots: string;
  navKey: string;
  kind: PageKind;
  showCta: boolean;
}

/**
 * Figure geometry (moved here from figures.ts in admin phase 1; the data
 * itself lives in data/figures.json).
 *
 * The figures are the same module lattice the legacy build drew: a fixed pitch,
 * a class per cell, and a handful of connector paths. Storing geometry instead
 * of markup lets one component render them while the parity gate still compares
 * the result element by element. Values come from the legacy figure builder;
 * edit them only with a matching visual diff.
 */
export interface FigureRect {
  cls: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FigurePath {
  cls: string;
  d: string;
}

export interface FigureGeometry {
  viewBox: string;
  rects: FigureRect[];
  paths: FigurePath[];
}

export interface PlateCell {
  cls: string;
  index: number;
}

export interface PlateLayer {
  name: string;
  meta: string;
  cells: PlateCell[];
}

/** The five sector marks drawn for the industries grid (components/IndustryIcon). */
export type IndustryMark = 'store' | 'capsule' | 'balance' | 'parcel' | 'archive';

export interface Industry {
  num: string;
  icon: string;
  title: string;
  body: string;
  /** The sector's own silhouette; the grid shows it instead of a photograph. */
  mark: IndustryMark;
}

export interface StackGroup {
  group: string;
  items: { label: string; slug: string }[];
}

/**
 * The case-study section's content (data/case-studies.json).
 *
 * A card is either a `live` engagement — the platform is in production and the
 * card may carry its wordmark — or an `illustrative` one: a representative
 * shape of work, labelled as such on the page so no reader takes it for a
 * client. There is one model because the studio edits one list.
 */
export type CaseStudyKind = 'live' | 'illustrative';

export interface CaseStudyLogo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface CaseStudySpec {
  label: string;
  value: string;
}

export interface CaseStudyLink {
  label: string;
  href: string;
  /** `true` renders a plain anchor with target=_blank; `false` a Next Link. */
  external: boolean;
}

export interface CaseStudy {
  id: string;
  kind: CaseStudyKind;
  /** The card's mono index, e.g. "CS/01". */
  num: string;
  client: string;
  /** One line under the client name: sector and shape of the engagement. */
  line: string;
  icon: IconName;
  /** The client's wordmark, supplied by the client; null for illustrative cards. */
  logo: CaseStudyLogo | null;
  summary: string[];
  /** Operator-published figures or an attribution line; empty renders nothing. */
  note: string;
  tags: string[];
  spec: CaseStudySpec[];
  link: CaseStudyLink;
}

export interface CaseStudiesData {
  head: { eyebrow: string; title: string; lead: string };
  cta: { title: string; body: string; label: string; href: string };
  cases: CaseStudy[];
}
