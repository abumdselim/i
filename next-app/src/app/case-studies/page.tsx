import { CaseStudies } from '@/components/pages/CaseStudiesBody';
import { SiteCtaSlot } from '@/components/SiteCtaSlot';
import { metadataFor } from '@/lib/pages';

export const metadata = metadataFor('/case-studies');

/**
 * The case studies, in full.
 *
 * The home page carries a three-card teaser; the record lives here — all four
 * cases with their summary, spec and tags, led by the live platform's own
 * screen. One component renders both lengths from one document
 * (data/case-studies.json), so the teaser cannot drift from the page.
 */
export default function CaseStudiesPage() {
  return (
    <>
      <main id="main">
        <CaseStudies variant="page" />
      </main>
      <SiteCtaSlot route="/case-studies" />
    </>
  );
}
