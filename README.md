# Intactic — corporate website

The marketing site for **Intactic**, a software engineering studio. Nineteen pages, one design
system, four product pages, and a written decision log.

**19 pages** · one design system · four product pages · a written decision log.

| | |
|---|---|
| Live domain | intactic.net |
| Local master | `D:\The Intactic Atelier` |
| Source | `next-app/src` — Next.js 16, React 19, TypeScript, `output: 'export'` |
| Build | `cd next-app` then `npm run build` → `next-app/out/` |
| Verify | `cd next-app` then `npm run verify` — build + the parity gate |
| Studio | `admin-app/` — the local admin panel, `http://127.0.0.1:3001` |
| Legacy | root `*.html` (the build currently live) · `legacy/` (the generator that produced it) |

## The studio

The admin panel is a second application, not a runtime CMS: it edits the JSON the site builds from
(`next-app/data/`), then runs the site's own `npm run verify`. It binds `127.0.0.1:3001`, never
ships in the export, and its saves are validated, atomic and backed up. `cd admin-app` then
`npm run dev`; the site should be on `http://localhost:3000` beside it. Plan and limits:
`docs/admin.md`, `admin-app/README.md`.

## Two artefacts, one direction

The site was ported to Next.js on 2026-11-02 without changing a word of copy. While the port was
proving itself, both builds existed side by side and a gate compared them page by page: `<main>`
text character for character, a `tag.class` signature, the title, and the tokens in the CSS
against a frozen snapshot in `next-app/qa/reference/`. That comparison is why the port is
trustworthy and why the legacy output can still be inspected.

- **`next-app/`** is the source. Content, routes and figure geometry are typed literals; the design
  system lives in `next-app/src/styles/globals.css` and `next-app/src/components/icons.ts`.
- **Root `*.html`** is the legacy output, kept because it is what the domain serves today. It is
  not edited by hand — it is the artefact the gate measured against.
- **`legacy/`** is the retired generator, kept as content history. Nothing reads it.

Deployment is the last open step; `next-app/out/` is the artefact to publish. Hosting notes:
`next-app/README.md`.

## Start here

- [Project guide](docs/README.md) — structure, build, deploy, constraints
- [Migration handover](docs/Go.md) — plan and verified state of the TypeScript port
- [Design system](docs/DESIGN-SYSTEM.md) — colour, type, layout, components, icons
- [Page inventory](docs/PAGES.md) — every page, its purpose and its template
- [Decisions](docs/DECISIONS.md) — why the site is built this way
- [Changelog](docs/CHANGELOG.md) — every implementation change, newest first
- [Product facts](docs/PRODUCTS.md) — sources for every product claim
- [The app](next-app/README.md) — how the Next.js build is laid out

## Pages

Home · Capabilities (`services.html`) · six capability pages (custom software, commerce,
ERP, web, mobile, automation) · Products (`products.html`) · Shamlai · Pharmasys ·
Pdfing Pro · iCounsel · Approach · Engagements · Process · Studio · Contact · 404.

## Constraints

No gradients. Opaque fixed header on every device. Light mode by default, dark theme
opt-in. No emoji, no icon fonts, no CDN. No invented metrics.

---

© Intactic · hello@intactic.net
