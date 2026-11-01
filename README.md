# Intactic — corporate website

The marketing site for **Intactic**, a software engineering studio. Static HTML, fully
self-contained pages, no runtime dependencies.

**19 pages** · one design system · four product pages · a written decision log.

| | |
|---|---|
| Live domain | intactic.net |
| Local master | `D:\The Intactic Atelier` |
| Build | `python _build\build.py` |
| Output | repository root (`index.html` … `404.html`) |

## Start here

- [Project guide](docs/README.md) — structure, build, deploy, constraints
- [Design system](docs/DESIGN-SYSTEM.md) — colour, type, layout, components, icons
- [Page inventory](docs/PAGES.md) — every page, its purpose and its template
- [Decisions](docs/DECISIONS.md) — why the site is built this way
- [Changelog](docs/CHANGELOG.md) — every implementation change, newest first
- [Product facts](docs/PRODUCTS.md) — sources for every product claim

## Pages

Home · Capabilities (`services.html`) · six capability pages (custom software, commerce,
ERP, web, mobile, automation) · Products (`products.html`) · Shamlai · Pharmasys ·
Pdfing Pro · iCounsel · Approach · Engagements · Process · Studio · Contact · 404.

## Constraints

No gradients. Opaque fixed header on every device. Light mode by default, dark theme
opt-in. No emoji, no icon fonts, no CDN. No invented metrics.

---

© Intactic · hello@intactic.net
