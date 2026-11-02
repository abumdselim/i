import localFont from 'next/font/local';

/**
 * The five faces the legacy build embedded as base64 (see _build/fonts/fonts.css).
 * `scripts/sync-assets.mjs` decodes them into src/fonts/ and asserts the set.
 *
 * The `variable` names are what the tokens reference:
 *   --font-sans:    var(--font-barlow), …
 *   --font-display: var(--font-titillium), …
 *
 * Those variables are declared on :root, so the generated className must go on
 * <html>. On <body> the substitution is invalid at computed-value time and the
 * whole site silently falls back to the browser serif.
 *
 * --font-mono has no webfont: it stays the system monospace stack on purpose.
 */
export const barlow = localFont({
  src: [
    { path: '../fonts/barlow-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/barlow-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/barlow-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-barlow',
  display: 'swap',
  preload: true,
});

export const titillium = localFont({
  src: [
    { path: '../fonts/titillium-web-600.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/titillium-web-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-titillium',
  display: 'swap',
  preload: true,
});
