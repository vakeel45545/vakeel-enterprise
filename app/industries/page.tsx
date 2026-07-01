import { Metadata } from 'next';
import { getIndustries } from '@/lib/api/industries';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Building2, Globe } from 'lucide-react';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Industries We Serve | Vakeel',
  description: 'Explore tailored legal and compliance solutions for your specific industry vertical. From Healthcare to FinTech, we have you covered.',
};

export default async function IndustriesPage() {
  const industries = await getIndustries();

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Industries', href: '/industries' },
  ];

  return (
    <main className="min-h-screen bg-ivory pb-20 selection:bg-sage/30 selection:text-sage">
      <BreadcrumbSchema items={breadcrumbs} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-charcoal text-white rounded-b-[3rem] noise-overlay shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-80">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-tr from-sage/15 to-emerald-800/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow mix-blend-screen" />
        </div>
        <div className="container relative z-10 mx-auto px-4 max-w-5xl text-center">
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight tracking-tight drop-shadow-sm">
              Industries We Serve
            </h1>
            <p className="text-xl text-white/70 mb-10 leading-relaxed font-medium">
              Tailored legal, compliance, and growth solutions designed specifically for the unique challenges of your sector.
            </p>
          </div>
        </div>
      </section>

      {/* Industry Grid */}
      <section className="py-24 relative text-charcoal">
        <div className="container mx-auto px-4 max-w-6xl">
          {(!industries || industries.length === 0) ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-charcoal/5 shadow-sm">
              <Globe className="w-16 h-16 text-charcoal/20 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-charcoal mb-2">Check back soon</h2>
              <p className="text-charcoal/60">We are currently updating our industry-specific solutions.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry, idx) => (
                <Link
                  href={`/industries/${industry.slug}`}
                  key={industry.id}
                  className={`bg-white rounded-[2rem] border border-charcoal/5 shadow-sm hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 group overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-8`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative h-48 w-full bg-charcoal/5 overflow-hidden">
                    {industry.image_url ? (
                      <Image
                        src={industry.image_url}
                        alt={industry.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-sage/5 text-sage/40">
                        <Building2 className="w-16 h-16" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
                    <h2 className="absolute bottom-6 left-6 right-6 text-2xl font-display font-bold text-white">
                      {industry.name}
                    </h2>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <p className="text-charcoal/65 leading-relaxed mb-6 flex-1 font-medium">
                      {industry.short_description || industry.description?.slice(0, 120) + '...'}
                    </p>
                    <div className="flex items-center text-sage font-bold text-sm uppercase tracking-wider group-hover:text-emerald-700 transition-colors">
                      View Solutions <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
