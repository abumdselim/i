import rawConfig from '../../data/site-config.json';
import { SECTIONS, type SectionDefinition } from './sections';

/**
 * The site config's front door (admin phase 2, docs/admin.md §6).
 *
 * `data/site-config.json` holds the three things the studio will edit outside
 * the page bodies: which sections are hidden, the order they render in, and the
 * navigation and footer. This module validates that file against the section
 * registry, then answers the only question the pages ask — which sections, in
 * what order. The registry is the single source: a route key or section id in
 * the config that the registry does not know is a build error, never a silent
 * no-op, and a locked section cannot be hidden or moved.
 *
 * Validation runs once at import time, before any page is emitted, so a bad
 * config fails `next build` with the JSON path in the message — the same
 * contract `content/schema.ts` gives the content files.
 */

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

export interface SiteFooterConfig {
  brand: { blurb: string; email: string };
  columns: FooterColumn[];
}

export interface SiteConfig {
  version: number;
  /** `{ route, id }` pairs; a section is hidden on that route only. */
  hidden: { route: string; id: string }[];
  /** Route → section ids, in render order. Missing ids keep registry order. */
  order: Record<string, string[]>;
  nav: NavItem[];
  footer: SiteFooterConfig;
}

export interface PlannedSection extends SectionDefinition {
  hidden: boolean;
}

/* ------------------------------------------------------------- primitives */

