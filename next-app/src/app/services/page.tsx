import { SiteCta } from '@/components/SiteCta';
import { ServicesBody } from '@/components/pages/services';
import { metadataFor } from '@/lib/pages';

export const metadata = metadataFor('/services');

export default function ServicesPage() {
  return (
    <>
      <ServicesBody />
      <SiteCta />
    </>
  );
}
