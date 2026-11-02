import type {
  CapabilityContent,
  ContentType,
  PageEntry,
  ProductContent,
  SectionDefinition,
  SiteConfig,
} from './types';

/**
 * Write-side validation (docs/admin.md §4, principle 4): nothing reaches
 * `data/*.json` until it has passed here. The site validates the same files
 * again at build time — this is the fast, field-level check that keeps a
 * mistake from ever becoming a broken build, and it returns every problem at
 * once so the form can mark the field that caused it.
 *
 * The rules mirror the site's schema: required strings, the robots vocabulary,
 * unique routes, and referential integrity for section ids (a section must
 * exist on that route in the registry, and a locked one cannot be hidden or
 * moved).
 */

export interface Issue {
  path: string;
  message: string;
}

export class StudioValidationError extends Error {
  issues: Issue[];

  constructor(issues: Issue[]) {
    super(issues.map((issue) => `${issue.path}: ${issue.message}`).join(' · '));
    this.name = 'StudioValidationError';
    this.issues = issues;
  }
}

type Issues = Issue[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function str(value: unknown, path: string, issues: Issues): string {
  if (typeof value !== 'string') {
    issues.push({ path, message: 'must be text' });
    return '';
  }
  if (value.trim() === '') {
    issues.push({ path, message: 'cannot be empty' });
    return '';
  }
  return value;
}

function arr(value: unknown, path: string, issues: Issues): unknown[] {
  if (!Array.isArray(value)) {
    issues.push({ path, message: 'must be a list' });
    return [];
  }
  return value;
}

function bool(value: unknown, path: string, issues: Issues): boolean {
  if (typeof value !== 'boolean') {
    issues.push({ path, message: 'must be true or false' });
    return false;
  }
  return value;
}

const ROBOTS = /^(index|noindex), (follow|nofollow)$/;

/* ------------------------------------------------------------------- pages */

export function validatePages(value: unknown): PageEntry[] {
  const issues: Issues = [];
  const rows = arr(value, 'pages', issues);
  const routes = new Set<string>();

  const pages = rows.map((row, index) => {
    const path = `pages[${index}]`;
    if (!isRecord(row)) {
      issues.push({ path, message: 'must be an object' });
      return null;
    }

    const route = str(row.route, `${path}.route`, issues);
    if (route && !route.startsWith('/')) issues.push({ path: `${path}.route`, message: 'must start with "/"' });
    if (routes.has(route)) issues.push({ path: `${path}.route`, message: `duplicate route "${route}"` });
    routes.add(route);

    const robots = str(row.robots, `${path}.robots`, issues);
    if (robots && !ROBOTS.test(robots)) {
      issues.push({ path: `${path}.robots`, message: 'must look like "index, follow" or "noindex, follow"' });
    }

    const title = str(row.title, `${path}.title`, issues);
    if (title.length > 70) issues.push({ path: `${path}.title`, message: 'is longer than 70 characters' });
    const description = str(row.description, `${path}.description`, issues);
    if (description.length > 180) {
      issues.push({ path: `${path}.description`, message: 'is longer than 180 characters' });
    }

    const slug = typeof row.slug === 'string' ? row.slug : '';
    const expectedSlug = route === '/' ? '' : route.replace(/^\//, '');
    if (route && slug !== expectedSlug) {
      issues.push({ path: `${path}.slug`, message: `must be "${expectedSlug}" for route "${route}"` });
    }

    return {
      slug,
      file: str(row.file, `${path}.file`, issues),
      route,
      title,
      description,
      robots,
      navKey: typeof row.navKey === 'string' ? row.navKey : '',
      kind: str(row.kind, `${path}.kind`, issues) as PageEntry['kind'],
      showCta: bool(row.showCta, `${path}.showCta`, issues),
    } satisfies PageEntry;
  });

  if (issues.length > 0) throw new StudioValidationError(issues);
  return pages as PageEntry[];
}

/* ------------------------------------------------------------- site config */

export function validateConfig(
  value: unknown,
  pages: PageEntry[],
  sections: SectionDefinition[],
): SiteConfig {
  const issues: Issues = [];
  if (!isRecord(value)) throw new StudioValidationError([{ path: 'site-config', message: 'must be an object' }]);

  if (value.version !== 1) issues.push({ path: 'version', message: 'must be 1' });

  const routes = new Set(pages.map((page) => page.route));
  const defsFor = (route: string) => sections.filter((section) => section.page === route);

  const hidden = arr(value.hidden, 'hidden', issues).map((row, index) => {
    const path = `hidden[${index}]`;
    if (!isRecord(row)) {
      issues.push({ path, message: 'must be an object with route and id' });
      return { route: '', id: '' };
    }
    const route = str(row.route, `${path}.route`, issues);
    const id = str(row.id, `${path}.id`, issues);
    if (!routes.has(route)) issues.push({ path: `${path}.route`, message: `no page "${route}"` });
    const def = defsFor(route).find((section) => section.id === id);
    if (!def) issues.push({ path: `${path}.id`, message: `"${id}" is not a section of "${route}"` });
    else if (def.locked) issues.push({ path: `${path}.id`, message: `"${id}" is locked and cannot be hidden` });
    return { route, id };
  });

  if (!isRecord(value.order)) {
    issues.push({ path: 'order', message: 'must be an object keyed by route' });
  }
  const order: Record<string, string[]> = {};
  for (const [route, ids] of Object.entries(isRecord(value.order) ? value.order : {})) {
    if (!routes.has(route)) issues.push({ path: `order["${route}"]`, message: 'no such page' });
    const seen = new Set<string>();
    order[route] = arr(ids, `order["${route}"]`, issues).map((raw, index) => {
      const path = `order["${route}"][${index}]`;
      const id = str(raw, path, issues);
      const def = defsFor(route).find((section) => section.id === id);
      if (!def) issues.push({ path, message: `"${id}" is not a section of "${route}"` });
      else if (def.locked) issues.push({ path, message: `"${id}" is locked and cannot move` });
      if (seen.has(id)) issues.push({ path, message: `"${id}" is listed twice` });
      seen.add(id);
      return id;
    });
  }

  const nav = arr(value.nav, 'nav', issues).map((row, index) => {
    const path = `nav[${index}]`;
    if (!isRecord(row)) {
      issues.push({ path, message: 'must be an object with label, href and key' });
      return { label: '', href: '/', key: '' };
    }
    const href = str(row.href, `${path}.href`, issues);
    if (!href.startsWith('/')) issues.push({ path: `${path}.href`, message: 'must be a site path' });
    return {
      label: str(row.label, `${path}.label`, issues),
      href,
      key: str(row.key, `${path}.key`, issues),
    };
  });
  if (nav.length === 0) issues.push({ path: 'nav', message: 'needs at least one link' });
  for (const field of ['href', 'key'] as const) {
    const seen = new Set<string>();
    nav.forEach((item, index) => {
      if (seen.has(item[field])) issues.push({ path: `nav[${index}].${field}`, message: `duplicate "${item[field]}"` });
      seen.add(item[field]);
    });
  }

  if (!isRecord(value.footer)) issues.push({ path: 'footer', message: 'must be an object' });
  const footer = isRecord(value.footer) ? value.footer : {};
  if (!isRecord(footer.brand)) issues.push({ path: 'footer.brand', message: 'must be an object' });
  const brand = isRecord(footer.brand) ? footer.brand : {};
  const email = str(brand.email, 'footer.brand.email', issues);
  if (email && !/^[^\s@]+@[^\s@]+$/.test(email)) {
    issues.push({ path: 'footer.brand.email', message: 'must be an email address' });
  }
  const columns = arr(footer.columns, 'footer.columns', issues).map((row, index) => {
    const path = `footer.columns[${index}]`;
    if (!isRecord(row)) {
      issues.push({ path, message: 'must be an object with title and links' });
      return { title: '', links: [] };
    }
    const links = arr(row.links, `${path}.links`, issues).map((rawLink, linkIndex) => {
      const linkPath = `${path}.links[${linkIndex}]`;
      if (!isRecord(rawLink)) {
        issues.push({ path: linkPath, message: 'must be an object with label and href' });
        return { label: '', href: '/' };
      }
      const href = str(rawLink.href, `${linkPath}.href`, issues);
      if (!/^(\/|#|mailto:|https:\/\/)/.test(href)) {
        issues.push({ path: `${linkPath}.href`, message: 'must be a path, anchor, mailto: or https: link' });
      }
      return { label: str(rawLink.label, `${linkPath}.label`, issues), href };
    });
    if (links.length === 0) issues.push({ path: `${path}.links`, message: 'needs at least one link' });
    return { title: str(row.title, `${path}.title`, issues), links };
  });

  if (issues.length > 0) throw new StudioValidationError(issues);

  return {
    version: 1,
    hidden,
    order,
    nav,
    footer: { brand: { blurb: str(brand.blurb, 'footer.brand.blurb', issues), email }, columns },
  };
}

/* ----------------------------------------------------------------- content */

const CONTENT_REQUIRED = ['slug', 'num', 'icon', 'h1', 'lead', 'problemHead', 'mapCore', 'stackNote'] as const;

export function validateContent(
  type: ContentType,
  value: unknown,
  slug: string,
): CapabilityContent | ProductContent {
  const issues: Issues = [];
  if (!isRecord(value)) throw new StudioValidationError([{ path: type, message: 'must be an object' }]);

  for (const field of CONTENT_REQUIRED) str(value[field], field, issues);
  if (value.slug !== slug) issues.push({ path: 'slug', message: `must stay "${slug}"` });

  for (const field of ['problem', 'mapNodes', 'stack'] as const) {
    arr(value[field], field, issues).forEach((entry, index) => str(entry, `${field}[${index}]`, issues));
  }

  for (const field of ['items', 'rules'] as const) {
    arr(value[field], field, issues).forEach((entry, index) => {
      if (!isRecord(entry)) {
        issues.push({ path: `${field}[${index}]`, message: 'must be an object' });
        return;
      }
      str(entry.icon, `${field}[${index}].icon`, issues);
      str(entry.title, `${field}[${index}].title`, issues);
      str(entry.body, `${field}[${index}].body`, issues);
    });
  }

  arr(value.related, 'related', issues).forEach((entry, index) => {
    if (!isRecord(entry)) {
      issues.push({ path: `related[${index}]`, message: 'must be an object' });
      return;
    }
    str(entry.href, `related[${index}].href`, issues);
    str(entry.label, `related[${index}].label`, issues);
    str(entry.num, `related[${index}].num`, issues);
  });

  arr(value.meta, 'meta', issues).forEach((entry, index) => {
    if (!isRecord(entry)) {
      issues.push({ path: `meta[${index}]`, message: 'must be an object' });
      return;
    }
    str(entry.key, `meta[${index}].key`, issues);
    if (!isRecord(entry.value)) {
      issues.push({ path: `meta[${index}].value`, message: 'must be an object' });
      return;
    }
    if (entry.value.kind === 'link') {
      str(entry.value.href, `meta[${index}].value.href`, issues);
      str(entry.value.label, `meta[${index}].value.label`, issues);
    } else {
      str(entry.value.value, `meta[${index}].value.value`, issues);
    }
  });

  if (type === 'capability') {
    str(value.nav, 'nav', issues);
    str(value.start, 'start', issues);
  } else {
    str(value.name, 'name', issues);
    str(value.domain, 'domain', issues);
    str(value.card, 'card', issues);
    arr(value.builtFor, 'builtFor', issues).forEach((entry, index) => str(entry, `builtFor[${index}]`, issues));
  }

  if (issues.length > 0) throw new StudioValidationError(issues);
  return value as unknown as CapabilityContent | ProductContent;
}
