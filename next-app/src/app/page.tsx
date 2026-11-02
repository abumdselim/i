import { SiteCtaSlot } from '@/components/SiteCtaSlot';
import { HomeBody } from '@/components/pages/home';
import { metadataFor } from '@/lib/pages';

export const metadata = metadataFor('/');

export default function HomePage() {
  return (
    <>
      <HomeBody />
      <SiteCtaSlot route="/" />
    </>
  );
}