function fail(path: string, message: string): never {
  throw new Error(`site-config: ${path} — ${message}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function text(value: unknown, path: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(path, 'must be a non-empty string');
  }
  return value;
}

function list(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) fail(path, 'must be an array');
  return value;
}

/* --------------------------------------------------------------- registry */

const BY_PAGE = new Map<string, SectionDefinition[]>();
for (const section of SECTIONS) {
  const page = BY_PAGE.get(section.page);
  if (page) page.push(section);
  else BY_PAGE.set(section.page, [section]);
}

function definitions(route: string): SectionDefinition[] {
  const defs = BY_PAGE.get(route);
  if (!defs) throw new Error(`sections: no sections registered for route "${route}"`);
  return defs;
}

function sectionOf(route: string, id: string, path: string): SectionDefinition {
  const def = definitions(route).find((entry) => entry.id === id);
  if (!def) {
    fail(path, `"${id}" is not a section of "${route}"`);
  }
  if (def.locked) {
    fail(path, `"${id}" on "${route}" is locked and cannot be hidden or moved`);
  }
  return def;
}

/* ------------------------------------------------------------- validation */

function readConfig(value: unknown): SiteConfig {
  if (!isRecord(value)) fail('root', 'must be an object');
  if (value.version !== 1) fail('version', 'must be 1');

  const hidden = list(value.hidden, 'hidden').map((entry, index) => {
    const path = `hidden[${index}]`;
    if (!isRecord(entry)) fail(path, 'must be an object with route and id');
    const route = text(entry.route, `${path}.route`);
    const id = text(entry.id, `${path}.id`);
    sectionOf(route, id, path);
    return { route, id };
  });
  const hiddenKeys = new Set<string>();
  for (const entry of hidden) {
    const key = `${entry.route}\u0000${entry.id}`;
    if (hiddenKeys.has(key)) fail('hidden', `"${entry.id}" is listed twice for "${entry.route}"`);
    hiddenKeys.add(key);
  }

  if (!isRecord(value.order)) fail('order', 'must be an object keyed by route');
  const order: Record<string, string[]> = {};
  for (const [route, ids] of Object.entries(value.order)) {
    definitions(route); // throws when the route is unknown
    const seen = new Set<string>();
    order[route] = list(ids, `order["${route}"]`).map((raw, index) => {
      const path = `order["${route}"][${index}]`;
      const id = text(raw, path);
      sectionOf(route, id, path);
      if (seen.has(id)) fail(path, `"${id}" is listed twice`);
      seen.add(id);
      return id;
    });
  }

  const nav = list(value.nav, 'nav').map((entry, index) => {
    const path = `nav[${index}]`;
    if (!isRecord(entry)) fail(path, 'must be an object with label, href and key');
    const href = text(entry.href, `${path}.href`);
    if (!href.startsWith('/')) fail(`${path}.href`, 'must be a site-relative path');
    return {
      label: text(entry.label, `${path}.label`),
      href,
      key: text(entry.key, `${path}.key`),
    };
  });
  if (nav.length === 0) fail('nav', 'must contain at least one link');
  for (const field of ['href', 'key'] as const) {
    const seen = new Set<string>();
    for (const item of nav) {
      if (seen.has(item[field])) fail('nav', `duplicate ${field} "${item[field]}"`);
      seen.add(item[field]);
    }
  }

  if (!isRecord(value.footer)) fail('footer', 'must be an object');
  if (!isRecord(value.footer.brand)) fail('footer.brand', 'must be an object');
  const brand = {
    blurb: text(value.footer.brand.blurb, 'footer.brand.blurb'),
    email: text(value.footer.brand.email, 'footer.brand.email'),
  };
  if (!/^[^\s@]+@[^\s@]+$/.test(brand.email)) fail('footer.brand.email', 'must be an email address');

  const columns = list(value.footer.columns, 'footer.columns').map((entry, index) => {
    const path = `footer.columns[${index}]`;
    if (!isRecord(entry)) fail(path, 'must be an object with title and links');
    const links = list(entry.links, `${path}.links`).map((rawLink, linkIndex) => {
      const linkPath = `${path}.links[${linkIndex}]`;
      if (!isRecord(rawLink)) fail(linkPath, 'must be an object with label and href');
      const href = text(rawLink.href, `${linkPath}.href`);
      if (!/^(\/|#|mailto:|https:\/\/)/.test(href)) {
        fail(`${linkPath}.href`, `"${href}" is not a path, anchor, mailto: or https: link`);
      }
      return { label: text(rawLink.label, `${linkPath}.label`), href };
    });
    if (links.length === 0) fail(`${path}.links`, 'must contain at least one link');
    return { title: text(entry.title, `${path}.title`), links };
  });
  if (columns.length === 0) fail('footer.columns', 'must contain at least one column');

  return { version: 1, hidden, order, nav, footer: { brand, columns } };
}

export const SITE_CONFIG: SiteConfig = readConfig(rawConfig);

/* ------------------------------------------------------------------- read */

/** The seven primary links, in the order the header emits them. */
export const NAV: NavItem[] = SITE_CONFIG.nav;

export const FOOTER: SiteFooterConfig = SITE_CONFIG.footer;

/**
 * Every section of a route, in render order, with its hidden flag.
 *
 * Locked sections keep the place the registry gave them; the config can only
 * reorder the movable ones, and ids the order list does not mention fall in
 * after it in registry order — so a section added later still appears without
 * anyone editing the config.
 */
export function sectionPlan(route: string): PlannedSection[] {
  const defs = definitions(route);
  const hiddenIds = new Set(
    SITE_CONFIG.hidden.filter((entry) => entry.route === route).map((entry) => entry.id),
  );

  const movable = defs.filter((def) => !def.locked);
  const order = SITE_CONFIG.order[route];
  if (order) {
    const rank = new Map(order.map((id, index) => [id, index]));
    const fallback = new Map(movable.map((def, index) => [def.id, index]));
    movable.sort((a, b) => {
      const rankA = rank.get(a.id) ?? order.length + (fallback.get(a.id) ?? 0);
      const rankB = rank.get(b.id) ?? order.length + (fallback.get(b.id) ?? 0);
      return rankA - rankB;
    });
  }

  const queue = [...movable];
  return defs.map((def) => {
    if (def.locked) return { ...def, hidden: false };
    const next = queue.shift() as SectionDefinition;
    return { ...next, hidden: hiddenIds.has(next.id) };
  });
}

/** The ids a page body must render, in order, hidden ones removed. */
export function bodySectionIds(route: string): string[] {
  return sectionPlan(route)
    .filter((section) => section.mount === 'body' && !section.hidden)
    .map((section) => section.id);
}
