#!/usr/bin/env node
/**
 * Device pass as a regression check, not a pass/fail.
 *
 * `device-pass.mjs` exits 1 on any problem, and the legacy build has 60 of them
 * today — footer links 18–23px tall, which no port should silently fix and no CI
 * should fail on forever. What matters is the delta: a problem the port has and
 * the legacy build does not. This runs both passes and compares their lists.
 *
 * Needs both servers: 8080 (the export) and 8081 (the legacy build, or
 * qa/reference served with the repository's assets/).
 */
import { spawnSync } from 'node:child_process';

function run(args) {
  const result = spawnSync(process.execPath, ['scripts/device-pass.mjs', ...args], {
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
  return { problems, summary };
}

const port = run([]);
const legacy = run(['--legacy']);

console.log(`port   : ${port.summary}`);
console.log(`legacy : ${legacy.summary}`);

const known = new Map();
for (const problem of legacy.problems) known.set(problem, (known.get(problem) ?? 0) + 1);

const introduced = [];
const seen = new Map();
for (const problem of port.problems) {
  const budget = known.get(problem) ?? 0;
  const used = seen.get(problem) ?? 0;
  if (used < budget) {
    seen.set(problem, used + 1);
  } else {
    introduced.push(problem);
  }
}

const fixed = [...known.keys()].filter((problem) => !seen.has(problem));

if (fixed.length) {
  console.log(`\nbetter than the legacy build (${fixed.length}):`);
  for (const problem of fixed) console.log('  +', problem);
}

if (introduced.length) {
  console.log(`\nnew problems (${introduced.length}):`);
  for (const problem of introduced) console.log('  -', problem);
  process.exit(1);
}

console.log(`\nno regressions: ${port.problems.length} problems, all present on the legacy build`);
