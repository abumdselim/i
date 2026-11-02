import { spawn, type ChildProcess } from 'node:child_process';
import { NextResponse } from 'next/server';
import { SITE_ROOT_DIR } from '@/lib/site';
import { PREVIEW_URL } from '@/lib/urls';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The built-preview server (`npm run preview` in next-app/, port 8080).
 *
 * It serves `next-app/out/` — the same artefact that would be deployed — so the
 * iframe shows the export, not the dev server. If something is already
 * listening (a preview started in a terminal), the studio reports that rather
 * than fighting it for the port.
 */
let preview: ChildProcess | null = null;

async function reachable(): Promise<boolean> {
  try {
    const response = await fetch(PREVIEW_URL, { signal: AbortSignal.timeout(900), cache: 'no-store' });
    return response.ok;
  } catch {
    return false;
  }
}

export async function GET() {
  return NextResponse.json({ running: Boolean(preview) || (await reachable()), url: PREVIEW_URL });
}

export async function POST() {
  if (await reachable()) {
    return NextResponse.json({ ok: true, external: true, url: PREVIEW_URL });
  }
  if (preview) return NextResponse.json({ ok: true, external: false, url: PREVIEW_URL });

  preview = spawn(process.execPath, ['scripts/serve.mjs'], { cwd: SITE_ROOT_DIR, windowsHide: true });
  preview.on('close', () => {
    preview = null;
  });

  // Give the listener a moment so the iframe does not race the socket.
  await new Promise((resolve) => setTimeout(resolve, 700));
  return NextResponse.json({ ok: (await reachable()) || Boolean(preview), external: false, url: PREVIEW_URL });
}

export async function DELETE() {
  if (!preview) {
    return NextResponse.json({ ok: true, message: 'No preview started here; an external one keeps running.' });
  }
  preview.kill();
  preview = null;
  return NextResponse.json({ ok: true });
}
