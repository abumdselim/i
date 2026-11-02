#!/usr/bin/env node
/**
 * Capture the same 19 routes from both builds, at three widths and two themes.
 *
 * The comparison is only meaningful if both sides are frozen the same way:
 *   - reduced motion, so nothing is mid-transition in either build;
 *   - the theme is set through localStorage before any page script runs;
 *   - fonts are awaited, because the legacy build inlines them and the port
 *     preloads them — a screenshot taken mid-load is a false positive.
 *
 * Usage: node scripts/capture.mjs [--only route]
 *   legacy  http://127.0.0.1:8081  (repository root)
 *   port    http://127.0.0.1:8080  (next-app/out)
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { PAGES } from './manifest.mjs';

const LEGACY = 'http://127.0.0.1:8081';
const PORT = 'http://127.0.0.1:8080';
const OUT = path.resolve('qa');

const VIEWPORTS = [
  { name: '390', width: 390, height: 844 },
  { name: '834', width: 834, height: 1112 },
  { name: '1440', width: 1440, height: 900 },
];
const THEMES = ['light', 'dark'];

const routes = PAGES.map((page) => ({
  name: page.slug || 'home',
  legacy: page.slug === '' ? '/index.html' : `/${page.file}`,
  port: page.slug === '' ? '/' : page.kind === 'not-found' ? '/404.html' : `/${page.slug}`,
}));

const onlyFlag = process.argv.indexOf('--only');
const only = onlyFlag > -1 ? process.argv[onlyFlag + 1] : null;
const selected = only ? routes.filter((route) => route.name === only) : routes;

// `channel: 'chromium'` uses the full browser in new-headless mode; the
// headless-shell download is a separate artefact and is not always fetched.
const browser = await chromium.launch({ channel: 'chromium' });

const written = [];
let failures = 0;

for (const viewport of VIEWPORTS) {
  for (const theme of THEMES) {
    for (const route of selected) {
      for (const [build, base, url] of [
        ['legacy', LEGACY, route.legacy],
        ['port', PORT, route.port],
      ]) {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: 1,
          reducedMotion: 'reduce',
          colorScheme: theme === 'dark' ? 'dark' : 'light',
        });
        await context.addInitScript((value) => {
          try {
            localStorage.setItem('intactic-theme', value);
          } catch {
            /* storage disabled */
          }
        }, theme);

        const page = await context.newPage();
        try {
          await page.goto(base + url, { waitUntil: 'networkidle', timeout: 45000 });
          await page.evaluate(() => document.fonts.ready);
          await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
          // The plate cascade runs on animation-delay (up to ~0.84s) and reduced motion
          // only shortens the duration, not the delay. A screenshot taken before it
          // settles catches some cells at a different point in the stagger on each
          // build — a false positive that looks like a layout difference.
          await page.waitForTimeout(1600);

          const dir = path.join(OUT, build);
          fs.mkdirSync(dir, { recursive: true });
          const file = path.join(dir, `${route.name}@${viewport.name}-${theme}.png`);
          await page.screenshot({ path: file, fullPage: true });

          const box = await page.evaluate(() => ({
            height: document.documentElement.scrollHeight,
            width: document.documentElement.scrollWidth,
            theme: document.documentElement.getAttribute('data-theme'),
          }));
          written.push({ build, route: route.name, viewport: viewport.name, theme, file, ...box });
        } catch (error) {
          failures += 1;
          console.error(`capture failed ${build} ${route.name} ${viewport.name} ${theme}: ${error.message}`);
        } finally {
          await context.close();
        }
      }
    }
  }
}

await browser.close();

fs.writeFileSync(path.join(OUT, 'capture.json'), JSON.stringify(written, null, 2));
console.log(`captured ${written.length} screenshots, ${failures} failures`);
process.exit(failures ? 1 : 0);
