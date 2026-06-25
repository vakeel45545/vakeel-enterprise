import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Global search API — searches across services, blogs, pages, and FAQs.
 * Uses PostgreSQL text search for fast matching.
 * GET /api/search?q=gst+registration&limit=10
 */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim();
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], query: '' });
  }

  const supabase = await createClient();

  // Search multiple tables in parallel
  const searchTerm = `%${query}%`;

  const [servicesRes, blogsRes, pagesRes, faqsRes] = await Promise.all([
    supabase
      .from('services')
      .select('id, title, slug, short_description, icon, category')
      .eq('published', true)
      .or(`title.ilike.${searchTerm},short_description.ilike.${searchTerm},keywords.ilike.${searchTerm}`)
      .limit(limit),
    supabase
      .from('blogs')
      .select('id, title, slug, category, thumbnail, meta_description')
      .eq('published', true)
      .or(`title.ilike.${searchTerm},content.ilike.${searchTerm},meta_description.ilike.${searchTerm}`)
      .limit(limit),
    supabase
      .from('pages')
      .select('id, title, slug, meta_description, page_type')
      .eq('published', true)
      .or(`title.ilike.${searchTerm},meta_description.ilike.${searchTerm},content.ilike.${searchTerm}`)
      .limit(limit),
    supabase
      .from('faqs')
      .select('id, question, answer, service_slug')
      .or(`question.ilike.${searchTerm},answer.ilike.${searchTerm}`)
      .limit(limit),
  ]);

  const results = [
    ...(servicesRes.data || []).map((s) => ({
      type: 'service' as const,
      id: s.id,
      title: s.title,
      slug: `/services/${s.slug}`,
      description: s.short_description,
      icon: s.icon,
      category: s.category,
    })),
    ...(blogsRes.data || []).map((b) => ({
      type: 'blog' as const,
      id: b.id,
      title: b.title,
      slug: `/blog/${b.slug}`,
      description: b.meta_description,
      icon: null,
      category: b.category,
    })),
    ...(pagesRes.data || []).map((p) => ({
      type: 'page' as const,
      id: p.id,
      title: p.title,
      slug: `/${p.slug}`,
      description: p.meta_description,
      icon: null,
      category: p.page_type,
    })),
    ...(faqsRes.data || []).map((f) => ({
      type: 'faq' as const,
      id: f.id,
      title: f.question,
      slug: f.service_slug ? `/services/${f.service_slug}#faqs` : '/#faqs',
      description: f.answer?.slice(0, 120),
      icon: null,
      category: 'FAQ',
    })),
  ];

  return NextResponse.json({
    results: results.slice(0, limit),
    query,
    total: results.length,
  });
}
