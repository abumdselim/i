import { spawn, type ChildProcess } from 'node:child_process';
import { NextResponse } from 'next/server';
import { SITE_ROOT_DIR } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * One build at a time, streamed to the build panel.
 *
 * `npm run verify` is the site's own judge: export → parity gate → lint. The
 * studio does not parse success out of the log; it reports the exit code and
 * the gate's table as they arrive, and the exit code is what the panel shows.
 */
let running: ChildProcess | null = null;

interface BuildState {
  running: boolean;
  exitCode: number | null;
  startedAt: string | null;
  finishedAt: string | null;
}

let state: BuildState = { running: false, exitCode: null, startedAt: null, finishedAt: null };

export async function GET() {
  return NextResponse.json(state);
}

function command(): { file: string; args: string[] } {
  if (process.platform === 'win32') {
    // The console code page, not the process locale, decides how the child's
    // output is encoded; 65001 keeps the stream UTF-8 so the terminal shows the
    // same characters the gate wrote.
    return { file: 'cmd.exe', args: ['/d', '/s', '/c', 'chcp 65001 >nul && npm run verify'] };
  }
  return { file: 'npm', args: ['run', 'verify'] };
}

/**
 * The site's build must not inherit the studio's Next.js runtime.
 *
 * The studio is itself a Next app; its environment carries `NODE_ENV=development`
 * and a set of `NEXT_*` internals. A production build that receives them renders
 * with the development React and dies on `/_global-error` with
 * "Cannot read properties of null (reading 'useContext')". Stripping them is the
 * difference between a working panel and a build that only fails from the panel.
 */
function buildEnv(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (key === 'NODE_ENV' || key.startsWith('NEXT_') || key.startsWith('__NEXT')) delete env[key];
  }
  return { ...env, NODE_ENV: 'production', FORCE_COLOR: '0', NO_COLOR: '1' };
}

export async function POST() {
  if (running) {
    return NextResponse.json({ ok: false, message: 'A build is already running.' }, { status: 409 });
  }

  const { file, args } = command();
  const child = spawn(file, args, {
    cwd: SITE_ROOT_DIR,
    windowsHide: true,
    env: buildEnv(),
  });

  running = child;
  state = { running: true, exitCode: null, startedAt: new Date().toISOString(), finishedAt: null };

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const push = (chunk: Buffer) => controller.enqueue(encoder.encode(chunk.toString('utf8')));
      child.stdout?.on('data', push);
      child.stderr?.on('data', push);
      child.on('error', (error) => push(Buffer.from(`\nbuild: could not start — ${error.message}\n`)));

      child.on('close', (code) => {
        running = null;
        state = {
          running: false,
          exitCode: code,
          startedAt: state.startedAt,
          finishedAt: new Date().toISOString(),
        };
        controller.enqueue(encoder.encode(`\n__EXIT__ ${code ?? 1}\n`));
        controller.close();
      });
    },
    cancel() {
      // The reader went away; the build keeps running so its exit code and the
      // gate result are still recorded for the next visit.
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-accel-buffering': 'no',
    },
  });
}
