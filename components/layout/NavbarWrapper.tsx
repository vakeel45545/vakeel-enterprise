// import { getNavigation } from '@/lib/cms/navigation';
// import { buildNavigationTree } from '@/lib/cms/navigation-tree';
// import { getSiteSettings } from '@/lib/api/services';
// import Navbar from './Navbar';

// /**
//  * Server component wrapper for Navbar.
//  * Fetches validated navigation from Supabase CMS and builds a nested tree.
//  * The CMS layer handles caching and emergency fallbacks automatically.
//  */
// export default async function NavbarWrapper() {
//   const [flatNavigation, settings] = await Promise.all([
//     getNavigation(),
//     getSiteSettings()
//   ]);
//   const navigationTree = buildNavigationTree(flatNavigation);

//   return <Navbar navItems={navigationTree} companyName={settings?.company_name || 'Vakeel'} />;
// }

import { getNavigation } from '@/lib/cms/navigation';
import { buildNavigationTree } from '@/lib/cms/navigation-tree';
import { getSiteSettings } from '@/lib/api/services';
import Navbar from './Navbar';

export const dynamic = 'force-dynamic'; // ← ADD THIS LINE

export default async function NavbarWrapper() {
  const [flatNavigation, settings] = await Promise.all([
    getNavigation(),
    getSiteSettings()
  ]);
  const navigationTree = buildNavigationTree(flatNavigation);
  return <Navbar navItems={navigationTree} companyName={settings?.company_name || 'Vaakil.com'} />;
}