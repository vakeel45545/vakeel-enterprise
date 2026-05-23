import { ArrowRight, BookOpen, Clock, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function GenericPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  // Create a nice title from the last chunk of the slug
  const lastSlug = slug[slug.length - 1];
  const formattedTitle = lastSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  // Make a breadcrumb
  const breadcrumb = slug.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ');

  return (
    <main className="min-h-screen bg-ivory pb-20 selection:bg-sage/30 selection:text-sage">
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 bg-charcoal text-white rounded-b-[2.5rem] lg:rounded-b-[3rem] relative overflow-hidden noise-overlay">
        {/* Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-sage/[0.05] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-4 text-center max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 text-sm font-semibold text-white/70 backdrop-blur-md">
             <span>Home</span> <ChevronRight className="w-3 h-3 text-white/40" /> <span>{breadcrumb}</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-[72px] font-display font-bold mb-6 lg:mb-8 leading-[1.08] tracking-tight">
            {formattedTitle}
          </h1>
          <p className="text-xl lg:text-2xl text-white/60 mb-10 leading-relaxed max-w-2xl mx-auto text-balance">
            Discover the latest insights, resources, and company updates regarding {formattedTitle}. We are committed to transparency and knowledge sharing.
          </p>
        </div>
      </section>

      <section className="py-24 section-connector-top">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-[2rem] p-8 md:p-12 lg:p-16 border border-charcoal/[0.04] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both relative overflow-hidden">
            
            {/* Top decorative gradient line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sage/50 via-emerald-500/50 to-amber/50"></div>

            <div className="flex items-center gap-6 text-charcoal/45 text-sm font-semibold mb-12 border-b border-charcoal/[0.06] pb-6 uppercase tracking-wider">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-sage" /> Updated Today</div>
              <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-amber" /> 5 min read</div>
            </div>
            
            <div className="prose prose-lg lg:prose-xl prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-a:text-sage prose-a:font-semibold hover:prose-a:text-emerald-700 prose-p:text-charcoal/70 prose-p:leading-relaxed max-w-none prose-li:text-charcoal/70">
              <h2>Overview of {formattedTitle}</h2>
              <p>
                In the ever-evolving landscape of Indian business and compliance, staying completely up-to-date with <strong>{formattedTitle}</strong> is absolutely critical for founders and management teams. At Vakeel, our goal is to simplify this complexity through AI and expert intervention.
              </p>
              
              <div className="my-12 p-8 lg:p-10 bg-sage/[0.04] rounded-2xl border border-sage/10 relative overflow-hidden group hover:border-sage/20 transition-colors">
                 <div className="absolute -right-6 -bottom-6 text-sage/10 transform group-hover:scale-110 transition-transform duration-500">
                    <FileText className="w-48 h-48" />
                 </div>
                 <h3 className="relative z-10 text-2xl font-display font-bold text-charcoal mt-0 mb-6">Key Highlights</h3>
                 <ul className="relative z-10 space-y-3 mt-4 list-none pl-0">
                   {['Latest regulatory updates and compliance requirements.', 'How Vakeel AI automation streamlines this process.', 'Strategic insights for early-stage and growth-stage companies.'].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-sage/20 flex items-center justify-center shrink-0">
                           <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
                        </div>
                        <span className="text-lg text-charcoal/80 font-medium">{item}</span>
                      </li>
                   ))}
                 </ul>
              </div>

              <h2>Strategic Impact</h2>
              <p>
                Addressing {formattedTitle} correctly from day one prevents compounding technical and legal debt. Our comprehensive tools are designed to surface actionable insights rather than creating more manual administrative work. Whether you are bootstrapping a new venture or scaling an enterprise, the compliance standards remain rigorous.
              </p>
              <p>
                We highly recommend connecting your company&apos;s data sources to the Vakeel AI Dashboard so that deadlines related to {formattedTitle} and other crucial metrics are tracked automatically.
              </p>
            </div>
            
            <div className="mt-16 pt-10 border-t border-charcoal/[0.06] flex flex-col sm:flex-row items-center justify-between gap-6 bg-ivory -mx-8 -mx-12 lg:-mx-16 -mb-8 -mb-12 lg:-mb-16 p-8 md:p-12 lg:p-16">
              <div>
                <h4 className="font-display font-bold text-2xl text-charcoal mb-2">Need specific help with {formattedTitle}?</h4>
                <p className="text-charcoal/60">Our legal experts are available for a detailed consultation.</p>
              </div>
              <Link href="/">
                <Button className="bg-charcoal text-white hover:bg-sage shadow-xl shadow-charcoal/10 hover:shadow-sage/20 transition-all duration-300 h-14 px-8 group shrink-0 rounded-xl">
                  Book Consultation <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
