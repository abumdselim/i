# Page inventory

19 pages, all in the repository root. Every page is self-contained and shares the same
header, footer and call-to-action block.

## Navigation

Primary navigation (7 items + one action):

| Label | Target | Active key |
|---|---|---|
| Capabilities | `services.html` | `capabilities` |
| Products | `products.html` | `products` |
| Approach | `approach.html` | `approach` |
| Engagements | `engagements.html` | `engagements` |
| Process | `process.html` | `process` |
| Studio | `about.html` | `studio` |
| Contact | `contact.html` | `contact` |
| *Start a project* | `contact.html` | — (button) |

Footer columns: brand + Capabilities (6) + Products (4 + all) + Studio (5) + Direct (3).

## Pages

| # | File | Title | Purpose | Primary sections |
|---|---|---|---|---|
| 1 | `index.html` | Intactic — software engineering studio | The thesis, the six capabilities, the products, how we work, how to engage | Hero + plate, Capabilities, Intelligence (dark), Products, Industries, Stack, Process, Engagements + standards |
| 2 | `services.html` | Capabilities — Intactic | Hub for the six disciplines | Six capability cards, three combinations, link-outs |
| 3 | `custom-software.html` | Custom software — Intactic | Capability C/01 | Problem + system map, six deliverables, three rules, stack, related |
| 4 | `ecommerce.html` | Multi-vendor commerce — Intactic | Capability C/02 | as above, commerce-specific |
| 5 | `erp.html` | ERP & operations — Intactic | Capability C/03 | as above, ERP-specific |
| 6 | `web-platforms.html` | Web platforms — Intactic | Capability C/04 | as above, web-specific |
| 7 | `mobile-apps.html` | Mobile products — Intactic | Capability C/05 | as above, mobile-specific |
| 8 | `automation.html` | Automation & models — Intactic | Capability C/06 | as above, automation-specific |
| 9 | `products.html` | Products — Intactic | Hub for the four products | Four product cards, one-standard section |
| 10 | `shamlai.html` | Shamlai — Intactic | Product P/01 | Problem + map, six features, engineering, stack, built-for, more products |
| 11 | `pharmasys.html` | Pharmasys — Intactic | Product P/02 | as above |
| 12 | `pdfing-pro.html` | Pdfing Pro — Intactic | Product P/03 | as above |
| 13 | `icounsel.html` | iCounsel — Intactic | Product P/04 | as above |
| 14 | `approach.html` | Approach — Intactic | How decisions are made | System first, fit / not fit, three layers (dark), five rules |
| 15 | `engagements.html` | Engagements — Intactic | Commercial models | Three models in detail, pricing, expectations, contract FAQ |
| 16 | `process.html` | Process — Intactic | Delivery method | Four phases, weekly rhythm, after launch, handover pack |
| 17 | `about.html` | Studio — Intactic | Who we are | Why we work this way, four principles, boundaries, working together |
| 18 | `contact.html` | Contact — Intactic | Enquiry | Brief form (mailto), direct lines, next steps, three questions |
| 19 | `404.html` | Page not found — Intactic | Not found | Message, two routes back (noindex) |

## Page templates

Three templates produce the catalogue:

1. **Editorial** — hand-written fragments in `_build/pages/`: home, capabilities hub,
   approach, engagements, process, about, contact, 404.
2. **Capability** (`catpage.py`, data in `cats.py`) — page head with meta, problem +
   system map, six deliverables, three rules, stack, related capabilities.
3. **Product** (`prodpage.py`, data in `products.py`) — page head with domain, status and
   platforms, problem + system map, six features, engineering rules, stack, built-for,
   more products. The hub and the home band are generated from the same data.

## URL map

```
/                                  index.html
/services.html                     capabilities hub
/custom-software.html              C/01
/ecommerce.html                    C/02
/erp.html                          C/03
/web-platforms.html                C/04
/mobile-apps.html                  C/05
/automation.html                   C/06
/products.html                     products hub
/shamlai.html                      P/01
/pharmasys.html                    P/02
/pdfing-pro.html                   P/03
/icounsel.html                     P/04
/approach.html  /engagements.html  /process.html  /about.html  /contact.html
/404.html
/robots.txt  /sitemap.xml
```
