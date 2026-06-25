import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getIndustryBySlug, getServicesByIndustry } from '@/lib/api/industries';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SectionRenderer, SectionData } from '@/components/cms/SectionRenderer';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = await getIndustryBySlug(slug);

  if (!industry) return {};

  const baseUrl = process.env.APP_URL || 'https://vakeel.com';

  return {
    title: industry.meta_title || `${industry.name} Industry Solutions | Vakeel`,
    description: industry.meta_description || industry.short_description || `Legal and compliance solutions for the ${industry.name} industry.`,
    keywords: industry.keywords,
    openGraph: {
      title: industry.meta_title || `${industry.name} Industry Solutions | Vakeel`,
      description: industry.meta_description || industry.short_description || `Legal and compliance solutions for the ${industry.name} industry.`,
      url: `${baseUrl}/industries/${industry.slug}`,
      images: industry.og_image || industry.image_url ? [industry.og_image || industry.image_url] : undefined,
    },
  };
}

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [industry, crossPages] = await Promise.all([
    getIndustryBySlug(slug),
    // getServicesByIndustry requires industry ID, which we need to fetch first.
    // So we'll fetch crossPages after we ensure the industry exists.
    Promise.resolve(null), // placeholder
  ]);

  if (!industry) return notFound();

  // Now fetch the related services
  const assignedServices = await getServicesByIndustry(industry.id);

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Industries', href: '/industries' },
    { name: industry.name, href: `/industries/${industry.slug}` },
  ];

  // Map industry sections if any
  const sections: SectionData[] = industry.sections || [];

  return (
    <main className="min-h-screen bg-ivory pb-20 selection:bg-sage/30 selection:text-sage">
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Hero Section */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-charcoal text-white rounded-b-[2.5rem] lg:rounded-b-[3rem] relative overflow-hidden noise-overlay">
        {industry.image_url && (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-charcoal/80 mix-blend-multiply z-10" />
            <img src={industry.image_url} alt={industry.name} className="w-full h-full object-cover opacity-40" />
          </div>
        )}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sage/[0.15] rounded-full blur-[120px] pointer-events-none animate-pulse-glow z-10" />
        
        <div className="container relative z-20 mx-auto px-4 text-center max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 text-sm font-semibold text-white/70 backdrop-blur-md">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-3 h-3 text-white/40" />}
                <Link href={b.href} className="hover:text-white transition-colors">{b.name}</Link>
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-[72px] font-display font-bold mb-6 lg:mb-8 leading-[1.08] tracking-tight drop-shadow-sm">
            {industry.name} Solutions
          </h1>
          {(industry.short_description || industry.description) && (
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed text-balance font-medium">
              {industry.short_description || industry.description}
            </p>
          )}
        </div>
      </section>

      {/* Dynamic Sections (if configured via admin) */}
      {sections.length > 0 && (
        <SectionRenderer sections={sections} pageTitle={`${industry.name} Solutions`} />
      )}

      {/* Related Services List */}
      {assignedServices.length > 0 && (
        <section className="py-24 relative text-charcoal">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 tracking-tight">
                Services for {industry.name}
              </h2>
              <p className="text-charcoal/60 text-lg">Customized compliance and legal services for your specific vertical.</p>
            </div>

            <div className="space-y-6">
              {assignedServices.map((crossPage) => {
                const service = crossPage.service;
                if (!service) return null;
                
                // If there's a custom cross-page, we route to /services/service/industry
                // For now, link to the service directly until that dynamic route is built in 4c
                const linkHref = `/services/${service.slug}`;

                return (
                  <Link
                    key={crossPage.id}
                    href={linkHref}
                    className="block bg-white rounded-[2rem] p-6 lg:p-8 border border-charcoal/5 shadow-sm hover:shadow-premium-hover transition-all duration-300 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-sage/10 text-sage flex items-center justify-center shrink-0 border border-sage/20 group-hover:bg-sage group-hover:text-white transition-colors duration-300">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-charcoal mb-2 group-hover:text-sage transition-colors">
                            {crossPage.custom_title || service.title}
                          </h3>
                          <p className="text-charcoal/60 font-medium leading-relaxed max-w-2xl">
                            {crossPage.custom_description || service.short_description}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-charcoal/5 group-hover:bg-sage text-charcoal group-hover:text-white transition-all duration-300">
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Description Content (if present and no sections used) */}
      {industry.description && sections.length === 0 && (
        <section className="py-24 relative text-charcoal section-connector-top">
          <div className="container mx-auto px-4 max-w-4xl">
             <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-charcoal/5 shadow-sm prose prose-lg prose-headings:font-display prose-headings:font-bold prose-headings:text-charcoal prose-p:text-charcoal/70 max-w-none">
                <div dangerouslySetInnerHTML={{ __html: industry.description.replace(/\n/g, '<br/>') }} />
             </div>
          </div>
        </section>
      )}

    </main>
  );
}
