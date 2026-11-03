import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../globals.css';
import { Shell } from '@/components/Shell';
import { Toaster } from '@/components/Toaster';
import { barlow, titillium } from '@/lib/fonts';
import { paramForRoute } from '@/lib/routes';
import { readPages } from '@/lib/site';
import { BOOTSTRAP } from '@/lib/theme';

/**
 * The studio app's root layout (`(studio)` group). Fonts are the site's
 * files, copied into this package (`src/fonts/`) and served locally — no
 * CDN, no icon font, same voice. They are shared with the `(gate)` group
 * through `lib/fonts.ts`, so the login screen can never be taken down by a
 * data read failing here.
 */

export const metadata: Metadata = {
  title: 'Intactic Studio',
  description: 'The local admin panel for intactic.net — pages, sections, navigation, content and builds.',
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const pages = await readPages();
  const palettePages = pages.map((page) => ({
    param: paramForRoute(page.route),
    route: page.route,
    title: page.title,
    kind: page.kind,
  }));

  return (
    <html
      lang="en"
      data-theme="light"
      className={`${barlow.variable} ${titillium.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP }} />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Shell pages={palettePages}>{children}</Shell>
        <Toaster />
      </body>
    </html>
  );
}
