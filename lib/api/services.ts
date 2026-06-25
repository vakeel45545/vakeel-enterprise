import { createClient } from '@/lib/supabase/server';

// ─────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────

export async function getServices() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API] Error fetching services:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('[API] Exception in getServices:', e);
    return [];
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`[API] Error fetching service "${slug}":`, error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.error(`[API] Exception in getServiceBySlug("${slug}"):`, e);
    return null;
  }
}

export async function getFeaturedServices(limit = 6) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('services')
      .select('id, title, slug, short_description, icon, category')
      .eq('published', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[API] Error fetching featured services:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('[API] Exception in getFeaturedServices:', e);
    return [];
  }
}

export async function getServicesByCategory(category: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('services')
      .select('id, title, slug, short_description, icon')
      .eq('published', true)
      .eq('category', category)
      .order('title', { ascending: true });

    if (error) {
      console.error('[API] Error fetching services by category:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('[API] Exception in getServicesByCategory:', e);
    return [];
  }
}

// ─────────────────────────────────────────────
// CITIES
// ─────────────────────────────────────────────

export async function getCities() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('city_name', { ascending: true });

    if (error) {
      console.error('[API] Error fetching cities:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('[API] Exception in getCities:', e);
    return [];
  }
}

export async function getCityBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`[API] Error fetching city "${slug}":`, error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.error(`[API] Exception in getCityBySlug("${slug}"):`, e);
    return null;
  }
}

export async function getServiceCityPage(serviceId: string, cityId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('service_city_pages')
      .select('*')
      .eq('service_id', serviceId)
      .eq('city_id', cityId)
      .maybeSingle();

    if (error) {
      console.error('[API] Error fetching service_city_page:', error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.error('[API] Exception in getServiceCityPage:', e);
    return null;
  }
}

// ─────────────────────────────────────────────
// FAQs
// ─────────────────────────────────────────────

export async function getFaqsByService(serviceSlug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('service_slug', serviceSlug);

    if (error) {
      console.error('[API] Error fetching faqs:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('[API] Exception in getFaqsByService:', e);
    return [];
  }
}

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────

export async function getTestimonials() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('rating', { ascending: false });

    if (error) {
      console.error('[API] Error fetching testimonials:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('[API] Exception in getTestimonials:', e);
    return [];
  }
}

// ─────────────────────────────────────────────
// SITE SETTINGS
// ─────────────────────────────────────────────

export async function getSiteSettings() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[API] Error fetching site settings:', error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.error('[API] Exception in getSiteSettings:', e);
    return null;
  }
}



// ─────────────────────────────────────────────
// FOOTER (Dynamic CMS)
// ─────────────────────────────────────────────

export async function getFooterData() {
  try {
    const supabase = await createClient();
    const [sectionsResult, settingsResult] = await Promise.all([
      supabase
        .from('footer_sections')
        .select('*, footer_links(*)')
        .eq('visible', true)
        .order('order', { ascending: true }),
      supabase.from('site_settings').select('*').limit(1).maybeSingle(),
    ]);

    return {
      sections: sectionsResult.data || [],
      settings: settingsResult.data || null,
    };
  } catch (e) {
    console.error('[API] Exception in getFooterData:', e);
    return { sections: [], settings: null };
  }
}

// ─────────────────────────────────────────────
// BLOGS
// ─────────────────────────────────────────────

export async function getBlogs(limit?: number) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('blogs')
      .select('*, author:authors(*)')
      .order('created_at', { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) {
      console.error('[API] Error fetching blogs:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('[API] Exception in getBlogs:', e);
    return [];
  }
}

export async function getBlogById(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*, author:authors(*)')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error(`[API] Error fetching blog by ID "${id}":`, error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.error(`[API] Exception in getBlogById("${id}"):`, e);
    return null;
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*, author:authors(*)')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error(`[API] Error fetching blog "${slug}":`, error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.error(`[API] Exception in getBlogBySlug("${slug}"):`, e);
    return null;
  }
}

