# Typography System Spec: Barlow + Titillium Web

**Version 1.0 · 2026-11-01 · Status: authoritative source of truth for all font decisions on the company website**

> বাংলা সারসংক্ষেপ: এই ডকুমেন্টে Barlow (বডি/UI) ও Titillium Web (হেডিং) কীভাবে Next.js সাইটে হালকা, দ্রুত ও সব ডিভাইসে রেসপনসিভভাবে ব্যবহার হবে তার পূর্ণ নিয়ম আছে। এআইকে এই ফাইল দিন এবং বলুন: "এই স্পেক হুবহু মেনে কাজ করো, বাইরে কিছু করবে না।"

## 0. Instructions for the AI agent (read first)

1. This document is the **single source of truth** for typography. If any request, existing code or your own preference conflicts with it, **stop and ask** instead of deviating.
2. Never add a font family, weight, style (italic) or subset that is not listed in Section 3 without a written approval recorded in Section 11 (Changelog).
3. Never hardcode `font-family` anywhere except the token definitions in Section 4.3.
4. After any change touching fonts, run the verification steps in Section 8 and report the results.
5. Update Section 11 (Changelog) and Section 9 (Measured budget) in the same change.

## 1. Goals and non-negotiables

| Goal | Rule |
| --- | --- |
| Professional, organized look | Two families only, strict role split, one type scale, no ad-hoc sizes |
| Lightweight | Self-hosted via `next/font`, Latin subset only, minimal static weights, no italics |
| Zero layout shift | Use `next/font` (automatic size-adjusted fallback), `display: "swap"`, no external font requests |
| Responsive | Fluid `clamp()` scale in `rem`, tested at 320px to 1920px |
| Accessible | Respects user font-size settings, supports 200% zoom, contrast 4.5:1 for body text |
| Bengali-safe | Latin fonts first, Noto Sans Bengali as per-glyph fallback, separate Bengali line-height and tracking rules |
| Maintainable | Fonts defined in one file, tokens in one CSS block, CI blocks violations |

## 2. Assumptions about the stack

- Next.js (App Router) with TypeScript, deployed to Vercel or Cloudflare.
- Tailwind CSS v4 (CSS-first `@theme`). If the project uses Tailwind v3, put the same tokens in `tailwind.config.ts` under `theme.extend.fontFamily` and `fontSize` (see 4.5).
- Both fonts are licensed under the SIL Open Font License 1.1 (free for commercial use, self-hosting allowed). Noto Sans Bengali is also OFL. Keep the license files in the repository (`/licenses/fonts/`).
- Barlow and Titillium Web are **static** fonts (not variable). Every weight is a separate file, so the weight list is the main performance lever.

## 3. Font roles and weight budget

| Role | Family | Weights | Used for |
| --- | --- | --- | --- |
| Body / UI | **Barlow** | 400, 500, 600 | Paragraphs (400), nav, labels, links, form text (500), emphasis and small subheads (600) |
| Display | **Titillium Web** | 600, 700 | H1, H2 (700); H3, H4, buttons, stat numbers (600) |
| Bengali fallback | **Noto Sans Bengali** | variable (benchmark, see 6.3) | Any Bengali glyph, automatically |
| Code (if needed) | system monospace stack | n/a | No extra font file; `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` |

**Total Latin files: 5** (3 Barlow + 2 Titillium Web), normal style only.

**Forbidden without approval:** Barlow 100/200/300/700/800/900, any italic, Barlow Condensed / Semi Condensed, Titillium Web 200/300/400/900, `latin-ext` subset (add it only if content really needs it, then log it).

## 4. Implementation

### 4.1 Single font definition file

`src/lib/fonts.ts`

```ts
import { Barlow, Titillium_Web, Noto_Sans_Bengali } from "next/font/google";

export const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--font-barlow",
});

export const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal"],
  display: "swap",
  variable: "--font-titillium",
});

// Bengali: not preloaded in the shared layout. The browser downloads it only
// when a Bengali glyph is actually rendered (next/font emits unicode-range).
export const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  display: "swap",
  variable: "--font-bengali",
  preload: false,
});
```

