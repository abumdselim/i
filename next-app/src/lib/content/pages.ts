/**
 * The route manifest: one entry per page, in the order the legacy build wrote them.
 *
 * Titles and descriptions are copied from the legacy head, never re-derived:
 * meta descriptions are 158-character snippets, and a second derivation would
 * rewrite live search results. `kind` drives the shared templates, `navKey` says
 * which header link is current — read rather than inferred, because the six
 * capability pages and four product pages are siblings.
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

export const PAGES = [
  // / — Intactic — software engineering studio
  { slug: '', file: 'index.html', route: '/', title: 'Intactic — software engineering studio', description: 'Intactic designs and builds custom platforms, multi-vendor commerce, ERP and product interfaces for companies that have outgrown off-the-shelf software.', robots: 'index, follow', navKey: '', kind: 'home', showCta: true },
  // /services — Capabilities — Intactic
  { slug: 'services', file: 'services.html', route: '/services', title: 'Capabilities — Intactic', description: 'Custom software, multi-vendor commerce, ERP and operations, web platforms, mobile products, and automation with model-assisted workflows.', robots: 'index, follow', navKey: 'capabilities', kind: 'page', showCta: true },
  // /approach — Approach — Intactic
  { slug: 'approach', file: 'approach.html', route: '/approach', title: 'Approach — Intactic', description: 'How Intactic decides what to build: the system first, three layers of intelligence, five rules and the work we decline.', robots: 'index, follow', navKey: 'approach', kind: 'page', showCta: true },
  // /engagements — Engagements — Intactic
  { slug: 'engagements', file: 'engagements.html', route: '/engagements', title: 'Engagements — Intactic', description: 'Three ways to work with Intactic: platform build, embedded team, and a fixed-scope assessment of a system that already runs.', robots: 'index, follow', navKey: 'engagements', kind: 'page', showCta: true },
  // /process — Process — Intactic
  { slug: 'process', file: 'process.html', route: '/process', title: 'Process — Intactic', description: 'Four phases from first call to production, with a written output at the end of each and a fixed-scope discovery.', robots: 'index, follow', navKey: 'process', kind: 'page', showCta: true },
  // /about — Studio — Intactic
  { slug: 'about', file: 'about.html', route: '/about', title: 'Studio — Intactic', description: 'A small software engineering studio: four working principles, a named lead on every build, and boundaries we do not cross.', robots: 'index, follow', navKey: 'studio', kind: 'page', showCta: true },
  // /404 — Page not found — Intactic
  { slug: '404', file: '404.html', route: '/404', title: 'Page not found — Intactic', description: 'The page you were looking for does not exist. Everything else on intactic.net is one click away.', robots: 'noindex, follow', navKey: '', kind: 'not-found', showCta: false },
  // /contact — Contact — Intactic
  { slug: 'contact', file: 'contact.html', route: '/contact', title: 'Contact — Intactic', description: 'Tell Intactic what you are building. A short brief is enough; you get a reply within two working days.', robots: 'index, follow', navKey: 'contact', kind: 'page', showCta: false },
  // /products — Products — Intactic
  { slug: 'products', file: 'products.html', route: '/products', title: 'Products — Intactic', description: 'Four products built and run in-house: Shamlai for retail, Pharmasys for pharmacies, Pdfing Pro for documents, iCounsel for legal chambers.', robots: 'index, follow', navKey: 'products', kind: 'hub', showCta: true },
  // /custom-software — Custom software — Intactic
  { slug: 'custom-software', file: 'custom-software.html', route: '/custom-software', title: 'Custom software — Intactic', description: 'When the business process is the differentiator, an off-the-shelf product becomes the constraint.', robots: 'index, follow', navKey: 'capabilities', kind: 'capability', showCta: true },
  // /ecommerce — Multi-vendor commerce — Intactic
  { slug: 'ecommerce', file: 'ecommerce.html', route: '/ecommerce', title: 'Multi-vendor commerce — Intactic', description: 'Vendors, commissions, payouts and fulfilment are where marketplaces break.', robots: 'index, follow', navKey: 'capabilities', kind: 'capability', showCta: true },
  // /erp — ERP & operations — Intactic
  { slug: 'erp', file: 'erp.html', route: '/erp', title: 'ERP & operations — Intactic', description: 'Finance, inventory, purchasing and people held in one system that agrees with itself.', robots: 'index, follow', navKey: 'capabilities', kind: 'capability', showCta: true },
  // /web-platforms — Web platforms — Intactic
  { slug: 'web-platforms', file: 'web-platforms.html', route: '/web-platforms', title: 'Web platforms — Intactic', description: 'Marketing sites, customer portals and internal dashboards where design quality and load time are part of the product, not a coat of paint applied at the end.', robots: 'index, follow', navKey: 'capabilities', kind: 'capability', showCta: true },
  // /mobile-apps — Mobile products — Intactic
  { slug: 'mobile-apps', file: 'mobile-apps.html', route: '/mobile-apps', title: 'Mobile products — Intactic', description: 'Field teams, customers and internal operations on iOS and Android, with the offline behaviour and release discipline that production demands.', robots: 'index, follow', navKey: 'capabilities', kind: 'capability', showCta: true },
  // /automation — Automation & models — Intactic
  { slug: 'automation', file: 'automation.html', route: '/automation', title: 'Automation & models — Intactic', description: 'Document handling, triage, search and drafting, placed inside the systems your team already uses, with a review step and a way back.', robots: 'index, follow', navKey: 'capabilities', kind: 'capability', showCta: true },
  // /shamlai — Shamlai — Intactic
  { slug: 'shamlai', file: 'shamlai.html', route: '/shamlai', title: 'Shamlai — Intactic', description: 'Counter, stock, dues and profit for a shop that cannot stop for an outage.', robots: 'index, follow', navKey: 'products', kind: 'product', showCta: true },
  // /pharmasys — Pharmasys — Intactic
  { slug: 'pharmasys', file: 'pharmasys.html', route: '/pharmasys', title: 'Pharmasys — Intactic', description: 'A pharmacy counter with the generic, the registration number and the packshot at hand.', robots: 'index, follow', navKey: 'products', kind: 'product', showCta: true },
  // /pdfing-pro — Pdfing Pro — Intactic
  { slug: 'pdfing-pro', file: 'pdfing-pro.html', route: '/pdfing-pro', title: 'Pdfing Pro — Intactic', description: 'Merge, convert, secure, OCR and repair — 109 tools, with the work done server-side.', robots: 'index, follow', navKey: 'products', kind: 'product', showCta: true },
  // /icounsel — iCounsel — Intactic
  { slug: 'icounsel', file: 'icounsel.html', route: '/icounsel', title: 'iCounsel — Intactic', description: 'Cause lists, deadlines, case files and judgment summaries for a Bangladeshi chamber.', robots: 'index, follow', navKey: 'products', kind: 'product', showCta: true }
] satisfies PageEntry[];
