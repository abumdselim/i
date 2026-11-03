import { ICON_NAMES } from '../../components/icons';
import type { IconName } from '../../components/icons';
import type {
  CapabilityContent,
  CaseStudiesData,
  CaseStudyKind,
  CaseStudyLogo,
  ContentItem,
  FigureGeometry,
  Industry,
  IndustryMark,
  MetaValue,
  PageContent,
  PageEntry,
  PageKind,
  PlateLayer,
  ProductContent,
  RelatedItem,
  StackGroup,
} from './types';

/**
 * Runtime validation for the JSON content in `data/` — the successor to the
 * compile-time `satisfies` guarantee the typed literals carried until admin
 * phase 1 (docs/admin.md §6; decision D-16 records the trade).
 *
 * JSON cannot carry types, and the admin studio writes these files outside the
 * compiler's reach. Every value the site renders is checked here, once, at
 * import time: a bad icon name, a broken meta union or a missing field fails
 * the build with the exact JSON path in the message, before a single page is
 * emitted. The same module will validate the studio's writes.
 *
 * The icon import is deliberately relative (not `@/`): the admin app reuses
 * this file and does not share the site's path alias.
 */

const PAGE_KINDS = ['home', 'page', 'capability', 'product', 'hub', 'not-found'] as const;
const INDUSTRY_MARKS = ['store', 'capsule', 'balance', 'parcel', 'archive'] as const;
const SPRITE: readonly string[] = ICON_NAMES;

function fail(path: string, message: string): never {
  throw new Error(`content: ${path} — ${message}`);
}

function record(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) fail(path, 'expected an object');
  return value as Record<string, unknown>;
}

function array(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) fail(path, 'expected an array');
  return value;
}

function string(value: unknown, path: string): string {
  if (typeof value !== 'string') fail(path, 'expected a string');
  return value;
}

function boolean(value: unknown, path: string): boolean {
  if (typeof value !== 'boolean') fail(path, 'expected a boolean');
  return value;
}

function number(value: unknown, path: string): number {
  if (typeof value !== 'number') fail(path, 'expected a number');
  return value;
}

function iconName(value: unknown, path: string): IconName {
  const name = string(value, path);
  if (!SPRITE.includes(name)) fail(path, `"${name}" is not in the sprite`);
  return name as IconName;
}

function strings(value: unknown, path: string): string[] {
  return array(value, path).map((item, index) => string(item, `${path}[${index}]`));
}

function metaValue(value: unknown, path: string): MetaValue {
  const source = record(value, path);
  const kind = string(source.kind, `${path}.kind`);
  if (kind === 'text') return { kind, value: string(source.value, `${path}.value`) };
  if (kind === 'link') return { kind, href: string(source.href, `${path}.href`), label: string(source.label, `${path}.label`) };
  return fail(path, `unknown meta kind "${kind}"`);
}

function contentItem(value: unknown, path: string): ContentItem {
  const source = record(value, path);
  return {
    icon: iconName(source.icon, `${path}.icon`),
    title: string(source.title, `${path}.title`),
    body: string(source.body, `${path}.body`),
  };
}

function relatedItem(value: unknown, path: string): RelatedItem {
  const source = record(value, path);
  return {
    href: string(source.href, `${path}.href`),
    label: string(source.label, `${path}.label`),
    num: string(source.num, `${path}.num`),
  };
}

/** The shared body of a capability or product entry. */
function pageContent(value: unknown, path: string): PageContent {
  const source = record(value, path);
  return {
    slug: string(source.slug, `${path}.slug`),
    num: string(source.num, `${path}.num`),
    icon: iconName(source.icon, `${path}.icon`),
    h1: string(source.h1, `${path}.h1`),
    lead: string(source.lead, `${path}.lead`),
    meta: array(source.meta, `${path}.meta`).map((item, index) => {
      const entry = record(item, `${path}.meta[${index}]`);
      return {
        key: string(entry.key, `${path}.meta[${index}].key`),
        value: metaValue(entry.value, `${path}.meta[${index}].value`),
      };
    }),
    problemHead: string(source.problemHead, `${path}.problemHead`),
    problem: strings(source.problem, `${path}.problem`),
    mapCore: string(source.mapCore, `${path}.mapCore`),
    mapNodes: strings(source.mapNodes, `${path}.mapNodes`),
    items: array(source.items, `${path}.items`).map((item, index) => contentItem(item, `${path}.items[${index}]`)),
    rules: array(source.rules, `${path}.rules`).map((item, index) => contentItem(item, `${path}.rules[${index}]`)),
    stack: strings(source.stack, `${path}.stack`),
    stackNote: string(source.stackNote, `${path}.stackNote`),
    related: array(source.related, `${path}.related`).map((item, index) => relatedItem(item, `${path}.related[${index}]`)),
  };
}

