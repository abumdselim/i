import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { CommitFile, CommitInfo, ContentStore, DataFile, StoreCommit } from './store';

/**
 * The original local mode, unchanged in behaviour: this process owns a
 * checkout, and writes go to the sibling `next-app/data` folder atomically
 * (`.tmp` → `.bak` the old file → rename). A failed write leaves the previous
 * file intact. Commit messages are ignored here — in local mode the human
 * writes the commit in a terminal, which is the whole point of D-18.
 *
 * Only ever loaded through a dynamic import from site.ts when GITHUB_TOKEN is
 * absent, so the deployed worker never pulls `node:fs` into its bundle.
 */

const SITE_ROOT = path.resolve(process.cwd(), '..', 'next-app');
export const DATA_DIR = path.join(SITE_ROOT, 'data');

async function readJsonText(file: DataFile): Promise<string> {
  const target = path.join(DATA_DIR, file);
  try {
    return await fs.readFile(target, 'utf8');
  } catch (error) {
    throw new Error(`studio: cannot read ${target} — ${(error as Error).message}`);
  }
}

async function writeJson(file: DataFile, value: unknown): Promise<void> {
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.tmp`;
  const text = `${JSON.stringify(value, null, 2)}\n`;

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.copyFile(target, `${target}.bak`).catch(() => undefined);
  await fs.writeFile(tmp, text, 'utf8');
  await fs.rename(tmp, target);
}

export const fsStore: ContentStore = {
  mode: 'local',

  readJsonText,

  async commit(files: CommitFile[]): Promise<StoreCommit> {
    // Same guarantee as before the store existed: every file in a save is
    // written in order, each one atomically.
    for (const file of files) {
      await writeJson(file.file, file.value);
    }
    return { hash: '', url: null };
  },

  async listCommits(): Promise<CommitInfo[]> {
    // Local mode reads history through lib/git.ts (real `git log`), not here.
    return [];
  },

  readIconsSource() {
    return fs.readFile(path.join(SITE_ROOT, 'src', 'components', 'icons.ts'), 'utf8');
  },
};
