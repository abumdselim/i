import type { NextConfig } from 'next';

/**
 * The site is deployed as files today (see docs/DECISIONS.md D-01/D-02), so the
 * port keeps that property: `output: 'export'` writes plain HTML into `out/`,
 * which is also what scripts/gate.mjs reads for structural parity.
 *
 * Consequence: `redirects()` is not available in export mode. Legacy `*.html`
 * URLs are handled by `public/_redirects` (generated), which Netlify and
 * Cloudflare Pages both read. See docs/MIGRATION.md for nginx/Vercel equivalents.
 */
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: false,
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;
