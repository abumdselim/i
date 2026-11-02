import type { NextConfig } from 'next';

/**
 * Intactic Studio — the local admin panel (docs/admin.md §2).
 *
 * It is a separate application from the site on purpose: `next-app/` keeps
 * `output: 'export'` and its build artefact never contains a line of this app.
 * The studio reads and writes `../next-app/data/*.json`; the site's build
 * validates those files and the gate judges the result.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The floating dev-tools badge sits on top of the sidebar's status lines.
  devIndicators: false,
  // Local tool, not a deployment: no image optimisation pipeline, no telemetry
  // endpoint of its own, and no attempt to reach the network at runtime.
  images: { unoptimized: true },
};

export default nextConfig;
