import { z } from 'zod';

// ─── Zod Schemas (match exact field names from original MEGA_MENU_CONTENT) ───

export const MegaMenuLinkSchema = z.object({
  name: z.string(),
  href: z.string(),
});

export const MegaMenuCategorySchema = z.object({
  title: z.string(),
  links: z.array(MegaMenuLinkSchema),
});

export const MegaMenuFeaturedSchema = z.object({
  title: z.string(),
  desc: z.string(),
  tag: z.string(),
  href: z.string(),
  image: z.string(),
});

export const MegaMenuDataSchema = z.object({
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  categories: z.array(MegaMenuCategorySchema).optional().default([]),
  featured: MegaMenuFeaturedSchema.optional().nullable(),
});

export type MegaMenuLink = z.infer<typeof MegaMenuLinkSchema>;
export type MegaMenuCategory = z.infer<typeof MegaMenuCategorySchema>;
export type MegaMenuFeatured = z.infer<typeof MegaMenuFeaturedSchema>;
export type MegaMenuData = z.infer<typeof MegaMenuDataSchema>;

export type NavigationItem = {
  id: string;
  title: string;
  slug: string | null;
  url: string | null;
  parent_id: string | null;
  children?: NavigationItem[];
  featured: boolean;
  visible: boolean;
  order: number;
  type: string; // 'link' | 'dropdown' | 'mega'
  icon?: string | null;
  description?: string | null;
  badge?: string | null;
  mega_menu_data?: MegaMenuData | null;
  created_at?: string | null;
};
