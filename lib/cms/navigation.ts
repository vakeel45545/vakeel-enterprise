import { createClient } from '@/lib/supabase/server';
import { NavigationItem, MegaMenuDataSchema } from './navigation-types';
import { normalizeUrl } from '@/lib/utils/normalize-url';

// No fallback array. Using dynamic database data exclusively.

export async function getNavigation(): Promise<NavigationItem[]> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('navigation')
      .select('*')
      .eq('visible', true)
      .order('order', { ascending: true });

    if (error) {
      console.error('[CMS] Error fetching navigation:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('[CMS] Navigation CMS empty. Returning empty array.');
      return [];
    }

    // Process and validate items
    const processedData: NavigationItem[] = data.map((item) => {
      let validMegaMenuData = null;
      
      // Strict Zod validation for mega menu JSONB
      if (item.type === 'mega' && item.mega_menu_data) {
        const result = MegaMenuDataSchema.safeParse(item.mega_menu_data);
        if (result.success) {
          validMegaMenuData = result.data;
        } else {
          console.warn(`[CMS] Invalid mega menu data for item ${item.title}:`, result.error);
        }
      }

      return {
        id: item.id,
        title: item.title,
        slug: item.slug ? normalizeUrl(item.slug) : null,
        url: item.url ? normalizeUrl(item.url) : null,
        parent_id: item.parent_id,
        featured: item.featured || false,
        visible: item.visible !== false, // Fallback to true if null
        order: item.order || 0,
        type: item.type || 'link',
        icon: item.icon,
        description: item.description,
        badge: item.badge,
        mega_menu_data: validMegaMenuData,
        created_at: item.created_at,
      };
    });

    return processedData;
  } catch (e) {
    console.error('[CMS] Exception in getNavigation:', e);
    return [];
  }
}
