import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@/styles/globals.css';
import { BOOTSTRAP } from '@/components/bootstrap-script';
import { CookieNotice } from '@/components/CookieNotice';
import { IconSprite } from '@/components/IconSprite';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { barlow, titillium } from '@/lib/fonts';

export const metadata: Metadata = {
  metadataBase: new URL('https://intactic.net'),
  title: 'Intactic — software engineering studio',
  description:
    'Intactic designs and builds custom platforms, multi-vendor commerce, ERP and product interfaces for companies that have outgrown off-the-shelf software.',
  applicationName: 'Intactic',
  authors: [{ name: 'Intactic', url: 'https://intactic.net' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#115fc8',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The bootstrap below mutates both attributes before React hydrates, so the
    // element opts out of the diff — otherwise every page logs a mismatch.
    <html
      lang="en"
      data-theme="light"
      className={`${barlow.variable} ${titillium.variable} no-js`}
      suppressHydrationWarning
    >
      <body id="top">
        {/* First node in <body>: runs while the rest of the document is still
            parsing, so the theme and the reveal gate are set before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP }} />
        <IconSprite />
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <CookieNotice />
      </body>
    </html>
  );
}
