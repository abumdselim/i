import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import './globals.css';
import { Shell } from '@/components/Shell';
import { Toaster } from '@/components/Toaster';

/**
 * The studio's shell. Fonts are the site's files, copied into this package
 * (`src/fonts/`) and served locally — no CDN, no icon font, same voice.
 */
const barlow = localFont({
  src: [
    { path: '../fonts/barlow-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/barlow-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/barlow-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-barlow',
  display: 'swap',
});

const titillium = localFont({
  src: [
    { path: '../fonts/titillium-web-600.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/titillium-web-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-titillium',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Intactic Studio',
  description: 'The local admin panel for intactic.net — pages, sections, navigation, content and builds.',
  robots: { index: false, follow: false },
};

/** Runs before first paint so the chosen theme does not flash. */
const BOOTSTRAP = `(function(){try{var t=localStorage.getItem('intactic-studio-theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
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
        <Shell>{children}</Shell>
        <Toaster />
      </body>
    </html>
  );
}