export async function getBlogsByCategory(category: string, limit?: number) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('blogs')
      .select('*, author:authors(*)')
      .ilike('category', category)
      .order('created_at', { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) {
      console.error('[API] Error fetching blogs by category:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('[API] Exception in getBlogsByCategory:', e);
    return [];
  }
}

export async function getDistinctBlogCategories(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('category')
      .not('category', 'is', null)
      .order('category', { ascending: true });

    if (error) {
      console.error('[API] Error fetching blog categories:', error.message);
      return [];
    }

    const categories = [...new Set((data || []).map((b) => b.category).filter(Boolean))] as string[];
    return categories;
  } catch (e) {
    console.error('[API] Exception in getDistinctBlogCategories:', e);
    return [];
  }
}

export async function getRelatedBlogs(
  currentBlogId: string,
  category: string | null,
  limit = 3
) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from('blogs')
      .select('id, title, slug, category, thumbnail, created_at, author:authors(name)')
      .neq('id', currentBlogId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (category) {
      query = query.ilike('category', category);
    }

    const { data, error } = await query;
    if (error) {
      console.error('[API] Error fetching related blogs:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('[API] Exception in getRelatedBlogs:', e);
    return [];
  }
}

export async function getFeaturedBlogs(limit = 3) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('id, title, slug, category, thumbnail, meta_description, created_at, author:authors(name, avatar)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[API] Error fetching featured blogs:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('[API] Exception in getFeaturedBlogs:', e);
    return [];
  }
}

// ─────────────────────────────────────────────
// CMS PAGES (Universal Page System)
// ─────────────────────────────────────────────

export async function getPageBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) {
      console.error(`[API] Error fetching page "${slug}":`, error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.error(`[API] Exception in getPageBySlug("${slug}"):`, e);
    return null;
  }
}

export async function getPageSections(pageSlug: string) {
  try {
    const supabase = await createClient();
    
    // First, get the page id
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', pageSlug)
      .eq('published', true)
      .maybeSingle();

    if (pageError || !page) {
      console.error(`[API] Error fetching page id for "${pageSlug}":`, pageError?.message);
      return [];
    }

    const { data: sections, error: sectionsError } = await supabase
      .from('page_sections' as any)
      .select('*')
      .eq('page_id', page.id)
      .eq('visible', true)
      .order('order_index', { ascending: true });

    if (sectionsError) {
      console.error(`[API] Error fetching page sections for "${pageSlug}":`, sectionsError.message);
      return [];
    }
    
    return sections || [];
  } catch (e) {
    console.error(`[API] Exception in getPageSections("${pageSlug}"):`, e);
    return [];
  }
}

export async function getAllPublishedPages() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('pages')
      .select('id, title, slug, page_type, updated_at')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API] Error fetching pages:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('[API] Exception in getAllPublishedPages:', e);
    return [];
  }
}

// ─────────────────────────────────────────────
// CONTENT RELATIONS
// ─────────────────────────────────────────────

export async function getRelatedContent(
  sourceType: string,
  sourceId: string,
  targetType: string,
  limit = 4
) {
  try {
    const supabase = await createClient();
    const { data: relations, error } = await supabase
      .from('content_relations')
      .select('target_id, order')
      .eq('source_type', sourceType)
      .eq('source_id', sourceId)
      .eq('target_type', targetType)
      .order('order', { ascending: true })
      .limit(limit);

    if (error || !relations || relations.length === 0) return [];

    const ids = relations.map((r) => r.target_id);

    if (targetType === 'blog') {
      const { data } = await supabase
        .from('blogs')
        .select('id, title, slug, category, thumbnail, created_at')
        .in('id', ids);
      return data || [];
    }

    if (targetType === 'service') {
      const { data } = await supabase
        .from('services')
        .select('id, title, slug, short_description, icon')
        .in('id', ids);
      return data || [];
    }

    if (targetType === 'faq') {
      const { data } = await supabase
        .from('faqs')
        .select('id, question, answer')
        .in('id', ids);
      return data || [];
    }

    return [];
  } catch (e) {
    console.error('[API] Exception in getRelatedContent:', e);
    return [];
  }
}
