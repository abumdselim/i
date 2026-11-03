import { NextResponse } from 'next/server';
import { StudioValidationError, validateCaseStudies } from '@/lib/rules';
import { readCaseStudies, writeCaseStudies } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The one data file behind the home page's case-study section.
 *
 * The whole collection travels as one document because the section is edited as
 * one screen: the head, the closing card and the ordered case list. Validation
 * runs before a byte is written, and the write itself is the studio's standard
 * atomic rename with a `.bak` — a half-valid file never reaches the build.
 */
function fail(error: unknown) {
  if (error instanceof StudioValidationError) {
    return NextResponse.json({ ok: false, issues: error.issues }, { status: 400 });
  }
  return NextResponse.json({ ok: false, message: (error as Error).message }, { status: 500 });
}

export async function GET() {
  try {
    return NextResponse.json({ ok: true, data: await readCaseStudies() });
  } catch (error) {
    return fail(error);
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as { data?: unknown };
    const data = validateCaseStudies(body.data);
    await writeCaseStudies(data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return fail(error);
  }
}
