import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CapabilityPage } from '@/components/pages/CapabilityPage';
import { ProductPage } from '@/components/pages/ProductPage';
import { SiteCta } from '@/components/SiteCta';
import { TEMPLATED_SLUGS, isCapability, isProduct } from '@/lib/content';
import { getPage, metadataFor } from '@/lib/pages';

/**
 * One route for the ten templated pages: six capabilities and four products.
 *
 * They share a skeleton and differ only in content, so they share a route too.
 * `generateStaticParams` keeps the export static, and `dynamicParams = false`
 * turns an unknown slug into a 404 at build time rather than a runtime miss.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return TEMPLATED_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isCapability(slug) && !isProduct(slug)) return {};
  return metadataFor(getPage(`/${slug}`).route);
}

export default async function TemplatedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (isCapability(slug)) {
    return (
      <>
        <main id="main">
          <CapabilityPage slug={slug} />
        </main>
        <SiteCta />
      </>
    );
  }

  if (isProduct(slug)) {
    return (
      <>
        <main id="main">
          <ProductPage slug={slug} />
        </main>
        <SiteCta />
      </>
    );
  }

  notFound();
}
