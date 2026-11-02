import type { CapabilityContent } from './types';

/**
 * The six capability pages, rendered by the shared route src/app/[slug]/page.tsx.
 *
 * This file is the source: page copy is edited here and nowhere else. Until step 1
 * of the migration the values lived in _build/cats.py and were exported to JSON on
 * every build; that exporter is retired. `satisfies CapabilityContent[]` keeps the
 * icon names checked against the sprite and the meta union honest at compile time.
 */

export const CAPABILITIES = [
  // 01 · /custom-software — Custom software; typical engagement: Platform build
  {
    slug: 'custom-software',
    num: '01',
    nav: 'Custom software',
    icon: 'i-custom',
    h1: 'Software shaped around your operation.',
    lead: 'When the business process is the differentiator, an off-the-shelf product becomes the constraint. We model the domain, design the system, then build only the parts that earn their place.',
    meta: [
      {
        key: 'Typical engagement',
        value: { kind: 'text', value: 'Platform build' }
      },
      {
        key: 'Team',
        value: { kind: 'text', value: '3–5 people' }
      },
      {
        key: 'First phase',
        value: { kind: 'text', value: 'Discovery, 1–2 weeks' }
      }
    ],
    problemHead: 'When the process is the differentiator.',
    problem: [
      'Every company eventually meets the edge of what a packaged product can do. A pricing rule that depends on three departments. A workflow that exists because a regulator asked for it. A spreadsheet that has quietly become the system of record.',
      'The usual response is to bend the process to the software, or to bolt on a second system that talks to the first through a nightly file. Both work for a while. Neither survives the next acquisition, the next audit, or the next person who leaves.'
    ],
    mapCore: 'Domain model',
    mapNodes: [
      'Identity & access',
      'Workflow',
      'Billing',
      'Reporting',
      'Admin tools',
      'Audit trail',
      'Integrations',
      'Notifications'
    ],
    items: [
      { icon: 'i-database', title: 'Domain model', body: 'Entities, states and rules written down before the first screen is drawn.' },
      { icon: 'i-layers', title: 'Service architecture', body: 'Boundaries that match the business, not the org chart of the month.' },
      { icon: 'i-plug', title: 'APIs and integrations', body: 'Typed contracts, retries, idempotency, and a log a support engineer can read.' },
      { icon: 'i-custom', title: 'Internal tools', body: 'Admin surfaces the operations team can use without waiting for a developer.' },
      { icon: 'i-sync', title: 'Legacy migration', body: 'A staged path off the old system, with both running in parallel until the numbers agree.' },
      { icon: 'i-approval', title: 'Tests and documentation', body: 'Coverage for the rules that cost money when they break, and notes for the team that inherits them.' }
    ],
    rules: [
      { icon: 'i-database', title: 'Model the business, not the screens', body: 'We interview the people who do the work and write the states and rules down. Most disputes surface here, while they are still cheap to settle.' },
      { icon: 'i-layers', title: 'Ship the spine first', body: 'Identity, permissions and the core record go live early, behind a real interface. Everything else attaches to something that already works.' },
      { icon: 'i-doc', title: 'Leave a system your team can run', body: 'Documentation, runbooks and a recorded walkthrough. Your engineers are in the repository from the first week, not after launch.' }
    ],
    stack: ['TypeScript', 'Node', 'Python', 'Postgres', 'Redis', 'Docker', 'AWS'],
    stackNote: 'Chosen for the team that will maintain it, not for the demo. If your engineers already run .NET or Java, we work in that instead.',
    start: 'A two-week discovery with a fixed fee. You leave with a written domain model, a scope and an estimate you can take to your board.',
    related: [
      { href: '/ecommerce', label: 'Multi-vendor commerce', num: 'C/02' },
      { href: '/erp', label: 'ERP & operations', num: 'C/03' }
    ]
  },
  // 02 · /ecommerce — Multi-vendor commerce; typical engagement: Platform build
  {
    slug: 'ecommerce',
    num: '02',
    nav: 'Multi-vendor commerce',
    icon: 'i-commerce',
    h1: 'Marketplaces that survive their own growth.',
    lead: 'Vendors, commissions, payouts and fulfilment are where marketplaces break. We build them as first-class parts of the system, not as plugins fighting each other in production.',
    meta: [
      {
        key: 'Typical engagement',
        value: { kind: 'text', value: 'Platform build' }
      },
      {
        key: 'Team',
        value: { kind: 'text', value: '4–6 people' }
      },
      {
        key: 'First phase',
        value: { kind: 'text', value: 'Discovery, 2 weeks' }
      }
    ],
    problemHead: 'A marketplace is a financial system.',
    problem: [
      'A storefront is easy to draw and hard to settle. Every order splits money between parties, carries tax treatment that depends on jurisdiction, and can be reversed months after it was paid out.',
      'Most platforms handle the first hundred orders comfortably. The trouble starts when a vendor disputes a statement, a return arrives after settlement, or the catalogue grows past the point where a single search index can rank it honestly.'
    ],
    mapCore: 'Order engine',
    mapNodes: [
      'Vendor portal',
      'Catalogue',
      'Payouts',
      'Fulfilment',
      'Returns',
      'Search',
      'Tax',
      'Ledger'
    ],
    items: [
      { icon: 'i-users', title: 'Vendor onboarding', body: 'Applications, documents, verification states, and the rules that differ by category.' },
      { icon: 'i-cube', title: 'Catalogue and variants', body: 'Options, bundles and price rules that survive a real merchandising team.' },
      { icon: 'i-payout', title: 'Commission and payouts', body: 'A ledger entry per order, settlement schedules, and statements a vendor can reconcile without a support ticket.' },
      { icon: 'i-workflow', title: 'Order orchestration', body: 'Split shipments, partial cancellations and returns, with the money traced at every step.' },
      { icon: 'i-card', title: 'Storefront and checkout', body: 'Fast, accessible, and honest about stock and delivery dates.' },
      { icon: 'i-chart', title: 'Operator analytics', body: 'Gross merchandise value, take rate, refund rate and vendor health in one view.' }
    ],
    rules: [
      { icon: 'i-ledger', title: 'The ledger before the storefront', body: 'Money movement is modelled first. A checkout that cannot reconcile is a liability, not a feature.' },
      { icon: 'i-users', title: 'Vendor-facing by default', body: 'Every number the operator sees, the vendor should be able to see too, with the same arithmetic and the same date range.' },
      { icon: 'i-database', title: 'Built for a hundred thousand SKUs', body: 'Search, media and catalogue queries are designed for scale on day one, not retrofitted after the first slow month.' }
    ],
    stack: ['Next.js', 'Medusa', 'Stripe Connect', 'Postgres', 'Meilisearch', 'S3'],
    stackNote: 'Commerce platforms are a starting point, not a religion. We extend what is solid and replace what will not carry payouts, tax or returns.',
    start: 'We begin with the money: commission rules, settlement timing and refund policy. The storefront follows once those are agreed.',
    related: [
      { href: '/custom-software', label: 'Custom software', num: 'C/01' },
      { href: '/web-platforms', label: 'Web platforms', num: 'C/04' }
    ]
  },
  // 03 · /erp — ERP & operations; typical engagement: Assessment, then build
  {
    slug: 'erp',
    num: '03',
    nav: 'ERP & operations',
    icon: 'i-erp',
    h1: 'One record, reconciled.',
    lead: 'Finance, inventory, purchasing and people held in one system that agrees with itself. Reporting becomes a query rather than a project.',
    meta: [
      {
        key: 'Typical engagement',
        value: { kind: 'text', value: 'Assessment, then build' }
      },
      {
        key: 'Team',
        value: { kind: 'text', value: '3–5 people' }
      },
      {
        key: 'First phase',
        value: { kind: 'text', value: 'Audit, 2 weeks' }
      }
    ],
    problemHead: 'Operations fail by drift, not by crash.',
    problem: [
      'A stock figure that is two days behind. A purchase order approved in an email thread. A month-end close that takes nine days because three teams keep their own version of the truth.',
      'Buying an ERP solves the shape of the problem and creates a new one: configuration, consultants, and a system nobody in the business can change without a change request. We take a narrower route, starting with the numbers that hurt.'
    ],
    mapCore: 'Ledger',
    mapNodes: ['Inventory', 'Purchasing', 'Payroll', 'Approvals', 'Banks', 'Tax', 'Reports', 'Audit'],
    items: [
      { icon: 'i-ledger', title: 'Chart of accounts', body: 'Structures that match how the business is managed, not only how it is audited.' },
      { icon: 'i-cube', title: 'Inventory and purchasing', body: 'Locations, movements, reorder rules and approval limits that reflect real authority.' },
      { icon: 'i-users', title: 'Payroll and HR interfaces', body: 'Clean boundaries with the systems that already own employee data.' },
      { icon: 'i-approval', title: 'Approvals and permissions', body: 'Role-based access, delegations, and a record of who approved what, and when.' },
      { icon: 'i-plug', title: 'Integrations', body: 'Banks, logistics, tax portals, and the spreadsheet that will not die.' },
      { icon: 'i-chart', title: 'Operational reporting', body: 'A small set of reports people open every morning, and no more than that.' }
    ],
    rules: [
      { icon: 'i-database', title: 'One owner per number', body: 'Every figure has a single system of record. Where two systems disagree, the reconciliation is part of the build, not an afterthought.' },
      { icon: 'i-clock', title: 'Start with the close', body: 'We work backwards from month-end. If the close is clean, the rest of the reporting can be trusted.' },
      { icon: 'i-workflow', title: 'Changeable by the business', body: 'Approval chains and report definitions live in configuration, not in code that requires us to change it.' }
    ],
    stack: ['Python', 'Django', 'Postgres', 'Celery', 'Metabase', 'Odoo'],
    stackNote: 'Odoo or an existing ERP stays where it earns its keep. We build the parts that are specific to you and connect the rest.',
    start: 'A two-week audit of the current close: where the numbers come from, where they disagree, and what it costs to fix each one.',
    related: [
      { href: '/custom-software', label: 'Custom software', num: 'C/01' },
      { href: '/automation', label: 'Automation & models', num: 'C/06' }
    ]
  },
  // 04 · /web-platforms — Web platforms; typical engagement: Platform build
  {
    slug: 'web-platforms',
    num: '04',
    nav: 'Web platforms',
    icon: 'i-web',
    h1: 'Sites and portals that carry the brand.',
    lead: 'Marketing sites, customer portals and internal dashboards where design quality and load time are part of the product, not a coat of paint applied at the end.',
    meta: [
      {
        key: 'Typical engagement',
        value: { kind: 'text', value: 'Platform build' }
      },
      {
        key: 'Team',
        value: { kind: 'text', value: '2–4 people' }
      },
      {
        key: 'First phase',
        value: { kind: 'text', value: 'Design direction, 2 weeks' }
      }
    ],
    problemHead: 'A website is judged in the first second.',
    problem: [
      'On a phone, on a train, before a single word is read. Everything after that judgement, from the pricing table to the login form, is read in the shadow of how the page felt when it loaded.',
      'Most corporate sites fail in the same three places: a design system that exists only in a file, content the marketing team cannot edit without a ticket, and a page weight nobody measured.'
    ],
    mapCore: 'Design system',
    mapNodes: ['CMS', 'Portal', 'Sign-in', 'Search', 'Analytics', 'Media', 'Forms', 'Delivery'],
    items: [
      { icon: 'i-erp', title: 'Design system', body: 'Tokens, components and rules your team can extend without breaking the brand.' },
      { icon: 'i-doc', title: 'Marketing site and CMS', body: 'Structured content, previews, and publishing that does not require a developer.' },
      { icon: 'i-web', title: 'Customer and partner portals', body: 'Authentication, roles, documents and account history in one place.' },
      { icon: 'i-gauge', title: 'Performance', body: 'Budgets per page, set before design and measured after launch on real devices.' },
      { icon: 'i-users', title: 'Accessibility', body: 'WCAG 2.2 AA, tested with a keyboard and a screen reader, not only a checklist.' },
      { icon: 'i-chart', title: 'Analytics and consent', body: 'Events that answer real questions, and a consent model that holds up to review.' }
    ],
    rules: [
      { icon: 'i-web', title: 'Design in the browser', body: 'Layouts are proven at 360, 768 and 1440 pixels before they are approved, not after.' },
      { icon: 'i-doc', title: 'Content is a system', body: 'Fields, not free-text boxes. Editors get guardrails; readers get consistency.' },
      { icon: 'i-gauge', title: 'Measure before launch', body: 'A desktop score is a starting point. Real devices on real networks decide whether it ships.' }
    ],
    stack: ['HTML / CSS / TS', 'Next.js', 'Astro', 'Sanity', 'Cloudflare'],
    stackNote: 'Static where it can be, dynamic where it must be. Most of the site should be a file on a CDN, not a database query.',
    start: 'A two-week design direction: type, colour, grid and two page templates built in the browser for review on real devices.',
    related: [
      { href: '/mobile-apps', label: 'Mobile products', num: 'C/05' },
      { href: '/ecommerce', label: 'Multi-vendor commerce', num: 'C/02' }
    ]
  },
  // 05 · /mobile-apps — Mobile products; typical engagement: Platform build
  {
    slug: 'mobile-apps',
    num: '05',
    nav: 'Mobile products',
    icon: 'i-mobile',
    h1: 'Apps that stay in step with the core.',
    lead: 'Field teams, customers and internal operations on iOS and Android, with the offline behaviour and release discipline that production demands.',
    meta: [
      {
        key: 'Typical engagement',
        value: { kind: 'text', value: 'Platform build' }
      },
      {
        key: 'Team',
        value: { kind: 'text', value: '3–5 people' }
      },
      {
        key: 'First phase',
        value: { kind: 'text', value: 'Discovery, 2 weeks' }
      }
    ],
    problemHead: 'Mobile is the hardest place to hide a weak backend.',
    problem: [
      'Every screen depends on data that may be stale, a network that may vanish, and a user who will not read an error message. A beautiful prototype can still collapse in a warehouse basement.',
      'The failures are rarely visual. They are sync conflicts, a queue that loses work when the battery dies, or an app store review that arrives two days before launch.'
    ],
    mapCore: 'Sync layer',
    mapNodes: [
      'Offline store',
      'Conflicts',
      'Push',
      'Auth',
      'Payments',
      'Deep links',
      'Crashes',
      'Release'
    ],
    items: [
      { icon: 'i-mobile', title: 'Native patterns', body: 'Navigation, gestures and states that feel right on each platform rather than averaged between them.' },
      { icon: 'i-sync', title: 'Offline-first sync', body: 'A local store, a written conflict policy, and a queue that survives a dead battery.' },
      { icon: 'i-link', title: 'Notifications and deep links', body: 'Push that opens the right screen, and links that survive an install.' },
      { icon: 'i-card', title: 'Payments and purchases', body: 'Store billing, entitlements and receipts that reconcile with the backend.' },
      { icon: 'i-upload', title: 'Release management', body: 'Store listings, review notes, staged rollouts and a rollback plan.' },
      { icon: 'i-gauge', title: 'Monitoring', body: 'Crashes, cold starts and sync failures, alerted before users write in about them.' }
    ],
    rules: [
      { icon: 'i-sync', title: 'Design the offline case first', body: 'What the screen shows with no signal decides the data model more than the happy path does.' },
      { icon: 'i-mobile', title: 'One codebase where it helps', body: 'Shared logic and screens; native modules where the platform demands it. No dogma either way.' },
      { icon: 'i-upload', title: 'Rehearse the release', body: 'Store review is scheduled, not discovered. The build that ships is the build that was tested.' }
    ],
    stack: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Sentry'],
    stackNote: 'We choose per product, not per fashion. If the app is mostly forms and lists, one codebase is enough.',
    start: 'A two-week discovery that includes a field visit or a shadowing session, because the offline case is learned, not guessed.',
    related: [
      { href: '/web-platforms', label: 'Web platforms', num: 'C/04' },
      { href: '/ecommerce', label: 'Multi-vendor commerce', num: 'C/02' }
    ]
  },
  // 06 · /automation — Automation & models; typical engagement: Assessment & augmentation
  {
    slug: 'automation',
    num: '06',
    nav: 'Automation & models',
    icon: 'i-ai',
    h1: 'Automation where the work actually is.',
    lead: 'Document handling, triage, search and drafting, placed inside the systems your team already uses, with a review step and a way back.',
    meta: [
      {
        key: 'Typical engagement',
        value: { kind: 'text', value: 'Assessment & augmentation' }
      },
      {
        key: 'Team',
        value: { kind: 'text', value: '2–3 people' }
      },
      {
        key: 'First release',
        value: { kind: 'text', value: '4–10 weeks' }
      }
    ],
    problemHead: 'The first version usually works.',
    problem: [
      'The second month is where automated workflows fail: a new document format, a supplier that changes its invoice layout, a model that quietly gets worse after an update nobody announced.',
      'That is why we treat the surrounding system as the deliverable. Retrieval, rules, review, audit and fallback decide whether the thing survives contact with real work. The model is one component among several.'
    ],
    mapCore: 'Review queue',
    mapNodes: ['Intake', 'Retrieval', 'Rules', 'Evaluation', 'Audit', 'Fallback', 'Cost', 'Monitoring'],
    items: [
      { icon: 'i-target', title: 'Use-case and risk mapping', body: 'Where the volume is, what a mistake costs, and who signs off when it happens.' },
      { icon: 'i-search', title: 'Retrieval over your documents', body: 'Chunking, permissions, and citations that point at the source passage.' },
      { icon: 'i-workflow', title: 'Review and escalation', body: 'Queues, escalation rules and a record of every decision, including the rejected ones.' },
      { icon: 'i-gauge', title: 'Evaluation harness', body: 'A scored set of real cases, run on every change to a prompt, model or retrieval step.' },
      { icon: 'i-clock', title: 'Cost and latency', body: 'Routing, caching and smaller models where they are sufficient. Modelled before launch, not after the invoice.' },
      { icon: 'i-shield', title: 'Monitoring and rollback', body: 'Drift alerts, tested fallbacks, and a switch that returns the work to people.' }
    ],
    rules: [
      { icon: 'i-search', title: 'Start with the sample, not the demo', body: 'Two hundred real documents tell us more than any benchmark, and they expose the formats nobody mentioned.' },
      { icon: 'i-workflow', title: 'Rules where rules are enough', body: 'Deterministic logic is cheaper, faster and easier to audit. Models handle the residue that rules cannot.' },
      { icon: 'i-gauge', title: 'Measure in production', body: 'Accuracy, cost and time-to-review are tracked weekly against a baseline captured before launch.' }
    ],
    stack: ['Python', 'OpenAI', 'Anthropic', 'pgvector', 'LangGraph', 'Temporal'],
    stackNote: 'We keep the model behind an interface, so it can be replaced without rewriting the workflow around it.',
    start: 'A four-week assessment: sample data, a scored baseline, one workflow in production behind a review queue, and a written recommendation.',
    related: [
      { href: '/custom-software', label: 'Custom software', num: 'C/01' },
      { href: '/erp', label: 'ERP & operations', num: 'C/03' }
    ]
  }
] satisfies CapabilityContent[];
