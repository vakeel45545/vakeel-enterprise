import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, ShieldCheck, Star, Clock, Zap, Building2, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getServiceBySlug, getCityBySlug, getServiceCityPage } from '@/lib/api/services';
import { stripHtmlTags } from '@/lib/utils';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ 'service-slug': string, 'city-slug': string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const serviceSlug = resolvedParams['service-slug'];
  const citySlug = resolvedParams['city-slug'];
  
  const service = await getServiceBySlug(serviceSlug);
  const city = await getCityBySlug(citySlug);

  const fallbackServiceTitle = serviceSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const fallbackCityName = citySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const serviceTitle = service?.title || fallbackServiceTitle;
  const cityName = city?.city_name || fallbackCityName;

  const baseUrl = process.env.APP_URL || 'https://vakeel.com';
  const imageUrl = `${baseUrl}/og-fallback.jpg`; // Defaulting to premium fallback

  if (service && city) {
    const customPage = await getServiceCityPage(service.id, city.id);
    if (customPage?.meta_title) {
      const title = customPage.meta_title;
      const description = customPage.meta_description || `Get ${serviceTitle} in ${cityName} completely online.`;
      return {
        title,
        description,
        keywords: `${serviceTitle.toLowerCase()} in ${cityName.toLowerCase()}, ${cityName} business registration, vakeel`.replace(/^, /, ''),
        alternates: { canonical: `${baseUrl}/services/${serviceSlug}/${citySlug}` },
        robots: { index: true, follow: true },
        openGraph: {
          title,
          description,
          url: `${baseUrl}/services/${serviceSlug}/${citySlug}`,
          siteName: 'Vakeel',
          images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
          type: 'website',
        },
        twitter: { card: 'summary_large_image', title, description, images: [imageUrl] }
      };
    }
  }

  const title = `${serviceTitle} in ${cityName} | Vakeel`;
  const description = service?.meta_description || stripHtmlTags(service?.short_description) || `Get ${serviceTitle} in ${cityName} completely online with Vakeel.`;

  return {
    title,
    description,
    keywords: `${serviceTitle.toLowerCase()} in ${cityName.toLowerCase()}, ${cityName} business registration, vakeel`.replace(/^, /, ''),
    alternates: { canonical: `${baseUrl}/services/${serviceSlug}/${citySlug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/services/${serviceSlug}/${citySlug}`,
      siteName: 'Vakeel',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] }
  };
}

