import { NextResponse } from 'next/server';
import { validateConfig, validatePages } from '@/lib/rules';
import { routeForParam } from '@/lib/routes';
import { apiError } from '@/lib/api';
import { commitData, readConfig, readPages, readSections, sectionPlan } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Payload {
  title?: unknown;
  description?: unknown;
  robots?: unknown;
  showCta?: unknown;
  hidden?: unknown;
  order?: unknown;
}

function badRequest(error: unknown) {
  return apiError(error);
}

export async function GET(_request: Request, { params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const route = routeForParam(page);
  const [pages, config, sections] = await Promise.all([readPages(), readConfig(), readSections()]);
  const entry = pages.find((candidate) => candidate.route === route);
  if (!entry) return NextResponse.json({ ok: false, message: `no page ${route}` }, { status: 404 });
  return NextResponse.json({ ok: true, page: entry, plan: sectionPlan(sections, config, route) });
}

/**
 * Saves a page's meta and its section arrangement.
 *
 * Two files change (pages.json for the meta, site-config.json for hidden/order),
 * so both are validated as a whole before either is written; each write is
 * atomic on its own. An invalid combination — a locked section hidden, an
 * unknown id in the order — never reaches disk.
 */
export async function PUT(request: Request, { params }: { params: Promise<{ page: string }> }) {
  try {
    const { page } = await params;
    const route = routeForParam(page);
    const body = (await request.json()) as Payload;

    const [pages, config, sections] = await Promise.all([readPages(), readConfig(), readSections()]);
    const index = pages.findIndex((candidate) => candidate.route === route);
    if (index < 0) return NextResponse.json({ ok: false, message: `no page ${route}` }, { status: 404 });

    const nextPages = [...pages];
    nextPages[index] = {
      ...pages[index],
      title: body.title as string,
      description: body.description as string,
      robots: body.robots as string,
      showCta: body.showCta as boolean,
    };
    validatePages(nextPages);

    const hiddenIds = Array.isArray(body.hidden) ? (body.hidden as string[]) : [];
    const orderIds = Array.isArray(body.order) ? (body.order as string[]) : [];

    const hidden = [
      ...config.hidden.filter((entry) => entry.route !== route),
      ...hiddenIds.map((id) => ({ route, id })),
    ];
    const order = { ...config.order };
    if (orderIds.length > 0) order[route] = orderIds;
    else delete order[route];

    const nextConfig = { ...config, hidden, order };
    validateConfig(nextConfig, nextPages, sections);

    // One save spans two files — page meta and the section arrangement — so
    // they travel together: one atomic write locally, one commit in the cloud.
    const saved = await commitData(
      [
        { file: 'pages.json', value: nextPages },
        { file: 'site-config.json', value: nextConfig },
      ],
      `studio: update ${route} page meta`,
    );

    return NextResponse.json({ ok: true, commit: saved });
  } catch (error) {
    return badRequest(error);
  }
}