function uniqueSlugs(entries: { slug: string }[], label: string): void {
  const seen = new Set<string>();
  for (const entry of entries) {
    if (seen.has(entry.slug)) fail(label, `duplicate slug "${entry.slug}"`);
    seen.add(entry.slug);
  }
}

export function validateCapabilities(value: unknown): CapabilityContent[] {
  const capabilities = array(value, 'capabilities').map((entry, index) => {
    const path = `capabilities[${index}]`;
    const source = record(entry, path);
    return {
      ...pageContent(entry, path),
      nav: string(source.nav, `${path}.nav`),
      start: string(source.start, `${path}.start`),
    };
  });
  uniqueSlugs(capabilities, 'capabilities');
  return capabilities;
}

export function validateProducts(value: unknown): ProductContent[] {
  const products = array(value, 'products').map((entry, index) => {
    const path = `products[${index}]`;
    const source = record(entry, path);
    return {
      ...pageContent(entry, path),
      name: string(source.name, `${path}.name`),
      domain: string(source.domain, `${path}.domain`),
      card: string(source.card, `${path}.card`),
      builtFor: strings(source.builtFor, `${path}.builtFor`),
    };
  });
  uniqueSlugs(products, 'products');
  return products;
}

export function validatePages(value: unknown): PageEntry[] {
  const pages = array(value, 'pages').map((entry, index) => {
    const path = `pages[${index}]`;
    const source = record(entry, path);
    const kind = string(source.kind, `${path}.kind`);
    if (!(PAGE_KINDS as readonly string[]).includes(kind)) fail(`${path}.kind`, `unknown page kind "${kind}"`);
    return {
      slug: string(source.slug, `${path}.slug`),
      file: string(source.file, `${path}.file`),
      route: string(source.route, `${path}.route`),
      title: string(source.title, `${path}.title`),
      description: string(source.description, `${path}.description`),
      robots: string(source.robots, `${path}.robots`),
      navKey: string(source.navKey, `${path}.navKey`),
      kind: kind as PageKind,
      showCta: boolean(source.showCta, `${path}.showCta`),
    };
  });
  const routes = new Set<string>();
  for (const page of pages) {
    if (routes.has(page.route)) fail('pages', `duplicate route "${page.route}"`);
    routes.add(page.route);
  }
  return pages;
}

export interface FiguresData {
  figures: Record<string, FigureGeometry>;
  plateLayers: PlateLayer[];
  industries: Industry[];
  stack: StackGroup[];
}

/* ------------------------------------------------------- case studies */

const CASE_KINDS = ['live', 'illustrative'] as const;
const LINK_HREF = /^(\/|https:\/\/)/;

/**
 * The case-study section (data/case-studies.json) — the first home section
 * whose copy is data rather than a literal, so the studio can edit it
 * (docs/admin.md §6, phase 9). Same contract as everything else here: an
 * unknown kind, a logo whose src is not a local path, or a link that is
 * neither a route nor https fails the build with its JSON path.
 */
export function validateCaseStudies(value: unknown): CaseStudiesData {
  const source = record(value, 'case-studies');

  const head = record(source.head, 'case-studies.head');
  const cta = record(source.cta, 'case-studies.cta');

  const cases = array(source.cases, 'case-studies.cases').map((entry, index) => {
    const path = `case-studies.cases[${index}]`;
    const card = record(entry, path);
    const kind = string(card.kind, `${path}.kind`);
    if (!(CASE_KINDS as readonly string[]).includes(kind)) {
      fail(`${path}.kind`, `unknown kind \"${kind}\" — use live or illustrative`);
    }

    let logo: CaseStudyLogo | null = null;
    if (card.logo !== null) {
      const mark = record(card.logo, `${path}.logo`);
      const src = string(mark.src, `${path}.logo.src`);
      if (!src.startsWith('/assets/')) fail(`${path}.logo.src`, 'must be a local asset path under /assets/');
      logo = {
        src,
        alt: string(mark.alt, `${path}.logo.alt`),
        width: number(mark.width, `${path}.logo.width`),
        height: number(mark.height, `${path}.logo.height`),
      };
      if (logo.width <= 0 || logo.height <= 0) fail(`${path}.logo`, 'width and height must be positive');
    } else if (kind === 'live') {
      fail(`${path}.logo`, 'a live case must carry the client wordmark (or set kind to illustrative)');
    }

    const summary = strings(card.summary, `${path}.summary`);
    if (summary.length === 0) fail(`${path}.summary`, 'needs at least one paragraph');

    const link = record(card.link, `${path}.link`);
    const href = string(link.href, `${path}.link.href`);
    if (!LINK_HREF.test(href)) fail(`${path}.link.href`, `\"${href}\" must be a site path or an https: link`);

    return {
      id: string(card.id, `${path}.id`),
      kind: kind as CaseStudyKind,
      num: string(card.num, `${path}.num`),
      client: string(card.client, `${path}.client`),
      line: string(card.line, `${path}.line`),
      icon: iconName(card.icon, `${path}.icon`),
      logo,
      summary,
      note: string(card.note, `${path}.note`),
      tags: strings(card.tags, `${path}.tags`),
      spec: array(card.spec, `${path}.spec`).map((row, rowIndex) => {
        const rowPath = `${path}.spec[${rowIndex}]`;
        const cell = record(row, rowPath);
        return {
          label: string(cell.label, `${rowPath}.label`),
          value: string(cell.value, `${rowPath}.value`),
        };
      }),
      link: { label: string(link.label, `${path}.link.label`), href, external: boolean(link.external, `${path}.link.external`) },
    };
  });

  if (cases.length === 0) fail('case-studies.cases', 'needs at least one case');
  const ids = new Set<string>();
  for (const card of cases) {
    if (ids.has(card.id)) fail('case-studies.cases', `duplicate id \"${card.id}\"`);
    ids.add(card.id);
  }

  const ctaHref = string(cta.href, 'case-studies.cta.href');
  if (!LINK_HREF.test(ctaHref)) fail('case-studies.cta.href', 'must be a site path or an https: link');

  return {
    head: {
      eyebrow: string(head.eyebrow, 'case-studies.head.eyebrow'),
      title: string(head.title, 'case-studies.head.title'),
      lead: string(head.lead, 'case-studies.head.lead'),
    },
    cta: {
      title: string(cta.title, 'case-studies.cta.title'),
      body: string(cta.body, 'case-studies.cta.body'),
      label: string(cta.label, 'case-studies.cta.label'),
      href: ctaHref,
    },
    cases,
  };
}

