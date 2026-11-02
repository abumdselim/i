import { NextResponse } from 'next/server';
import { StudioValidationError, validateConfig } from '@/lib/rules';
import { readConfig, readPages, readSections, writeConfig } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(error: unknown) {
  if (error instanceof StudioValidationError) {
    return NextResponse.json({ ok: false, issues: error.issues }, { status: 400 });
  }
  return NextResponse.json({ ok: false, message: (error as Error).message }, { status: 500 });
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { footer?: unknown };
    const [config, pages, sections] = await Promise.all([readConfig(), readPages(), readSections()]);
    const next = validateConfig({ ...config, footer: body.footer }, pages, sections);
    await writeConfig(next);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return fail(error);
  }
}
