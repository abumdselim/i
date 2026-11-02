import { NextResponse } from 'next/server';
import { StudioValidationError, validateContent } from '@/lib/rules';
import { readContent, writeContent } from '@/lib/site';
import type { ContentType } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(error: unknown) {
  if (error instanceof StudioValidationError) {
    return NextResponse.json({ ok: false, issues: error.issues }, { status: 400 });
  }
  return NextResponse.json({ ok: false, message: (error as Error).message }, { status: 500 });
}

function isType(value: string): value is ContentType {
  return value === 'capability' || value === 'product';
}

export async function GET(_request: Request, { params }: { params: Promise<{ type: string; slug: string }> }) {
  try {
    const { type, slug } = await params;
    if (!isType(type)) return NextResponse.json({ ok: false, message: 'unknown type' }, { status: 404 });
    return NextResponse.json({ ok: true, content: await readContent(type, slug) });
  } catch (error) {
    return fail(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ type: string; slug: string }> }) {
  try {
    const { type, slug } = await params;
    if (!isType(type)) return NextResponse.json({ ok: false, message: 'unknown type' }, { status: 404 });

    const body = (await request.json()) as { content?: unknown };
    const content = validateContent(type, body.content, slug);
    await writeContent(type, slug, content);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return fail(error);
  }
}
