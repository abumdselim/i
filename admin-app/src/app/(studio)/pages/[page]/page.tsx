import { notFound } from 'next/navigation';
import { PageEditor } from '@/components/PageEditor';
import { routeForParam } from '@/lib/routes';
import { readConfig, readPages, readSections, sectionPlan } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function PageDetail({ params }: { params: Promise<{ page: string }> }) {
  const { page: param } = await params;
  const route = routeForParam(param);

  const [pages, sections, config] = await Promise.all([readPages(), readSections(), readConfig()]);
  const page = pages.find((candidate) => candidate.route === route);
  if (!page) notFound();

  const plan = sectionPlan(sections, config, route);

  return <PageEditor param={param} page={page} plan={plan} />;
}
