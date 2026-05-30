import { ArrowRight, CheckCircle2, Zap, Users, Clock, ShieldCheck, Star, TrendingUp, Building2, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// ─── Section Type Definitions ──────────────────────────────────────────────────

export interface HeroSectionData {
  type: 'hero';
  title?: string;
  description?: string;
  badge?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
}

export interface BenefitItem {
  title: string;
  description: string;
  icon?: string;
}

export interface BenefitsSectionData {
  type: 'benefits';
  title?: string;
  subtitle?: string;
  items: BenefitItem[];
}

export interface ProcessStep {
  step?: number;
  title?: string;
  description: string;
}

export interface ProcessSectionData {
  type: 'process';
  title?: string;
  steps: ProcessStep[];
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQSectionData {
  type: 'faq';
  title?: string;
  items: FAQItem[];
}

export interface CTASectionData {
  type: 'cta';
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export interface ContentSectionData {
  type: 'content';
  html?: string;
  title?: string;
}

export interface TestimonialItem {
  client_name: string;
  company?: string;
  review: string;
  rating?: number;
  image?: string;
}

export interface TestimonialsSectionData {
  type: 'testimonials';
  title?: string;
  items?: TestimonialItem[];
}

export type SectionData =
  | HeroSectionData
  | BenefitsSectionData
  | ProcessSectionData
  | FAQSectionData
  | CTASectionData
  | ContentSectionData
  | TestimonialsSectionData;

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  Zap, Users, Clock, ShieldCheck, Star, TrendingUp, Building2, FileText, CheckCircle2, ArrowRight,
};

function DynamicIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return <Zap className={className} />;
  const Icon = ICON_MAP[name] || Zap;
  return <Icon className={className} />;
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection({ data, pageTitle }: { data: HeroSectionData; pageTitle?: string }) {
  const title = data.title || pageTitle || 'Welcome';
  return (
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-charcoal text-white rounded-b-[3rem] noise-overlay shadow-2xl">
      <div className="absolute inset-0 z-0 opacity-80">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-tr from-sage/15 to-emerald-800/10 rounded-full blur-[150px] pointer-events-none animate-pulse-glow mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-amber/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:64px_64px] pointer-events-none" />
      </div>
      <div className="container relative z-10 mx-auto px-4 max-w-[1440px]">
        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {data.badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 text-xs font-bold uppercase tracking-widest text-white shadow-premium backdrop-blur-2xl">
              <Star className="w-3.5 h-3.5 text-amber" /> {data.badge}
            </div>
          )}
          <h1 className="text-5xl md:text-6xl lg:text-[84px] font-display font-bold mb-6 leading-[1.05] tracking-tight drop-shadow-sm">
            {title}
          </h1>
          {data.description && (
            <p className="text-xl text-white/70 max-w-2xl mb-10 leading-relaxed font-medium">
              {data.description}
            </p>
          )}
          {(data.primaryButtonText || data.secondaryButtonText) && (
            <div className="flex flex-col sm:flex-row gap-4">
              {data.primaryButtonText && (
                <Link href={data.primaryButtonUrl || '/contact'}>
                  <Button size="lg" className="bg-white text-charcoal hover:bg-sage hover:text-white shadow-premium-hover transition-all transition-spring rounded-xl h-14 px-8 font-bold group">
                    {data.primaryButtonText} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
              {data.secondaryButtonText && (
                <Link href={data.secondaryButtonUrl || '/contact'}>
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 glass-dark rounded-xl font-bold">
                    {data.secondaryButtonText}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Benefits Section ─────────────────────────────────────────────────────────

function BenefitsSection({ data }: { data: BenefitsSectionData }) {
  return (
    <section className="py-24 relative text-charcoal">
      <div className="container mx-auto px-4 max-w-[1440px]">
        {(data.title || data.subtitle) && (
          <div className="max-w-2xl mb-16">
            {data.title && <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4 tracking-tight text-charcoal">{data.title}</h2>}
            {data.subtitle && <p className="text-lg text-charcoal/65 leading-relaxed font-medium">{data.subtitle}</p>}
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {data.items?.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-[2rem] border border-charcoal/5 shadow-sm group hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sage/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-2xl bg-sage/10 border border-sage/20 flex items-center justify-center mb-6 text-sage group-hover:scale-110 group-hover:bg-sage group-hover:text-white transition-all duration-500 shadow-inner relative z-10">
                <DynamicIcon name={item.icon} className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-charcoal text-xl mb-3 relative z-10">{item.title}</h3>
              <p className="text-charcoal/60 leading-relaxed text-base relative z-10 font-medium">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Process Section ──────────────────────────────────────────────────────────

function ProcessSection({ data }: { data: ProcessSectionData }) {
  return (
    <section className="py-24 relative text-charcoal">
      <div className="container mx-auto px-4 max-w-[1440px]">
        <h2 className="text-4xl lg:text-5xl font-display font-bold mb-16 tracking-tight text-charcoal">
          {data.title || 'The Process'}
        </h2>
        <div className="space-y-6 lg:space-y-8 relative max-w-3xl before:absolute before:inset-0 before:ml-[34px] before:-translate-x-px before:h-full before:w-[2px] before:bg-gradient-to-b before:from-sage before:via-emerald-400 before:to-sage before:shadow-[0_0_15px_rgba(74,124,89,0.5)]">
          {data.steps?.map((step, idx) => (
            <div key={idx} className="relative flex items-start gap-8 group">
              <div className="flex items-center justify-center w-16 h-16 rounded-[1.25rem] border border-white/50 bg-charcoal text-white font-display font-bold text-xl shrink-0 shadow-premium z-10 group-hover:bg-sage group-hover:scale-110 transition-all duration-500 transition-spring">
                {step.step || idx + 1}
              </div>
              <div className="bg-white p-6 lg:p-8 rounded-[1.75rem] border border-charcoal/5 shadow-sm group-hover:shadow-premium-hover transition-all duration-500 flex-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-sage/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {step.title && <h3 className="font-bold text-charcoal text-xl mb-2 relative z-10">{step.title}</h3>}
                <p className="font-medium text-charcoal/70 text-lg relative z-10 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────────

function FAQSection({ data }: { data: FAQSectionData }) {
  return (
    <section className="py-24 bg-ivory relative text-charcoal">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-4xl lg:text-5xl font-display font-bold mb-16 tracking-tight text-charcoal text-center">
          {data.title || 'Frequently Asked Questions'}
        </h2>
        <div className="space-y-4">
          {data.items?.map((item, idx) => (
            <details
              key={idx}
              className="group bg-white rounded-[1.5rem] border border-charcoal/5 shadow-sm hover:shadow-premium-hover transition-all duration-300 overflow-hidden"
            >
              <summary className="flex items-center justify-between p-6 lg:p-8 cursor-pointer list-none">
                <span className="font-bold text-charcoal text-lg pr-4">{item.q}</span>
                <div className="w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center shrink-0 group-open:bg-sage group-open:text-white transition-all duration-300">
                  <ArrowRight className="w-4 h-4 rotate-90 group-open:rotate-[270deg] transition-transform duration-300" />
                </div>
              </summary>
              <div className="px-6 lg:px-8 pb-6 lg:pb-8 text-charcoal/65 leading-relaxed font-medium border-t border-charcoal/5 pt-4">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────

function CTASection({ data }: { data: CTASectionData }) {
  return (
    <section className="py-32 bg-charcoal text-white text-center relative overflow-hidden mt-20 rounded-t-[3rem] noise-overlay">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:48px_48px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sage/[0.08] rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber/[0.05] rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="container relative z-10 mx-auto px-4 max-w-4xl">
        <h2 className="text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-8 tracking-tight drop-shadow-sm">
          {data.title || 'Ready to get started?'}
        </h2>
        {data.description && (
          <p className="text-xl lg:text-2xl text-white/60 mx-auto mb-12 leading-relaxed text-balance font-medium">
            {data.description}
          </p>
        )}
        {data.buttonText && (
          <Link href={data.buttonUrl || '/contact'}>
            <Button size="lg" className="bg-white text-charcoal hover:bg-sage hover:text-white shadow-premium-hover h-16 px-10 text-lg group rounded-xl font-bold transition-all transition-spring">
              {data.buttonText} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}

// ─── Content Section ──────────────────────────────────────────────────────────

function ContentSection({ data }: { data: ContentSectionData }) {
  return (
    <section className="py-24 relative text-charcoal">
      <div className="container mx-auto px-4 max-w-4xl">
        {data.title && (
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-10 tracking-tight text-charcoal">{data.title}</h2>
        )}
        {data.html && (
          <div
            className="prose prose-lg lg:prose-xl prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-charcoal prose-a:text-sage prose-a:font-semibold hover:prose-a:text-emerald-700 prose-p:text-charcoal/75 prose-p:leading-loose prose-blockquote:border-l-4 prose-blockquote:border-sage prose-blockquote:bg-sage/5 prose-blockquote:p-6 prose-blockquote:rounded-r-xl prose-strong:text-charcoal prose-strong:font-bold max-w-none"
            dangerouslySetInnerHTML={{ __html: data.html }}
          />
        )}
      </div>
    </section>
  );
}

// ─── Main Section Renderer ────────────────────────────────────────────────────

interface SectionRendererProps {
  sections: SectionData[];
  pageTitle?: string;
}

export function SectionRenderer({ sections, pageTitle }: SectionRendererProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section, idx) => {
        switch (section.type) {
          case 'hero':
            return <HeroSection key={idx} data={section} pageTitle={pageTitle} />;
          case 'benefits':
            return <BenefitsSection key={idx} data={section} />;
          case 'process':
            return <ProcessSection key={idx} data={section} />;
          case 'faq':
            return <FAQSection key={idx} data={section} />;
          case 'cta':
            return <CTASection key={idx} data={section} />;
          case 'content':
            return <ContentSection key={idx} data={section} />;
          default:
            return null;
        }
      })}
    </>
  );
}
