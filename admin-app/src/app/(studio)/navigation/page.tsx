import { NavigationEditor } from '@/components/NavigationEditor';
import { readConfig } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function NavigationPage() {
  const config = await readConfig();
  return <NavigationEditor nav={config.nav} />;
}
