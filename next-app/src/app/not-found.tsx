import { NotFoundBody } from '@/components/pages/not-found-body';
import { SiteCtaSlot } from '@/components/SiteCtaSlot';
import { metadataFor } from '@/lib/pages';

export const metadata = metadataFor('/404');

export default function NotFound() {
  return (
    <>
      <NotFoundBody />
      <SiteCtaSlot route="/404" />
    </>
  );
}
