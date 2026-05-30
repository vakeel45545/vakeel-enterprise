// Re-export from unified API layer and CMS layer for backward compatibility
export {
  getSiteSettings,
  getFooterData,
} from './services';

export { getNavigation } from '../cms/navigation';
export { buildNavigationTree as getNavigationTree } from '../cms/navigation-tree';


// export { getSiteSettings, getFooterData } from './services';

// export { getNavigation } from '@/lib/cms/navigation';

// export { getNavigationTree } from '@/lib/cms/navigation-tree';