import { ContactBody } from '@/components/pages/contact';
import { SiteCtaSlot } from '@/components/SiteCtaSlot';
import { metadataFor } from '@/lib/pages';

export const metadata = metadataFor('/contact');

export default function ContactPage() {
  return (
    <>
      <ContactBody />
      <SiteCtaSlot route="/contact" />
    </>
  );
}
