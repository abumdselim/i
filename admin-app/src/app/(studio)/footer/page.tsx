import { FooterEditor } from '@/components/FooterEditor';
import { readConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function FooterPage() {
  const config = await readConfig();
  return <FooterEditor footer={config.footer} />;
}
