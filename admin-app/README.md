# Intactic Studio — the local admin panel

A second application, beside the site, that edits the site's source. It runs on
`http://127.0.0.1:3001`, writes `../next-app/data/*.json`, and triggers the site's own
`npm run verify`. The site is still a static export; the panel never ships with it.

Read `docs/admin.md` for the phase plan and the reasoning, and `docs/DECISIONS.md` D-15…D-17 for
the three decisions this app rests on.

## Run it

```powershell
cd admin-app
npm install          # once
npm run dev          # http://127.0.0.1:3001  (localhost only)
```

The site should be running too, for the "Open page" links:

```powershell
cd next-app
npm run dev          # http://localhost:3000
```

The built preview (`/build`) serves `next-app/out` on `http://127.0.0.1:8080`; the panel starts and
stops that server itself.

## What it edits

| Screen | Writes |
|---|---|
| `/` dashboard | nothing — counts, last build, the route table |
| `/pages` → `/pages/<route>` | page title, description, robots, the CTA switch, and per-route `hidden` / `order` |
| `/navigation` | the seven primary links (label, destination, key, order) |
| `/footer` | the brand blurb and email, the footer columns and their links |
| `/content/capability/<slug>` · `/content/product/<slug>` | every field the templated pages render |
| `/build` | runs `npm run verify`; starts, stops and frames the built preview |

## How a save works

1. The form posts JSON to an API route (`src/app/api/*`).
2. `src/lib/rules.ts` validates the whole file and returns every problem with its field path.
   Nothing is written unless the file passes.
3. `src/lib/site.ts` writes `<file>.tmp`, copies the previous file to `<file>.bak`, then renames the
   temp file over the target. A failed write leaves the old file intact.
4. The next build validates the same JSON again (the site's schema) and the gate compares every
   route with the frozen reference. The gate is the judge, not the panel.

## Where the data lives

| File | Read by |
|---|---|
| `next-app/data/pages.json` | the route manifest, per-page metadata, the CTA flag |
| `next-app/data/sections.json` | the section registry — the site renders from it, the studio lists controls from it |
| `next-app/data/site-config.json` | hidden sections, section order, navigation, footer |
| `next-app/data/capabilities.json` · `products.json` | the ten templated pages |
| `next-app/src/components/icons.ts` | the sprite — the icon picker reads its 68 names and previews |

The registry is data (D-17) because both applications need it and neither can import the other's
modules. Add a section to a page: a node in the page component plus an entry in `sections.json`.

## Limits

- **Localhost only, no auth.** The dev server binds `127.0.0.1`. Moving it to a LAN or online needs
  auth and a different write layer first (D-15).
- **No deploy wiring.** Pushing or calling a deploy hook waits for a host decision.
- **No baseline approval button.** An intended copy change fails the gate until
  `next-app/scripts/approve.py` is run by hand; that is the design.
- **No page add/delete.** Routes are the manifest; adding one is a code change with a redirect,
  a sitemap entry and a baseline.
- **Preview theme** is the site's own toggle inside the frame; the studio cannot set another
  origin's `localStorage`.
- **One build at a time.** A second request is refused rather than queued.

## Verify it

```powershell
npm run typecheck    # tsc --noEmit
npm run build        # the studio's own export (not the site's)
npm run lint
```

The site's proof is separate and authoritative:

```powershell
cd ../next-app
npm run verify       # build + parity gate + lint — 19/19, 0 errors
```
