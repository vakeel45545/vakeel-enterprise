import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, BookOpen, Clock, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getPageBySlug } from '@/lib/api/services';
import { generatePageSEO } from '@/lib/seo/generateMetadata';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SectionRenderer, SectionData } from '@/components/cms/SectionRenderer';

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const slugArray = Array.isArray(slug) ? slug : (typeof slug === 'string' ? [slug] : []);
  const fullSlug = slugArray.join('/');

  // Try CMS page first
  const page = await getPageBySlug(fullSlug) as any;
  if (page) {
    return generatePageSEO(page);
  }

  return {};
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const slugArray = Array.isArray(slug) ? slug : (typeof slug === 'string' ? [slug] : []);
  const fullSlug = slugArray.join('/');

  // ─── TRY CMS PAGE FROM DB ───
  const page = await getPageBySlug(fullSlug) as any;

if (page) {
  // Fetch sections from page_sections table (admin builder saves here)
  const { createClient } = await import('@/lib/supabase/server');
  const supabase = await createClient();
  const { data: pageSectionsData } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_id', page.id)
    .eq('visible', true)
    .order('order_index', { ascending: true });

  // Map page_sections rows to SectionData shape SectionRenderer expects
  const sections: SectionData[] = (pageSectionsData ?? []).map((s: any) => ({
    type: s.section_key,
    title: s.title,
    subtitle: s.subtitle,
    ...s.content,
  }));
    const breadcrumbs = [
      { name: 'Home', href: '/' },
      ...slugArray.map((s, i) => ({
        name: s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' '),
        href: '/' + slugArray.slice(0, i + 1).join('/'),
      })),
    ];

    // If CMS page has sections → use SectionRenderer
    if (sections.length > 0) {
      return (
        <main className="min-h-screen bg-ivory pb-20 selection:bg-sage/30 selection:text-sage">
          <BreadcrumbSchema items={breadcrumbs} />
          <SectionRenderer sections={sections} pageTitle={page.title} />
          {/* Render raw content block below sections if present */}
          {page.content && (
            <section className="py-24 relative text-charcoal">
              <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-[2rem] p-8 md:p-12 lg:p-16 border border-charcoal/[0.04] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.04)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sage/50 via-emerald-500/50 to-amber/50"></div>
                  <div
                    className="prose prose-lg lg:prose-xl prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-charcoal prose-a:text-sage prose-a:font-semibold hover:prose-a:text-emerald-700 prose-p:text-charcoal/75 prose-p:leading-loose prose-blockquote:border-l-4 prose-blockquote:border-sage prose-blockquote:bg-sage/5 prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-strong:text-charcoal prose-strong:font-bold max-w-none"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                  />
                </div>
              </div>
            </section>
          )}
        </main>
      );
    }

    // CMS page with content only (no sections) — e.g. legal pages
    if (page.content) {
      return (
        <main className="min-h-screen bg-ivory pb-20 selection:bg-sage/30 selection:text-sage">
          <BreadcrumbSchema items={breadcrumbs} />
          <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-charcoal text-white rounded-b-[2.5rem] lg:rounded-b-[3rem] relative overflow-hidden noise-overlay">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear_gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
            <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 text-sm font-semibold text-white/70 backdrop-blur-md">
                {breadcrumbs.map((b, i) => (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && <ChevronRight className="w-3 h-3 text-white/40" />}
                    <Link href={b.href} className="hover:text-white transition-colors">{b.name}</Link>
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-[72px] font-display font-bold mb-6 lg:mb-8 leading-[1.08] tracking-tight">
                {page.title}
              </h1>
            </div>
          </section>
          <section className="py-24 section-connector-top">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="bg-white rounded-[2rem] p-8 md:p-12 lg:p-16 border border-charcoal/[0.04] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.04)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sage/50 via-emerald-500/50 to-amber/50"></div>
                <div
                  className="prose prose-lg lg:prose-xl prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-charcoal prose-headings:mt-12 prose-headings:mb-6 prose-a:text-sage prose-a:font-semibold hover:prose-a:text-emerald-700 prose-p:text-charcoal/75 prose-p:leading-loose prose-p:mb-6 prose-blockquote:border-l-4 prose-blockquote:border-sage prose-blockquote:bg-sage/5 prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-charcoal/80 prose-img:rounded-[2rem] prose-img:shadow-premium prose-hr:border-charcoal/10 prose-strong:text-charcoal prose-strong:font-bold prose-li:text-charcoal/75 prose-li:my-2 prose-ul:my-6 max-w-none transition-all duration-300"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </div>
            </div>
          </section>
        </main>
      );
    }
  }

  return notFound();
}
