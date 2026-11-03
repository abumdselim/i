import localFont from 'next/font/local';

/**
 * The site's two families, self-hosted — the studio's files are copies of the
 * site's (docs/admin.md §5). Shared by both root layouts: the `(studio)` app
 * group and the `(gate)` group each render their own `<html>`, so the font
 * setup lives here once.
 */
export const barlow = localFont({
  src: [
    { path: '../fonts/barlow-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/barlow-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/barlow-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-barlow',
  display: 'swap',
});

export const titillium = localFont({
  src: [
    { path: '../fonts/titillium-web-600.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/titillium-web-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-titillium',
  display: 'swap',
});
