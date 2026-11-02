#!/usr/bin/env node
/**
 * Static preview server for `out/`.
 *
 * The export writes two things per route: `<slug>.html` and a `<slug>/` directory
 * of RSC payloads. A naive static server (python -m http.server, for instance)
 * resolves `/about` to the directory and shows a file listing. This server
 * resolves a request the way a real host does — clean URL, then `.html`, then
 * `index.html` — so the preview matches production.
 *
 * Usage: node scripts/serve.mjs [port]   (default 8080, or $PORT)
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('out');
const PORT = Number(process.argv[2] || process.env.PORT || 8080);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.map': 'application/json; charset=utf-8',
};

function statFile(candidate) {
  try {
    const stat = fs.statSync(candidate);
    return stat.isFile() ? candidate : null;
  } catch {
    return null;
  }
}

function resolve(urlPath) {
  const clean = urlPath.replace(/\/+$/, '') || '/';
  const direct = path.join(ROOT, clean);
  if (!direct.startsWith(ROOT)) return null;

  // `/about` -> about.html ; `/about/` -> about/index.html ; `/` -> index.html
  const candidates =
    clean === '/'
      ? [path.join(ROOT, 'index.html')]
      : [statFile(direct), statFile(direct + '.html'), statFile(path.join(direct, 'index.html'))];

  for (const candidate of candidates) {
    if (candidate) return candidate;
  }
  return null;
}

http
  .createServer((request, response) => {
    const urlPath = decodeURIComponent((request.url || '/').split('?')[0]);
    const file = resolve(urlPath);

    if (!file) {
      const notFound = path.join(ROOT, '404.html');
      response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      response.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : 'Not found');
      return;
    }

    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    const headers = { 'content-type': type, 'cache-control': 'no-cache' };

    if (request.method === 'HEAD') {
      response.writeHead(200, headers);
      response.end();
      return;
    }

    response.writeHead(200, headers);
    fs.createReadStream(file).pipe(response);
  })
  .listen(PORT, '127.0.0.1', () => {
    console.log(`serving out/ on http://127.0.0.1:${PORT}`);
  });
