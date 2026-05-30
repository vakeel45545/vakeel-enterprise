import { getPageSections } from '@/lib/api/services';
import HomeClient from '@/components/home/HomeClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const sections = await getPageSections('home');
  
  return <HomeClient sections={sections} />;
}
