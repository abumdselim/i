# Product facts

Everything on the four product pages is traceable to a repository or was stated by the
owner. This file records the source of each claim so a future edit does not turn a fact
into a slogan.

Repositories are private. They are **not** linked from the public site; the public link
is the product domain.

---

## P/01 — Shamlai

- **Domain:** shamlai.app
- **Repository:** `abumdselim/shamlai` (Next.js 16.3, React 19, TypeScript, Cloudflare)
- **Status on site:** Live · Web, PWA, mobile

**Evidenced in the repository**
- Multi-tenant SaaS: customer storefront + back-office CMS + platform super-admin panel.
- POS and order pipeline (pending → delivered), inventory with movements, customer and
  supplier ledgers, expenses and profit reporting, staff management with role-based
  permissions, subscription management, feature flags per tenant.
- Offline-first: sales, receipts and stock movements continue without a network and sync
  with duplicate protection; PWA installable.
- Assistant features: store-grounded streaming chat, deal briefing, voice commands,
  automatic restock suggestions.
- Infrastructure: Cloudflare Workers (OpenNext), D1 as source of truth with versioned
  migrations, R2 for media, Workers AI and Gemini for model calls, Turnstile on public
  forms, TOTP for super-admin, CI gates (tsc, lint, test suite) before deploy.

**Owner-stated (usable claims)**
- Works offline; responsive on all devices; local agentic assistant; suitable for 12+
  categories of shop or business.

**Do not claim**
- Specific merchant counts, revenue figures or uptime percentages.
- Any integration that is not in the repository (no accounting-software connectors, no
  payment-gateway list beyond what the code shows).

---

## P/02 — Pharmasys

- **Domain:** pharmasys.app (media CDN: cdn.pharmasys.app)
- **Repository:** `abumdselim/Pharmasys` (vanilla JS + Tailwind, SQLite, Cloudflare)
- **Status on site:** Live · v3.5 · Web, desktop, mobile

**Evidenced in the repository README**
- Pharmacy ERP + POS + regulatory layer for Bangladeshi retail and hospital pharmacies.
- Catalogue of 25,929 medicines; 11,593 real package images; 7,529+ DGDA DAR numbers;
  334 factory licences; 1,893 antibiotic flags; 282 controlled-narcotic records.
- Piece/strip/box fraction engine (rounding loss pushed to zero), generic alternative and
  price-saver finder, DGDA registration and licence checks, prescription sentinel,
  packshot confirmation.
- Stack: SQLite (WAL) on the counter, Cloudflare R2 + Pages/Workers for media and hosting,
  vanilla JS front end with no npm runtime dependencies, Python tooling for packshot
  refinement.

**Owner-stated (usable claims)**
- 25,000+ Bangladeshi medicines; generic, manufacturer, usage and alternatives shown;
  verified against the official medicine database; zero-entry start (record only what is
  in stock to begin).

**Do not claim**
- Clinical advice, diagnostic capability, or that the product replaces a pharmacist.
- Regulatory approval of Pharmasys itself (it surfaces DGDA data; it is not a regulator).

---

## P/03 — Pdfing Pro

- **Domain:** pdfingpro.intactic.net
- **Repository:** `abumdselim/pdfingpro` (Next.js 15, React 18, Cloudflare, Electron)
- **Status on site:** Beta · 1.0 · Web, desktop, PWA

**Evidenced in the repository**
- 109 tools under `app/(tools)`, covering organise/assemble, conversion in both
  directions (Word, Excel, PowerPoint, HTML, Markdown, images, scans, email), security
  (encrypt, decrypt, redact, sanitise, flatten, metadata), OCR and extraction, signatures
  and forms, comparison, batch workflows.
- Libraries include pdf-lib, pdf.js, Tesseract, docx, xlsx, pptxgenjs, mammoth, JSZip,
  zxing (barcodes), kokoro (speech), HEIC/TIFF support.
- Single codebase produces web, PWA and Electron desktop builds; server-side processing
  for heavy work.

**Owner-stated (usable claims)**
- Server-side, therefore safer; built with security as a priority; complete PDF design
  and editing toolset.

**Do not claim**
- That files are end-to-end encrypted, unless that is implemented.
- A specific retention period — the copy says "processed per request" and "temporary by
  design", which matches the architecture, not a written policy.

---

## P/04 — iCounsel

- **Domain:** icounsel.intactic.net
- **Repository:** `abumdselim/iCounsel` (Next.js 16.3, React 19, Prisma 6.19, PostgreSQL,
  Gemini)
- **Status on site:** Live · Web, desktop

**Evidenced in the repository README**
- Practice operating system for Bangladesh Supreme Court advocates and district chambers.
- Modules: courtroom command centre (cause list, hearing countdown, judicial calendar
  with court terms), AI judgment synthesis (ratio decidendi, obiter, material facts,
  statutes, precedents), court calendar engine for 2026, legal calculators (Court Fees
  Act 1870 slabs, Limitation Act 1908 periods, Penal Code offence/bail classification),
  bilingual vakalatnama generator (HCDC and district formats), WhatsApp client dispatch,
  stay/bail expiry watchdog, case dossier with kanban pipeline and fee ledger.

**Owner-stated (usable claims)**
- Works offline; Bangladesh law database included; highly interactive and easy to use.

**Do not claim**
- Legal advice, or that generated summaries are authoritative — the copy frames them as
  extractions to be checked.
- Court filing integration that the repository does not implement.

---

## Industries used on the site

Derived from the products, not invented: retail & wholesale (Shamlai), pharmacy &
healthcare (Pharmasys), legal practice (iCounsel), document-heavy offices (Pdfing Pro).
The fifth cell is a call to action, not a claim of experience.
