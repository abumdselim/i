import { NextResponse } from 'next/server';
import { validateContent } from '@/lib/rules';
import { apiError } from '@/lib/api';
import { readContent, writeContent } from '@/lib/site';
import type { ContentType } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(error: unknown) {
  return apiError(error);
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
    const saved = await writeContent(type, slug, content);
    return NextResponse.json({ ok: true, commit: saved });
  } catch (error) {
    return fail(error);
  }
}
