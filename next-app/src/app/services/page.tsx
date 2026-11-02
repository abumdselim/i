import { SiteCtaSlot } from '@/components/SiteCtaSlot';
import { ServicesBody } from '@/components/pages/services';
import { metadataFor } from '@/lib/pages';

export const metadata = metadataFor('/services');

export default function ServicesPage() {
  return (
    <>
      <ServicesBody />
      <SiteCtaSlot route="/services" />
    </>
  );
}
