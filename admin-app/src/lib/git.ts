import { execFile } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

/**
 * Read-only view of the repository the studio edits: what is uncommitted, and
 * what the last commits were. No `git add`, no `git commit`, no checkout —
 * changes are reviewed here and committed in a terminal.
 */
const run = promisify(execFile);

export const REPO_ROOT = path.resolve(process.cwd(), '..');

export interface ChangedFile {
  code: string;
  path: string;
  label: string;
  href: string | null;
}

export interface Commit {
  hash: string;
  subject: string;
  date: string;
}

const LABELS: Record<string, { label: string; href: string | null }> = {
  'next-app/data/pages.json': { label: 'Page metadata', href: '/pages' },
  'next-app/data/sections.json': { label: 'Section registry', href: null },
  'next-app/data/site-config.json': { label: 'Navigation, footer, visibility', href: '/navigation' },
  'next-app/data/capabilities.json': { label: 'Capability copy', href: '/content' },
  'next-app/data/products.json': { label: 'Product copy', href: '/content' },
  'next-app/data/figures.json': { label: 'Figure geometry', href: null },
  'docs/admin.md': { label: 'Studio plan', href: null },
  'docs/CHANGELOG.md': { label: 'Changelog', href: null },
  'docs/DECISIONS.md': { label: 'Decisions', href: null },
};

function labelFor(file: string): { label: string; href: string | null } {
  return LABELS[file] ?? { label: 'Repository file', href: null };
}

async function git(args: string[]): Promise<string> {
  const { stdout } = await run('git', args, {
    cwd: REPO_ROOT,
    windowsHide: true,
    maxBuffer: 4 * 1024 * 1024,
  });
  return stdout;
}

export async function workingTree(): Promise<{ files: ChangedFile[]; error: string | null }> {
  try {
    const stdout = await git(['status', '--porcelain=v1', '-uall']);
    const files = stdout
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => {
        const code = line.slice(0, 2).trim() || 'M';
        const file = line.slice(3).trim();
        return { code, path: file, ...labelFor(file) };
      });
    return { files, error: null };
  } catch (error) {
    return { files: [], error: (error as Error).message };
  }
}

export async function recentCommits(limit = 6): Promise<{ commits: Commit[]; error: string | null }> {
  try {
    const stdout = await git(['log', `-${limit}`, '--pretty=%h%x1f%s%x1f%ad', '--date=short']);
    const commits = stdout
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [hash, subject, date] = line.split('\x1f');
        return { hash, subject, date };
      });
    return { commits, error: null };
  } catch (error) {
    return { commits: [], error: (error as Error).message };
  }
}