Rules: `next/font` self-hosts the files and generates a size-adjusted fallback font automatically. Do **not** use `<link>` to Google Fonts, `@import`, or Fontsource duplicates.

### 4.2 Root layout

`src/app/layout.tsx`

```tsx
import { barlow, titillium, notoBengali } from "@/lib/fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${titillium.variable} ${notoBengali.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
```

For Bengali-primary routes (for example `/bn`), set `lang="bn"` on that route's `<html>` (via a root layout per locale) and, in that route segment, preload Bengali by creating a second instance with `preload: true` only if measurements show a flash problem. Always set the correct `lang`; the CSS in 4.4 depends on it.

### 4.3 Design tokens (single place for `font-family`)

`src/app/globals.css`

```css
@import "tailwindcss";

/* `inline` is required so the next/font CSS variables resolve at the element. */
@theme inline {
  --font-sans: var(--font-barlow), var(--font-bengali), ui-sans-serif, system-ui,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-display: var(--font-titillium), var(--font-barlow), var(--font-bengali),
    ui-sans-serif, system-ui, "Segoe UI", Arial, sans-serif;
}
```

The Latin family is always first. Barlow has no Bengali glyphs, so the browser falls back **per character** to Noto Sans Bengali. That is the intended behaviour.

### 4.4 Base styles, fluid scale and Bengali rules

Scale: fluid between a 360px and 1280px viewport, in `rem` plus a small `vw` term. Using `rem` keeps user font-size preferences and browser zoom working (never use `px` or pure `vw` for font sizes).

```css
:root {
  --text-sm:   clamp(0.875rem,  0.850rem + 0.109vw, 0.9375rem); /* 14 → 15 px */
  --text-base: clamp(1.0625rem, 1.038rem + 0.109vw, 1.125rem);  /* 17 → 18 px */
  --text-lead: clamp(1.125rem,  1.027rem + 0.435vw, 1.375rem);  /* 18 → 22 px */
  --text-h4:   clamp(1.25rem,   1.152rem + 0.435vw, 1.5rem);    /* 20 → 24 px */
  --text-h3:   clamp(1.5rem,    1.304rem + 0.870vw, 2rem);      /* 24 → 32 px */
  --text-h2:   clamp(1.875rem,  1.435rem + 1.957vw, 3rem);      /* 30 → 48 px */
  --text-h1:   clamp(2.25rem,   1.565rem + 3.043vw, 4rem);      /* 36 → 64 px */
}

html {
  font-size: 100%; /* never set px here; respect user settings */
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body {
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: var(--text-base);
  line-height: 1.55;
  color: var(--color-text);
  font-kerning: normal;
  -webkit-font-smoothing: antialiased;   /* macOS only, harmless elsewhere */
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  text-wrap: balance;            /* nicer line breaks in headings */
}
h1 { font-size: var(--text-h1); font-weight: 700; line-height: 1.1;  letter-spacing: -0.01em; }
h2 { font-size: var(--text-h2); font-weight: 700; line-height: 1.15; letter-spacing: -0.01em; }
h3 { font-size: var(--text-h3); font-weight: 600; line-height: 1.2; }
h4 { font-size: var(--text-h4); font-weight: 600; line-height: 1.25; }

p, li { text-wrap: pretty; max-width: 68ch; }   /* readable line length */
.lead { font-size: var(--text-lead); line-height: 1.5; }
small, .text-sm { font-size: var(--text-sm); }

nav, label, .ui { font-weight: 500; }
strong, b { font-weight: 600; }

button, .btn {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--text-base);
  letter-spacing: 0.01em;
}

/* Numbers in stats/tables: only enable if the font supports it; verify visually. */
.tabular { font-variant-numeric: tabular-nums; }

/* ---------- Bengali ---------- */
:lang(bn) body, body:lang(bn) { line-height: 1.75; }
:lang(bn) h1, :lang(bn) h2, :lang(bn) h3, :lang(bn) h4 {
  line-height: 1.35;
  letter-spacing: 0;   /* negative tracking breaks conjuncts (যুক্তাক্ষর); always reset */
}
:lang(bn) button, :lang(bn) .btn { letter-spacing: 0; }
```

