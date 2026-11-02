import { ContactBody } from '@/components/pages/contact';
import { metadataFor } from '@/lib/pages';

export const metadata = metadataFor('/contact');

export default function ContactPage() {
  return <ContactBody />;
}