export default async function ServiceCityPage({ params }: { params: Promise<{ 'service-slug': string, 'city-slug': string }> }) {
  const resolvedParams = await params;
  const serviceSlug = resolvedParams['service-slug'];
  const citySlug = resolvedParams['city-slug'];

  const service = await getServiceBySlug(serviceSlug);
  const city = await getCityBySlug(citySlug);

  // Graceful fallback objects when DB records are missing
  const fallbackServiceTitle = serviceSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const fallbackCityName = citySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const cityName = city?.city_name || fallbackCityName;
  
  let customPage = null;
  if (service && city) {
    customPage = await getServiceCityPage(service.id, city.id);
  }

  const heroTitle = customPage?.hero_title || service?.hero_title || service?.title || fallbackServiceTitle;
  const heroContent = customPage?.hero_content || service?.short_description || `Get your ${heroTitle} in ${cityName} completely online with AI-assisted workflows. 100% compliant, fast-tracked, and zero errors guaranteed.`;

  return (
    <main className="min-h-screen bg-ivory pb-20 selection:bg-sage/30 selection:text-sage">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-charcoal text-white rounded-b-[3rem] noise-overlay shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-80">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-tr from-sage/15 to-emerald-800/10 rounded-full blur-[150px] pointer-events-none animate-pulse-glow mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-amber/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:64px_64px] pointer-events-none" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 max-w-[1440px]">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 text-xs font-bold uppercase tracking-widest text-white shadow-premium backdrop-blur-2xl">
              <Star className="w-3.5 h-3.5 text-amber" /> Premium Service in {cityName}
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-[84px] font-display font-bold mb-6 leading-[1.05] tracking-tight drop-shadow-sm">
              {heroTitle} <span className="text-sage italic pr-2 relative block mt-2">
                in {cityName}.
              </span>
            </h1>
            <div 
              className="prose prose-lg lg:prose-xl prose-invert prose-p:text-white/70 prose-a:text-sage hover:prose-a:text-white prose-a:transition-colors max-w-2xl mb-10 leading-relaxed text-balance font-medium"
              dangerouslySetInnerHTML={{ __html: heroContent }} 
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-charcoal hover:bg-sage hover:text-white shadow-premium-hover transition-all transition-spring rounded-xl h-14 lg:h-16 px-8 lg:px-10 text-base lg:text-lg group font-bold">
                Get Started Now <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="mt-14 flex flex-wrap items-center gap-6 lg:gap-8 text-white/50 text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sage" /> No hidden fees</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber" /> Fast turnaround</div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure process</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 relative section-connector-top text-charcoal">
        <div className="container mx-auto px-4 max-w-[1440px]">
          <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
            
            {/* Left Content */}
            <div className="w-full lg:w-3/5 xl:w-2/3 space-y-20">
              
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
                <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 tracking-tight text-charcoal">Why Choose Vakeel for {heroTitle} in {cityName}?</h2>
                <p className="text-lg lg:text-xl text-charcoal/65 leading-relaxed text-balance font-medium">
                  Navigating the complexities of {heroTitle} in {cityName} can be challenging without the right expertise. At Vakeel, our AI-powered platform paired with top-tier legal professionals ensures a seamless, transparent, and swift experience. We handle the paperwork so you can focus on building your business.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
                {[
                  { icon: Zap, title: "AI-Powered Accuracy", desc: "Our platform reduces human error to zero, ensuring your documents are perfect before filing." },
                  { icon: Users, title: "Dedicated Manager", desc: "Get a dedicated expert to guide you step-by-step through the entire procedure." },
                  { icon: Clock, title: "Transparent Tracking", desc: "Track every step of your application in real-time through your intuitive dashboard." },
                  { icon: ShieldCheck, title: "Data Security", desc: "Your sensitive information is protected with enterprise-grade encryption protocols." }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white p-8 lg:p-10 rounded-[2rem] border border-charcoal/5 shadow-sm group hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-sage/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-14 h-14 rounded-2xl bg-sage/10 border border-sage/20 flex items-center justify-center mb-6 text-sage group-hover:scale-110 group-hover:bg-sage group-hover:text-white transition-all duration-500 transition-spring shadow-inner relative z-10">
                      <item.icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-charcoal text-xl lg:text-2xl mb-3 relative z-10">{item.title}</h3>
                    <p className="text-charcoal/60 leading-relaxed text-base relative z-10 font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Sticky Sidebar (Tier-1 Lead Form) */}
            <div className="w-full lg:w-2/5 xl:w-1/3">
              <div className="bg-white rounded-[2rem] p-8 lg:p-10 border border-charcoal/5 shadow-premium sticky top-32 relative overflow-hidden group/sidebar">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-transparent to-sage/5 rounded-bl-[4rem] pointer-events-none group-hover/sidebar:to-sage/10 transition-colors duration-1000" />
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sage to-emerald-500" />
                
                <h3 className="text-3xl font-display font-bold mb-2 text-charcoal mt-2">Need Expert Help?</h3>
                <p className="text-charcoal/55 mb-8 font-medium">Leave your details and a dedicated manager from our {cityName} team will call you back within 5 minutes.</p>
                
                <form className="space-y-5">
                  <div className="relative group">
                    <input type="text" id="fullname" className="peer w-full bg-ivory border border-charcoal/[0.08] rounded-xl h-14 px-4 pt-4 outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage/50 focus:bg-white transition-all text-charcoal font-semibold hover:border-charcoal/[0.15]" placeholder=" " />
                    <label htmlFor="fullname" className="absolute text-xs font-bold uppercase tracking-wider text-charcoal/40 left-4 top-4 transition-all peer-focus:-translate-y-2 peer-focus:text-[10px] peer-focus:text-sage peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[10px]">
                      Full Name
                    </label>
                  </div>
                  <div className="relative group">
                    <input type="tel" id="phone" className="peer w-full bg-ivory border border-charcoal/[0.08] rounded-xl h-14 px-4 pt-4 outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage/50 focus:bg-white transition-all text-charcoal font-semibold hover:border-charcoal/[0.15]" placeholder=" " />
                    <label htmlFor="phone" className="absolute text-xs font-bold uppercase tracking-wider text-charcoal/40 left-4 top-4 transition-all peer-focus:-translate-y-2 peer-focus:text-[10px] peer-focus:text-sage peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[10px]">
                      Phone Number
                    </label>
                  </div>
                  <Button className="w-full bg-charcoal hover:bg-sage text-white h-14 shadow-premium-hover mt-6 text-base rounded-xl transition-all duration-300 font-bold group/btn">
                    Request Call Back <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all transition-spring" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
