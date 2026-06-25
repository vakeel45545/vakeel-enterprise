import { createClient } from '@/lib/supabase/server';

// ─────────────────────────────────────────────
// INDUSTRIES
// ─────────────────────────────────────────────

export async function getIndustries() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('industries')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('[API] Error fetching industries:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('[API] Exception in getIndustries:', e);
    return [];
  }
}

export async function getIndustryBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('industries')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) {
      console.error(`[API] Error fetching industry "${slug}":`, error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.error(`[API] Exception in getIndustryBySlug("${slug}"):`, e);
    return null;
  }
}

export async function getServicesByIndustry(industryId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('service_industries')
      .select('*, service:services(id, title, slug, short_description, icon, category)')
      .eq('industry_id', industryId)
      .eq('published', true);

    if (error) {
      console.error('[API] Error fetching services by industry:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('[API] Exception in getServicesByIndustry:', e);
    return [];
  }
}

export async function getServiceIndustryPage(serviceSlug: string, industrySlug: string) {
  try {
    const supabase = await createClient();

    // Get service and industry IDs
    const [serviceRes, industryRes] = await Promise.all([
      supabase.from('services').select('id, title, slug, short_description, meta_title, meta_description, image, faq, benefits, process_steps').eq('slug', serviceSlug).maybeSingle(),
      supabase.from('industries').select('id, name, slug, description, image_url').eq('slug', industrySlug).eq('published', true).maybeSingle(),
    ]);

    if (!serviceRes.data || !industryRes.data) return null;

    // Get the custom service × industry content
    const { data: crossPage } = await supabase
      .from('service_industries')
      .select('*')
      .eq('service_id', serviceRes.data.id)
      .eq('industry_id', industryRes.data.id)
      .eq('published', true)
      .maybeSingle();

    return {
      service: serviceRes.data,
      industry: industryRes.data,
      crossPage: crossPage || null,
    };
  } catch (e) {
    console.error('[API] Exception in getServiceIndustryPage:', e);
    return null;
  }
}

export async function getIndustryCityPage(industrySlug: string, citySlug: string) {
  try {
    const supabase = await createClient();

    const [industryRes, cityRes] = await Promise.all([
      supabase.from('industries').select('id, name, slug').eq('slug', industrySlug).eq('published', true).maybeSingle(),
      supabase.from('cities').select('id, city_name, slug, state').eq('slug', citySlug).maybeSingle(),
    ]);

    if (!industryRes.data || !cityRes.data) return null;

    const { data: cityPage } = await supabase
      .from('industry_city_pages')
      .select('*')
      .eq('industry_id', industryRes.data.id)
      .eq('city_id', cityRes.data.id)
      .eq('published', true)
      .maybeSingle();

    return {
      industry: industryRes.data,
      city: cityRes.data,
      cityPage: cityPage || null,
    };
  } catch (e) {
    console.error('[API] Exception in getIndustryCityPage:', e);
    return null;
  }
}

export async function getAllIndustriesAdmin() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('industries')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('[API] Error fetching all industries:', error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.error('[API] Exception in getAllIndustriesAdmin:', e);
    return [];
  }
}
