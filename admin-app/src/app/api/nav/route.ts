import { NextResponse } from 'next/server';
import { validateConfig } from '@/lib/rules';
import { apiError } from '@/lib/api';
import { commitData, readConfig, readPages, readSections } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(error: unknown) {
  return apiError(error);
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { nav?: unknown };
    const [config, pages, sections] = await Promise.all([readConfig(), readPages(), readSections()]);
    const next = validateConfig({ ...config, nav: body.nav }, pages, sections);
    const saved = await commitData([{ file: 'site-config.json', value: next }], 'studio: update primary navigation');
    return NextResponse.json({ ok: true, commit: saved });
  } catch (error) {
    return fail(error);
  }
}