Important: `letter-spacing` must be `0` for Bengali text. Mixed English/Bengali inside one element is allowed; if a Bengali sentence is embedded in an English page, wrap it in `<span lang="bn">`.

### 4.5 Tailwind v3 equivalent (only if the project is on v3)

```ts
// tailwind.config.ts
fontFamily: {
  sans: ["var(--font-barlow)", "var(--font-bengali)", "ui-sans-serif", "system-ui", "sans-serif"],
  display: ["var(--font-titillium)", "var(--font-barlow)", "var(--font-bengali)", "sans-serif"],
},
```

Use the utility classes `font-sans` and `font-display`; never write a raw font name in a class or inline style.

## 5. Responsive rules

- Test widths: **320, 360, 390, 768, 1024, 1280, 1440, 1920** px.
- Body copy never below 17px (Barlow is a slightly narrow face, 16px feels small). Small/caption text never below 14px.
- Headings must not overflow at 320px: allow wrapping, use `text-wrap: balance`, avoid `white-space: nowrap`, and use `overflow-wrap: anywhere` only on user-generated content.
- Use `rem` for font sizes and line heights without units. Do not use `vw` alone.
- Buttons and tap targets: at least 44×44 px.
- Keep the Titillium Web / Barlow combination consistent: headings never use Barlow above H4, paragraphs never use Titillium Web.

## 6. Performance rules

### 6.1 What `next/font` already does (do not redo manually)

Self-hosting at build time, `@font-face` generation, long-lived immutable caching of the files under `/_next/static/media/`, no request to Google at runtime, and a size-adjusted fallback to reduce layout shift.

### 6.2 Rules for the team and the AI

1. Keep the weight list exactly as in Section 3. Every extra weight is another download.
2. No italics. Use `<em>` sparingly; browsers will synthesize a slant if absolutely necessary (acceptable for rare use, not for design).
3. Do not render critical text in a weight that is not preloaded; use only 400/500/600 (Barlow) and 600/700 (Titillium).
4. Do not use icon fonts. Use inline SVG or `lucide-react` with tree-shaking.
5. Do not add `<link rel="preload">` for fonts by hand; `next/font` handles it.
6. CSP: because fonts are self-hosted, `font-src 'self'` is sufficient. No `fonts.googleapis.com` / `fonts.gstatic.com` allowances.

### 6.3 Bengali font strategy

- Noto Sans Bengali is large compared with the Latin files. It must **not** be preloaded in the shared layout (`preload: false`, see 4.1).
- Benchmark two variants once and record the result in Section 9: (a) variable font with no `weight` option, (b) static weights `["400", "600"]`. Choose the smaller transfer size for the weights actually used.
- If the Bengali flash (swap) is noticeable on Bengali-primary pages, enable preloading only in that route segment.

## 7. Accessibility rules

- Never lock font size with `px` on `html`/`body`; the layout must survive browser default font size changes and **200% zoom** without horizontal scroll (WCAG 1.4.4, 1.4.10).
- Body text contrast at least **4.5:1**, large text at least 3:1.
- Set the `lang` attribute correctly (`en`, `bn`) so screen readers and hyphenation behave.
- Avoid `text-transform: uppercase` for Bengali (no meaning) and avoid uppercase for long English strings.
- Do not use light weights for small text. Minimum weight for body is 400.

## 8. Verification (run after every font-related change)

### 8.1 Build and file check

```bash
npm run build
ls -lh .next/static/media/*.woff2   # expect Latin files for exactly 5 weights + Bengali file(s)
```

If more than the expected Latin files appear, a weight, style or subset was added by mistake. Fix before merging.

### 8.2 Static policy check (CI)

```bash
# 1) No external font hosts anywhere in source
! grep -R "fonts.googleapis.com\|fonts.gstatic.com" src/ public/

# 2) No hardcoded font-family outside globals.css token block
! grep -R --include="*.{ts,tsx,css}" -n "font-family" src/ | grep -v "src/app/globals.css"

# 3) Only fonts.ts may import next/font
! grep -R -l "next/font" src/ | grep -v "src/lib/fonts.ts"
```

