#!/usr/bin/env node
/**
 * Device pass: the checks that do not need a person holding a phone.
 *
 * It cannot replace a real device — no throttled CPU, no actual touch, no iOS
 * Safari. What it can do is prove the layout does not break at three widths and
 * that the measurable accessibility floors hold: no horizontal overflow, the
 * fixed header height the whole design depends on, the right navigation mode for
 * the breakpoint, WCAG 2.2 AA contrast for body copy, and the 24x24 CSS-pixel
 * target size from 2.5.8.
 *
 * It exits 1 on any problem, which is why CI runs `device-regress.mjs` instead:
 * the accepted problems have a baseline file, and only new ones should fail a
 * build.
 *
 * Usage: node scripts/device-pass.mjs      (needs the port build on :8080)
 */
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:8080';
const VIEWPORTS = [
  { name: '390', width: 390, height: 844, mobile: true },
  { name: '834', width: 834, height: 1112, mobile: true },
  { name: '1440', width: 1440, height: 900, mobile: false },
];
const ROUTES = ['/', '/services', '/approach', '/engagements', '/process', '/about', '/contact', '/products', '/erp', '/icounsel'];

const PROBE = () => {
  const parseColor = (value) => {
    const match = value.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const parts = match[1].split(',').map((n) => parseFloat(n));
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  };
  const luminance = ({ r, g, b }) => {
    const channel = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  const background = (el) => {
    let node = el;
    while (node) {
      const color = parseColor(getComputedStyle(node).backgroundColor);
      if (color && color.a > 0) return color;
      node = node.parentElement;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const ratio = (el) => {
    const fg = parseColor(getComputedStyle(el).color);
    const bg = background(el);
    if (!fg) return null;
    const l1 = luminance(fg);
    const l2 = luminance(bg);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  const visible = (el) => {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
  };

  const root = document.documentElement;
  const header = document.querySelector('.head');
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.burger');
  const h1 = document.querySelector('h1');

  const interactive = [...document.querySelectorAll('a, button')].filter(visible);
  const small = interactive
    .filter((el) => {
      const rect = el.getBoundingClientRect();
      // inline links inside running text are exempt (WCAG 2.5.8 inline exception)
      if (getComputedStyle(el).display === 'inline') return false;
      return rect.width < 24 || rect.height < 24;
    })
    .slice(0, 6)
    .map((el) => {
      const rect = el.getBoundingClientRect();
      return `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} ${Math.round(rect.width)}x${Math.round(rect.height)}`;
    });

  const contrastTargets = ['.hero .lead', '.section .body', '.foot__col a', '.tag', '.mono', '.page-head .lead'];
  const contrast = [];
  for (const selector of contrastTargets) {
    const el = document.querySelector(selector);
    if (!el || !visible(el)) continue;
    const value = ratio(el);
    if (value) contrast.push({ selector, ratio: Math.round(value * 100) / 100 });
  }

  return {
    scrollWidth: root.scrollWidth,
    innerWidth: window.innerWidth,
    headerPosition: header ? getComputedStyle(header).position : null,
    headerHeight: header ? Math.round(header.getBoundingClientRect().height) : null,
    bodyPaddingTop: Math.round(parseFloat(getComputedStyle(document.body).paddingTop)),
    navHidden: nav ? getComputedStyle(nav).display === 'none' : null,
    burgerHidden: burger ? getComputedStyle(burger).display === 'none' : null,
    h1Size: h1 ? Math.round(parseFloat(getComputedStyle(h1).fontSize)) : null,
    metaViewport: !!document.querySelector('meta[name="viewport"]'),
    theme: root.getAttribute('data-theme'),
    smallestTargets: small,
    contrast,
  };
};

const browser = await chromium.launch({ channel: 'chromium' });
const problems = [];
const rows = [];

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.mobile ? 2 : 1,
    hasTouch: viewport.mobile,
    isMobile: viewport.mobile,
    reducedMotion: 'reduce',
  });

  for (const route of ROUTES) {
    const page = await context.newPage();
    await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 });
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(PROBE);

    if (result.scrollWidth > result.innerWidth + 1) {
      problems.push(`${viewport.name} ${route}: horizontal overflow ${result.scrollWidth} > ${result.innerWidth}`);
    }
    if (result.headerPosition !== 'fixed') problems.push(`${viewport.name} ${route}: header is ${result.headerPosition}`);
    // the header is 74px of content plus a 1px hairline border; body padding is the contract
    if (result.headerHeight < 74 || result.headerHeight > 75) problems.push(`${viewport.name} ${route}: header height ${result.headerHeight}`);
    if (result.bodyPaddingTop !== 74) problems.push(`${viewport.name} ${route}: body padding-top ${result.bodyPaddingTop}`);
    if (!result.metaViewport) problems.push(`${viewport.name} ${route}: no viewport meta`);

    const shouldHideNav = viewport.width <= 1080;
    if (result.navHidden !== shouldHideNav) problems.push(`${viewport.name} ${route}: nav hidden=${result.navHidden}`);
    if (result.burgerHidden !== !shouldHideNav) problems.push(`${viewport.name} ${route}: burger hidden=${result.burgerHidden}`);

    for (const target of result.smallestTargets) {
      problems.push(`${viewport.name} ${route}: target under 24px — ${target}`);
    }
    for (const item of result.contrast) {
      if (item.ratio < 4.5) problems.push(`${viewport.name} ${route}: contrast ${item.ratio}:1 on ${item.selector}`);
    }

    rows.push({
      viewport: viewport.name,
      route,
      h1: result.h1Size,
      scroll: `${result.scrollWidth}/${result.innerWidth}`,
      contrast: result.contrast.map((c) => c.ratio).join(' '),
    });
    await page.close();
  }
  await context.close();
}

await browser.close();

const pad = (value, width) => String(value).padEnd(width);
console.log('build: port (8080)');

console.log(`${pad('width', 7)}${pad('route', 14)}${pad('h1', 5)}  ${pad('scrollW/innerW', 16)}contrast`);
for (const row of rows) {
  console.log(`${pad(row.viewport, 7)}${pad(row.route, 14)}${pad(row.h1, 5)}  ${pad(row.scroll, 16)}${row.contrast}`);
}
console.log();
console.log(`checks: ${rows.length} pages across ${VIEWPORTS.length} viewports · problems: ${problems.length}`);
for (const problem of problems) console.log('  -', problem);
process.exit(problems.length ? 1 : 0);
