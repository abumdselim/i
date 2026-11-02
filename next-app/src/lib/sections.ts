import sectionsJson from '../../data/sections.json';
import { PAGES } from './content/pages';

/**
 * The section registry — the one list of what every page is made of
 * (admin phase 2, docs/admin.md §6).
 *
 * The data lives in `data/sections.json`, not in this file, because two
 * applications read it: the site renders from it, and Intactic Studio (a
 * separate package in `admin-app/`) lists its hide/order controls from the same
 * file. Code here would be importable by one of them and not the other; data
 * both can read is the only way to keep a single source. This module is the
 * site's reading side: it validates the file once at import time and throws
 * with the entry index, so a broken registry fails `next build` before a page
 * is emitted.
 *
 * Two entries are guarded per page, because a page without them is not a page:
 * the head (`head`/`hero`, which carries the h1) and the closing call to action
 * (`cta`, mounted beside <main>). `locked` says so, and
 * `data/site-config.json` cannot hide or move them.
 *
 * Adding a section is two edits: a node in the page component, and an entry
 * here. The studio's controls follow automatically.
 */

export type SectionKind = 'head' | 'hero' | 'content' | 'grid' | 'list' | 'faq' | 'cta';

/** `body` renders inside <main>; `shell` renders beside it (the closing CTA). */
export type SectionMount = 'body' | 'shell';

export interface SectionDefinition {
  /** Stable within its page; persisted in `data/site-config.json`. */
  id: string;
  /** The route the section belongs to, e.g. `/erp`. */
  page: string;
  /** The studio's label for the block. */
  title: string;
  kind: SectionKind;
  mount: SectionMount;
  /** Locked sections always render where the registry puts them. */
  locked: boolean;
}

const KINDS: readonly SectionKind[] = ['head', 'hero', 'content', 'grid', 'list', 'faq', 'cta'];
const MOUNTS: readonly SectionMount[] = ['body', 'shell'];

function fail(index: number, message: string): never {
  throw new Error(`sections: sections[${index}] — ${message}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readRegistry(raw: unknown): SectionDefinition[] {
  if (!Array.isArray(raw)) throw new Error('sections: sections.json must be an array');

  return raw.map((entry, index) => {
    if (!isRecord(entry)) fail(index, 'must be an object');

    const { page, id, title, kind, mount, locked } = entry;
    if (typeof page !== 'string' || !page.startsWith('/')) fail(index, 'page must be a route starting with "/"');
    if (typeof id !== 'string' || id.trim() === '') fail(index, 'id must be a non-empty string');
    if (typeof title !== 'string' || title.trim() === '') fail(index, 'title must be a non-empty string');
    if (!KINDS.includes(kind as SectionKind)) fail(index, `kind "${String(kind)}" is not one of ${KINDS.join(', ')}`);
    if (!MOUNTS.includes(mount as SectionMount)) fail(index, `mount "${String(mount)}" must be body or shell`);
    if (typeof locked !== 'boolean') fail(index, 'locked must be true or false');

    return {
      page,
      id,
      title,
      kind: kind as SectionKind,
      mount: mount as SectionMount,
      locked,
    };
  });
}

export const SECTIONS: readonly SectionDefinition[] = readRegistry(sectionsJson);

/* ------------------------------------------------------- registry contract */

const BY_PAGE = new Map<string, SectionDefinition[]>();
for (const section of SECTIONS) {
  const page = BY_PAGE.get(section.page);
  if (page) page.push(section);
  else BY_PAGE.set(section.page, [section]);
}

for (const [route, defs] of BY_PAGE) {
  const seen = new Set<string>();
  for (const def of defs) {
    if (seen.has(def.id)) throw new Error(`sections: duplicate id "${def.id}" on "${route}"`);
    seen.add(def.id);
  }

  const first = defs[0];
  if (!first.locked || (first.kind !== 'head' && first.kind !== 'hero')) {
    throw new Error(`sections: "${route}" must open with a locked head or hero`);
  }

  const shells = defs.filter((def) => def.mount === 'shell');
  if (shells.length > 1) throw new Error(`sections: "${route}" declares ${shells.length} shell sections`);
  for (const shell of shells) {
    if (!shell.locked) throw new Error(`sections: shell section "${shell.id}" on "${route}" must be locked`);
    if (shell.id !== 'cta') throw new Error(`sections: unknown shell section "${shell.id}" on "${route}"`);
  }
}

for (const page of PAGES) {
  const defs = BY_PAGE.get(page.route);
  if (!defs) throw new Error(`sections: no sections registered for route "${page.route}"`);
  const ctas = defs.filter((def) => def.id === 'cta');
  if (ctas.length !== 1) throw new Error(`sections: "${page.route}" must list exactly one cta`);
  if (defs[defs.length - 1].id !== 'cta') throw new Error(`sections: "${page.route}" must end with cta`);
}

for (const route of BY_PAGE.keys()) {
  if (!PAGES.some((page) => page.route === route)) {
    throw new Error(`sections: sections registered for "${route}", but the manifest has no such route`);
  }
}
