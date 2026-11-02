#!/usr/bin/env node
/**
 * Device pass as a regression check, not a pass/fail.
 *
 * `device-pass.mjs` exits 1 on any problem, and the site has 60 of them today —
 * footer links 18–23px tall, which no port should silently fix and no CI should
 * fail on forever. What matters is the delta against the accepted list in
 * `qa/reference/device-problems.txt`: a problem the site has today and did not
 * have when that list was written.
 *
 * Re-baseline deliberately, after looking at the list:
 *   node scripts/device-regress.mjs --write-baseline
 *
 * Needs the port on :8080.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const BASELINE = path.resolve('qa/reference/device-problems.txt');
const writeBaseline = process.argv.includes('--write-baseline');

const result = spawnSync(process.execPath, ['scripts/device-pass.mjs'], {
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});
if (result.error) throw result.error;

const text = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
const problems = text
  .split(/\r?\n/)
  .filter((line) => line.startsWith('  - '))
  .map((line) => line.slice(4));
const summary = text.split(/\r?\n/).find((line) => line.startsWith('checks:')) ?? '';

if (writeBaseline) {
  fs.writeFileSync(BASELINE, problems.join('\n') + (problems.length ? '\n' : ''));
  console.log(`${summary}`);
  console.log(`baseline written: ${problems.length} accepted problems -> ${path.relative(process.cwd(), BASELINE)}`);
  process.exit(0);
}

if (!fs.existsSync(BASELINE)) {
  console.error(`device-regress: no baseline at ${BASELINE}`);
  console.error('  run once, after reviewing the list: node scripts/device-regress.mjs --write-baseline');
  process.exit(1);
}

const accepted = fs
  .readFileSync(BASELINE, 'utf8')
  .split(/\r?\n/)
  .filter(Boolean);

const budget = new Map();
for (const problem of accepted) budget.set(problem, (budget.get(problem) ?? 0) + 1);

const introduced = [];
const seen = new Map();
for (const problem of problems) {
  const allowed = budget.get(problem) ?? 0;
  const used = seen.get(problem) ?? 0;
  if (used < allowed) seen.set(problem, used + 1);
  else introduced.push(problem);
}

const fixed = accepted.filter((problem) => !seen.has(problem));

console.log(`build  : ${summary}`);
console.log(`accepted: ${accepted.length} problems in the baseline`);

if (fixed.length) {
  console.log(`\nfixed since the baseline (${fixed.length}) — consider re-baselining:`);
  for (const problem of fixed) console.log('  +', problem);
}

if (introduced.length) {
  console.log(`\nnew problems (${introduced.length}):`);
  for (const problem of introduced) console.log('  -', problem);
  process.exit(1);
}

console.log(`\nno regressions: ${problems.length} problems, all in the accepted baseline`);