### 8.3 Runtime test (Playwright)

```ts
import { test, expect } from "@playwright/test";

test("fonts load locally and no external font requests", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (r) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) external.push(r.url());
  });

  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const loaded = await page.evaluate(() =>
    [...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family} ${f.weight}`)
  );

  expect(external).toEqual([]);
  expect(loaded.some((f) => /barlow/i.test(f))).toBeTruthy();
  expect(loaded.some((f) => /titillium/i.test(f))).toBeTruthy();
});
```

(next/font renames families internally, for example `__Barlow_xxxx`, so match by substring and case-insensitively.)

### 8.4 Lighthouse targets (mobile, throttled)

- CLS < 0.1 (target 0), LCP < 2.5 s, no "Ensure text remains visible during webfont load" warning, no "Preload key requests" font warnings.
- Run on at least: Home, a long-text page, and a Bengali page.

### 8.5 Visual regression

Screenshots at 360, 768 and 1440 px for Home, Services, Blog post and Contact, in English and Bengali. Review any diff manually before updating the baselines.

## 9. Measured budget (fill in on first build, then keep updated)

| Item | Value |
| --- | --- |
| Barlow 400 / 500 / 600 (woff2, latin) | *measure* |
| Titillium Web 600 / 700 (woff2, latin) | *measure* |
| Noto Sans Bengali (chosen variant) | *measure* |
| Total Latin font transfer | *measure* |
| Rule | Total Latin font transfer must not grow by more than 10% without an approved changelog entry |

Do not invent numbers. Record what the build actually produces.

## 10. Do and don't (quick reference)

**Do**

- Edit fonts only in `src/lib/fonts.ts` and tokens only in `globals.css`.
- Use `font-sans` for text and `font-display` for headings and buttons.
- Use the fluid scale variables, not arbitrary pixel sizes.
- Set `lang` correctly and keep Bengali rules in Section 4.4.
- Document every change in Section 11.

**Don't**

- Don't add weights, italics, extra subsets or extra families silently.
- Don't import fonts through CSS `@import` or `<link>`.
- Don't use negative letter-spacing on Bengali text.
- Don't use Titillium Web for paragraphs or small text.
- Don't set font sizes in `px`, and don't use `vw` alone.
- Don't preload Bengali in the shared layout.
- Don't "fix" a visual issue by overriding `font-family` locally; fix the token instead.

## 11. Change log (append only)

| Date | Change | Reason | Approved by |
| --- | --- | --- | --- |
| 2026-11-01 | Initial spec: Barlow 400/500/600, Titillium Web 600/700, Noto Sans Bengali fallback | Initial typography system | Company |

## 12. Acceptance checklist

- [ ] Only `src/lib/fonts.ts` imports `next/font`
- [ ] Exactly 5 Latin font files in the build output
- [ ] No requests to Google font hosts at runtime
- [ ] Fluid scale tokens in place; no hardcoded font sizes in components
- [ ] Bengali rules (`line-height`, `letter-spacing: 0`) verified on a Bengali page
- [ ] Lighthouse mobile: CLS < 0.1, LCP < 2.5 s
- [ ] 200% zoom and 320px width: no horizontal scroll, no clipped text
- [ ] Playwright and CI policy checks pass
- [ ] Section 9 and Section 11 updated

## 13. Ready-to-paste prompt for the AI

```text
You are working on our company website (Next.js App Router, TypeScript, Tailwind CSS).
Read the attached "Typography System Spec: Barlow + Titillium Web" fully before changing anything.

Tasks:
1. Implement Sections 4.1 to 4.4 exactly (fonts.ts, layout.tsx, globals.css).
2. Add the CI policy checks from 8.2 and the Playwright test from 8.3.
3. Run the verification steps in Section 8 and report the real results.
4. Fill in Section 9 with measured values and add an entry to Section 11.

Constraints:
- Follow the spec literally. If something conflicts with it or is unclear, stop and ask.
- Do not add fonts, weights, italics, or subsets that are not in Section 3.
- Do not hardcode font-family or font sizes outside the tokens.
- Do not guess performance numbers; measure them.
```
