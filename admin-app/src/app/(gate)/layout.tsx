import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../globals.css';
import { barlow, titillium } from '@/lib/fonts';
import { BOOTSTRAP } from '@/lib/theme';

/**
 * The gate group's root layout: the login screen and nothing else. It reads
 * no data, so a store failure — the local checkout or the GitHub API — can
 * never take the sign-in form down with it (D-22).
 */
export const metadata: Metadata = {
  title: 'Intactic Studio',
  description: 'The gate to the studio that edits intactic.net.',
  robots: { index: false, follow: false },
};

export default function GateLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${barlow.variable} ${titillium.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP }} />
        {children}
      </body>
    </html>
  );
}
