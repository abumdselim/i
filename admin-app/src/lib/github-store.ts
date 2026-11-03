import {
  StoreConflictError,
  type CommitFile,
  type CommitInfo,
  type ContentStore,
  type DataFile,
  type StoreCommit,
} from './store';

/**
 * The repository is the database (D-19). Reads hit the contents API with a
 * short in-isolate cache — the shell reads the page list on every request —
 * and writes go through the Git Data API so a save that spans two files is
 * one atomic commit: blobs → tree (based on HEAD's tree) → commit → ref
 * update. If the ref moved since the read, GitHub refuses the fast-forward
 * and the editor is told to reload instead of silently overwriting.
 *
 * No filesystem, no child processes: this module is the only one the deployed
 * studio needs and it runs unmodified on the Workers runtime.
 */

const API = 'https://api.github.com';
const TOKEN = process.env.GITHUB_TOKEN ?? '';
const REPO = process.env.GITHUB_REPO ?? 'abumdselim/i';
const BRANCH = process.env.GITHUB_BRANCH ?? 'main';
const DATA_PREFIX = 'next-app/data';
const ICONS_PATH = 'next-app/src/components/icons.ts';

/** Reads are shared across every editor in the isolate; 30s keeps the
 *  shell responsive without letting a save look invisible for minutes. */
const CACHE_TTL_MS = 30_000;

interface CacheEntry {
  at: number;
  text: string;
}

const cache = new Map<string, CacheEntry>();

function authHeaders(extra: Record<string, string> = {}): HeadersInit {
  return {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...extra,
  };
}

async function api(path: string, init: RequestInit = {}): Promise<unknown> {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: authHeaders((init.headers as Record<string, string>) ?? {}),
  });
  if (response.status === 409 || response.status === 422) {
    // 422 from the ref update is the non-fast-forward case in practice.
    if (String(path).startsWith('/repos/') && String(path).includes('/git/')) {
      throw new StoreConflictError();
    }
  }
  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) detail = `${response.status}: ${body.message}`;
    } catch {
      /* keep the status line */
    }
    throw new Error(`github: ${path} failed — ${detail}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

interface GitRef {
  object: { sha: string };
}

interface GitCommit {
  sha: string;
  tree: { sha: string };
}

interface ContentsEntry {
  content: string;
  encoding: string;
}

function decode(entry: ContentsEntry): string {
  if (entry.encoding !== 'base64') throw new Error('github: unexpected content encoding');
  // GitHub returns base64 with newlines; atob handles the rest.
  const bytes = atob(entry.content.replace(/\n/g, ''));
  const buffer = Uint8Array.from(bytes, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(buffer);
}

async function readPath(path: string): Promise<string> {
  const cached = cache.get(path);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.text;
  const entry = (await api(
    `/repos/${REPO}/contents/${path}?ref=${encodeURIComponent(BRANCH)}`,
  )) as ContentsEntry;
  const text = decode(entry);
  cache.set(path, { at: Date.now(), text });
  return text;
}

interface CommitListEntry {
  sha: string;
  commit: { message: string; author: { date: string } | null };
}

export const githubStore: ContentStore = {
  mode: 'cloud',

  readJsonText(file: DataFile) {
    return readPath(`${DATA_PREFIX}/${file}`);
  },

  async commit(files: CommitFile[], message: string): Promise<StoreCommit> {
    if (files.length === 0) throw new Error('studio: commit with no files');

    const head = (await api(`/repos/${REPO}/git/ref/heads/${BRANCH}`)) as GitRef;
    const headSha = head.object.sha;
    const headCommit = (await api(`/repos/${REPO}/git/commits/${headSha}`)) as GitCommit;

    const tree = [] as { path: string; mode: '100644'; type: 'blob'; sha: string }[];
    for (const file of files) {
      const text = `${JSON.stringify(file.value, null, 2)}\n`;
      const blob = (await api(`/repos/${REPO}/git/blobs`, {
        method: 'POST',
        body: JSON.stringify({ content: text, encoding: 'utf-8' }),
      })) as { sha: string };
      tree.push({ path: `${DATA_PREFIX}/${file.file}`, mode: '100644', type: 'blob', sha: blob.sha });
    }

    const newTree = (await api(`/repos/${REPO}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({ base_tree: headCommit.tree.sha, tree }),
    })) as { sha: string };

    const commit = (await api(`/repos/${REPO}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({
        message,
        tree: newTree.sha,
        parents: [headSha],
      }),
    })) as { sha: string };

    try {
      await api(`/repos/${REPO}/git/refs/heads/${BRANCH}`, {
        method: 'PATCH',
        body: JSON.stringify({ sha: commit.sha, force: false }),
      });
    } catch (error) {
      if (error instanceof StoreConflictError) {
        // The commit object exists but no ref points at it; effectively garbage.
        throw error;
      }
      throw error;
    }

    for (const file of files) cache.delete(`${DATA_PREFIX}/${file.file}`);

    return { hash: commit.sha.slice(0, 7), url: `https://github.com/${REPO}/commit/${commit.sha}` };
  },

  async listCommits(limit: number): Promise<CommitInfo[]> {
    const list = (await api(
      `/repos/${REPO}/commits?per_page=${limit}&path=${encodeURIComponent(DATA_PREFIX)}`,
    )) as CommitListEntry[];
    return list.map((entry) => ({
      hash: entry.sha.slice(0, 7),
      subject: entry.commit.message.split('\n')[0],
      date: (entry.commit.author?.date ?? '').slice(0, 10),
    }));
  },

  readIconsSource() {
    return readPath(ICONS_PATH);
  },
};
