import { SiteCtaSlot } from '@/components/SiteCtaSlot';
import { AboutBody } from '@/components/pages/about';
import { metadataFor } from '@/lib/pages';

export const metadata = metadataFor('/about');

export default function AboutPage() {
  return (
    <>
      <AboutBody />
      <SiteCtaSlot route="/about" />
    </>
  );
}
