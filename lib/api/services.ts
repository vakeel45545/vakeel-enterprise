import { createClient } from '@/lib/supabase/server';

export async function getServices() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('[API] Error fetching services:', error.message, error.details);
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
      console.error(`[API] Error fetching service "${slug}":`, error.message, error.details);
      return null;
    }
    return data;
  } catch (e) {
    console.error(`[API] Exception in getServiceBySlug("${slug}"):`, e);
    return null;
  }
}

export async function getCities() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('city_name', { ascending: true });
      
    if (error) {
      console.error('[API] Error fetching cities:', error.message, error.details);
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
      console.error(`[API] Error fetching city "${slug}":`, error.message, error.details);
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

export async function getNavigation() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('navigation')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('[API] Error fetching navigation:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('[API] Exception in getNavigation:', e);
    return [];
  }
}

export async function getBlogs() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

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

export async function getBlogBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
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
