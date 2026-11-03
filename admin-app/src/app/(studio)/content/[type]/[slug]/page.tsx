import { notFound } from 'next/navigation';
import { ContentEditor } from '@/components/ContentEditor';
import { readContent, readIcons } from '@/lib/site';
import type { ContentType } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ContentDetail({ params }: { params: Promise<{ type: string; slug: string }> }) {
  const { type, slug } = await params;
  if (type !== 'capability' && type !== 'product') notFound();

  let content;
  try {
    content = await readContent(type as ContentType, slug);
  } catch {
    notFound();
  }

  const icons = await readIcons();
  return <ContentEditor type={type as ContentType} content={content} icons={icons} />;
}
