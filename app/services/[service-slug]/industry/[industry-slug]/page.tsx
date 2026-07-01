import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getServiceIndustryPage } from '@/lib/api/industries';
import Link from 'next/link';
import { ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { SectionRenderer } from '@/components/cms/SectionRenderer';

export async function generateMetadata({ params }: { params: Promise<{ 'service-slug': string, 'industry-slug': string }> }): Promise<Metadata> {
  const { 'service-slug': serviceSlug, 'industry-slug': industrySlug } = await params;
  const data = await getServiceIndustryPage(serviceSlug, industrySlug);

  if (!data) return {};

  const baseUrl = process.env.APP_URL || 'https://vakeel.com';
  const { service, industry, crossPage } = data;

  const title = crossPage?.meta_title || `${service.title} for ${industry.name} Industry | Vakeel`;
  const description = crossPage?.meta_description || `Expert ${service.title} services tailored specifically for the ${industry.name} industry.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/services/${service.slug}/industry/${industry.slug}`,
      images: industry.image_url || service.image ? [industry.image_url || service.image] : undefined,
    },
  };
}

export default async function ServiceIndustryPage({ params }: { params: Promise<{ 'service-slug': string, 'industry-slug': string }> }) {
  const { 'service-slug': serviceSlug, 'industry-slug': industrySlug } = await params;
  const data = await getServiceIndustryPage(serviceSlug, industrySlug);

  if (!data) return notFound();

  const { service, industry, crossPage } = data;

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: service.title, href: `/services/${service.slug}` },
    { name: `${industry.name} Solutions`, href: `/services/${service.slug}/industry/${industry.slug}` },
  ];

  const pageTitle = crossPage?.custom_title || `${service.title} for ${industry.name}`;
  const pageDesc = crossPage?.custom_description || `Tailored ${service.title} solutions for businesses in the ${industry.name} sector.`;
  const faqData = crossPage?.faq || service.faq;

  return (
    <main className="min-h-screen bg-ivory pb-20 selection:bg-sage/30 selection:text-sage">
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Hero Section */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-charcoal text-white rounded-b-[2.5rem] lg:rounded-b-[3rem] relative overflow-hidden noise-overlay">
        {industry.image_url && (
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-charcoal/80 mix-blend-multiply z-10" />
            <Image src={industry.image_url} alt={industry.name} fill className="object-cover opacity-30" />
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
            {pageTitle}
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed text-balance font-medium mb-10">
            {pageDesc}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
               <button className="bg-white text-charcoal hover:bg-sage hover:text-white transition-colors h-14 px-8 rounded-xl font-bold flex items-center justify-center group shadow-premium">
                 Get Started <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
               </button>
            </Link>
            <Link href={`/industries/${industry.slug}`}>
               <button className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 transition-colors h-14 px-8 rounded-xl font-bold flex items-center justify-center">
                 More {industry.name} Solutions
               </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Content from Cross Page */}
      {crossPage?.custom_content && (
        <section className="py-24 relative text-charcoal section-connector-top">
          <div className="container mx-auto px-4 max-w-4xl">
             <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-charcoal/5 shadow-sm prose prose-lg prose-headings:font-display prose-headings:font-bold prose-headings:text-charcoal prose-p:text-charcoal/70 max-w-none">
                <div dangerouslySetInnerHTML={{ __html: crossPage.custom_content }} />
             </div>
          </div>
        </section>
      )}

      {/* Fallback to Service Sections if no custom content */}
      {!crossPage?.custom_content && service.benefits && (
        <SectionRenderer sections={[
          {
            type: 'benefits',
            title: `Why Choose Us for ${service.title}?`,
            items: service.benefits,
          }
        ]} />
      )}
      
      {!crossPage?.custom_content && service.process_steps && (
        <SectionRenderer sections={[
          {
            type: 'process',
            title: 'How It Works',
            steps: service.process_steps,
          }
        ]} />
      )}

      {/* FAQs */}
      {faqData && faqData.length > 0 && (
         <SectionRenderer sections={[
           {
             type: 'faq',
             title: `Frequently Asked Questions - ${industry.name}`,
             items: faqData,
           }
         ]} />
      )}

    </main>
  );
}