export function validateFigures(value: unknown): FiguresData {
  const source = record(value, 'figures');

  const figures: Record<string, FigureGeometry> = {};
  const figureRoot = record(source.figures, 'figures.figures');
  for (const name of Object.keys(figureRoot)) {
    const path = `figures.figures.${name}`;
    const entry = record(figureRoot[name], path);
    figures[name] = {
      viewBox: string(entry.viewBox, `${path}.viewBox`),
      rects: array(entry.rects, `${path}.rects`).map((rect, index) => {
        const cellPath = `${path}.rects[${index}]`;
        const cell = record(rect, cellPath);
        return {
          cls: string(cell.cls, `${cellPath}.cls`),
          x: number(cell.x, `${cellPath}.x`),
          y: number(cell.y, `${cellPath}.y`),
          w: number(cell.w, `${cellPath}.w`),
          h: number(cell.h, `${cellPath}.h`),
        };
      }),
      paths: array(entry.paths, `${path}.paths`).map((segment, index) => {
        const segmentPath = `${path}.paths[${index}]`;
        const seg = record(segment, segmentPath);
        return {
          cls: string(seg.cls, `${segmentPath}.cls`),
          d: string(seg.d, `${segmentPath}.d`),
        };
      }),
    };
  }

  const plateLayers = array(source.plateLayers, 'figures.plateLayers').map((layer, index) => {
    const path = `figures.plateLayers[${index}]`;
    const entry = record(layer, path);
    return {
      name: string(entry.name, `${path}.name`),
      meta: string(entry.meta, `${path}.meta`),
      cells: array(entry.cells, `${path}.cells`).map((cell, cellIndex) => {
        const cellPath = `${path}.cells[${cellIndex}]`;
        const entryCell = record(cell, cellPath);
        return {
          cls: string(entryCell.cls, `${cellPath}.cls`),
          index: number(entryCell.index, `${cellPath}.index`),
        };
      }),
    };
  });

  const industries = array(source.industries, 'figures.industries').map((industry, index) => {
    const path = `figures.industries[${index}]`;
    const entry = record(industry, path);
    const mark = string(entry.mark, `${path}.mark`);
    if (!(INDUSTRY_MARKS as readonly string[]).includes(mark)) {
      fail(`${path}.mark`, `unknown mark \"${mark}\" — use one of ${INDUSTRY_MARKS.join(', ')}`);
    }
    return {
      num: string(entry.num, `${path}.num`),
      icon: iconName(entry.icon, `${path}.icon`),
      title: string(entry.title, `${path}.title`),
      body: string(entry.body, `${path}.body`),
      mark: mark as IndustryMark,
    };
  });

  const stack = array(source.stack, 'figures.stack').map((group, index) => {
    const path = `figures.stack[${index}]`;
    const entry = record(group, path);
    return {
      group: string(entry.group, `${path}.group`),
      items: array(entry.items, `${path}.items`).map((item, itemIndex) => {
        const itemPath = `${path}.items[${itemIndex}]`;
        const entryItem = record(item, itemPath);
        return {
          label: string(entryItem.label, `${itemPath}.label`),
          slug: string(entryItem.slug, `${itemPath}.slug`),
        };
      }),
    };
  });

  return { figures, plateLayers, industries, stack };
}
