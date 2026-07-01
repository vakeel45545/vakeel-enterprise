import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, ShieldCheck, Star, Clock, Zap, Building2, TrendingUp, Users, Shield, Coins, Infinity, Award, Briefcase, Scale, Users2, ArrowRightLeft, FileText, CreditCard, Home, Camera, Mail, MapPin, FileSignature, Check, Landmark, BadgeCheck, Receipt, ClipboardCheck, Clock3, Lock, Headset } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getServiceBySlug, getRelatedContent } from '@/lib/api/services';
import { stripHtmlTags } from '@/lib/utils';
import { generateServiceSEO } from '@/lib/seo/generateMetadata';
import { ServiceSchema } from '@/components/seo/ServiceSchema';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { FAQSchema } from '@/components/seo/FAQSchema';
import { SectionRenderer } from '@/components/cms/SectionRenderer';
import type { Metadata } from 'next';

const BASE_URL = process.env.APP_URL || 'https://vakeel.com';

export async function generateMetadata({ params }: { params: Promise<{ 'service-slug': string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams['service-slug'];
  const service = await getServiceBySlug(slug);
  if (!service) {
    // Fallback for slug-based title
    const fallbackTitle = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return generateServiceSEO({ title: fallbackTitle, slug, short_description: null, meta_title: null, meta_description: null, keywords: null, image: null });
  }
  return generateServiceSEO(service);
}

export default async function ServicePage({ params }: { params: Promise<{ 'service-slug': string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams['service-slug'];

  const service = await getServiceBySlug(slug);

  // Graceful fallback: generate content from slug when DB record is missing
  const formattedTitle = service?.hero_title || service?.title || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const shortDescription = service?.short_description || `Register your Private Limited Company (Pvt Ltd) with the Ministry of Corporate Affairs (MCA) and take your startup to the next level. A Private Limited Company is the most popular, scalable, and trusted business structure for Indian startups and growing businesses. Under the Companies Act 2013, it offers directors and shareholders absolute legal protection through limited liability, meaning your personal assets are always safe from business risks. Additionally, it gives you a separate legal identity, making it significantly easier to raise venture capital, secure bank loans, attract top talent, and build long-term brand credibility. With our 100% online process, expert CA & CS guidance, and completely transparent pricing, we handle all ROC compliances, name approvals, and documentation securely while you focus on scaling your business.`;

  // Default FAQs when DB is empty
  const defaultFaqs = [
    { q: "Who should register a Private Limited Company?", a: "Startups, growing businesses, and entrepreneurs looking for outside funding, limited liability protection, and a scalable corporate structure should register as a Private Limited Company. It is the most trusted business entity in India for B2B operations and scaling." },
    { q: "Can a single person start a Private Limited Company?", a: "No, a Private Limited Company requires a minimum of two directors and two shareholders to incorporate. If you are a single founder, you can incorporate a One Person Company (OPC) instead, which allows a single member to operate with limited liability." },
    { q: "What is the difference between an LLP and a Private Limited Company?", a: "While both offer limited liability, a Private Limited Company is better suited for startups looking to raise equity funding (VCs/Angel Investors) and offer ESOPs to employees. An LLP (Limited Liability Partnership) is better for professional services firms that do not intend to raise equity capital and want fewer annual ROC compliances." },
    { q: "How long does the registration process take?", a: "With Vakeel's streamlined online process, registering a Private Limited Company typically takes 7 to 14 working days, subject to government processing times, document verification, and the availability of your proposed company name." },
    { q: "How much minimum capital is required?", a: "The government has abolished the minimum paid-up capital requirement for Private Limited Companies. You can now start a company with any amount of authorized and paid-up capital, even as low as ₹1,000." },
    { q: "Can NRIs or Foreign Nationals register a company in India?", a: "Yes, Non-Resident Indians (NRIs) and Foreign Nationals can become directors and shareholders of an Indian Private Limited Company. However, at least one director must be an Indian Resident (someone who has stayed in India for at least 182 days in the previous financial year). All foreign documents must be properly notarized and apostilled." },
    { q: "Is GST registration mandatory immediately after incorporation?", a: "No, GST registration is not automatically mandatory upon incorporation. It becomes mandatory only when your annual turnover exceeds ₹40 Lakhs (for goods) or ₹20 Lakhs (for services), or if you are engaged in inter-state taxable supply or e-commerce operations. However, many companies voluntarily register for GST immediately to claim input tax credits." },
    { q: "What are the mandatory annual ROC compliances?", a: "Every Private Limited Company must hold a minimum of 4 Board Meetings per year, appoint a statutory auditor within 30 days of incorporation, file annual financial statements (AOC-4), file the annual return (MGT-7), and complete director KYC (DIR-3 KYC). Non-compliance attracts heavy daily penalties from the MCA." },
    { q: "Do I need a commercial office space to register?", a: "No, you do not need a commercial office space to register your company. You can legally register your Private Limited Company at your residential address. You only need to provide a recent utility bill (electricity, water, or gas) and a No Objection Certificate (NOC) from the legal owner of the property." },
    { q: "What happens if I want to close the company later?", a: "If your company is inoperative and has no assets or liabilities, you can apply for 'Strike Off' under the Fast Track Exit (FTE) scheme by filing Form STK-2. However, all pending compliances must be cleared before applying for closure." },
    { q: "What is the corporate tax rate for a Private Limited Company?", a: "The corporate tax rate depends on your turnover and business activities. For most newly incorporated domestic companies, the base tax rate is 25%. However, under section 115BAA, companies can opt for a concessional rate of 22% (plus surcharge and cess). New manufacturing startups can avail a highly competitive rate of 15% under section 115BAB." },
    { q: "Does the company automatically get Startup India benefits?", a: "No. While being a Private Limited Company is a prerequisite, you must separately apply for DPIIT Recognition under the Startup India program to unlock benefits like a 3-year income tax holiday, angel tax exemption, and reduced trademark filing fees." }
  ];

  // Dynamic data from DB
  const faqItems: { q: string; a: string }[] = Array.isArray(service?.faq) && service?.faq.length > 0 ? (service.faq as any[]) : defaultFaqs;
  const benefitItems: { title: string; description: string; icon?: string }[] = Array.isArray(service?.benefits) ? (service.benefits as any[]) : [];
  const processSteps: { step?: number; title?: string; description: string }[] = Array.isArray(service?.process_steps) ? (service.process_steps as any[]) : [];
  const sections = Array.isArray(service?.sections) ? (service.sections as any[]) : [];

  // CTA from DB or defaults
  const ctaTitle = service?.cta_title || `Ready to Build Your Company with Complete Legal Confidence?`;
  const ctaDesc = service?.cta_description || 'Join over 5,000 founders who trust Vakeel for their enterprise legal needs. Get started today and secure your business future with our dedicated CA and CS experts by your side.';
  const ctaButtonText = service?.cta_button_text || 'Start Company Registration';
  const ctaButtonUrl = service?.cta_button_url || '/contact';

  // Icon map for dynamic benefits
  const ICON_MAP: Record<string, React.ElementType> = { Zap, Users, Clock, ShieldCheck, Star, TrendingUp, Building2, CheckCircle2, Shield, Coins, Infinity, Award, Briefcase, Scale, Users2, ArrowRightLeft, FileText, CreditCard, Home, Camera, Mail, MapPin, FileSignature, Check, Landmark, BadgeCheck, Receipt, ClipboardCheck, Clock3, Lock, Headset };

  // Default benefits when DB is empty
  const defaultBenefits = [
    { icon: Shield, title: "Limited Liability Protection", desc: "A Private Limited Company creates a separate legal identity completely distinct from its shareholders and directors. This crucial feature protects your personal assets (like your house, car, and personal savings) from business liabilities, lawsuits, or financial losses. Whether your company signs large commercial contracts, borrows significant funds, or faces unexpected legal disputes, shareholders enjoy absolute protection under the Companies Act 2013, ensuring that financial risks remain strictly limited to the capital they invested in the company." },
    { icon: Landmark, title: "Easy Fundraising & Investor Trust", desc: "Startups and high-growth businesses overwhelmingly prefer the Private Limited structure because it is the only entity type that venture capitalists (VCs), angel investors, and institutional funds prefer to invest in. Raising equity capital is seamless since you can easily issue shares to investors at a premium. Furthermore, strict regulatory compliance and mandatory audits under the MCA make your business highly credible, enabling much easier access to substantial bank loans and financial institutions compared to sole proprietorships or partnerships." },
    { icon: BadgeCheck, title: "Better Brand Trust & Credibility", desc: "Operating as a registered Private Limited Company instantly elevates your brand's reputation in the market. When clients, suppliers, or government bodies see the 'Pvt Ltd' suffix, it signals professionalism, stability, and corporate governance. This legal recognition makes it significantly easier to secure large B2B contracts, qualify for lucrative government tenders, negotiate better terms with suppliers, and attract high-profile clients who mandate dealing exclusively with incorporated entities." },
    { icon: Infinity, title: "Perpetual Succession & Continuity", desc: "A Private Limited Company enjoys perpetual succession, meaning it has an independent, continuous existence irrespective of any changes in its ownership or management. The company will continue to exist and operate even in the event of the death, retirement, insolvency, or departure of any of its directors or shareholders. This ensures absolute long-term stability and business continuity, allowing you to build a legacy organization that can survive for generations without legal interruption." },
    { icon: TrendingUp, title: "Startup India Eligibility", desc: "Incorporating as a Private Limited Company makes your business eligible for the highly beneficial Startup India program (DPIIT Recognition) introduced by the Government of India. This recognition unlocks massive benefits, including 100% income tax exemptions for 3 consecutive years, significant rebates on trademark and patent filing fees, easier public procurement norms without prior experience requirements, and access to a ₹10,000 crore Fund of Funds." },
    { icon: Receipt, title: "Tax Planning & Corporate Benefits", desc: "Private Limited Companies enjoy some of the most competitive corporate tax rates in India, especially for newly incorporated manufacturing startups. Beyond the base tax rate, directors can optimize their personal tax liabilities by taking a combination of salary, sitting fees, and dividends. The structure also allows you to account for legitimate business expenses, depreciation on corporate assets, and employee benefits, providing excellent avenues for legal tax planning and wealth maximization." },
    { icon: Award, title: "Employee Stock Options (ESOPs)", desc: "In today's competitive job market, cash salaries aren't always enough to attract the best talent. A Private Limited Company allows you to issue Employee Stock Ownership Plans (ESOPs). This powerful tool lets you attract, retain, and reward top-tier talent by allowing your employees to share directly in the wealth creation and equity growth of the company, aligning their long-term interests with the success of your startup." },
    { icon: Lock, title: "Data Security & Compliance", desc: "As a registered corporate entity, your business operations naturally align with modern data security and compliance standards. This makes it far easier to obtain international certifications (like ISO 27001) and comply with the Digital Personal Data Protection Act. Enterprise clients will implicitly trust your organization with their data because they know you operate within a strictly regulated, transparent, and legally accountable corporate framework." }
  ];

  // Default features when DB is empty
  const defaultFeatures = [
    { icon: Briefcase, title: "Separate Legal Entity", desc: "Under the Companies Act, a Private Limited Company is a distinct juristic person. It can buy property, incur debt, sue, or be sued in its own name, completely independent of its founders." },
    { icon: Scale, title: "Strict Compliance Framework", desc: "Mandatory statutory audits and annual ROC filings create a highly transparent framework that deters fraud and mismanagement, fostering immense trust among external stakeholders." },
    { icon: Users2, title: "Minimum & Maximum Members", desc: "Requires a minimum of 2 directors and 2 shareholders to incorporate. It can smoothly scale up to accommodate a maximum of 200 shareholders, perfect for growing teams and raising multiple funding rounds." },
    { icon: ArrowRightLeft, title: "Transferability of Shares", desc: "Ownership can be smoothly and legally transferred to new investors, co-founders, or key employees via a straightforward share transfer process executed through the company's board." },
    { icon: Landmark, title: "Foreign Direct Investment (FDI)", desc: "Highly attractive for foreign holding companies and Non-Resident Indians (NRIs), as 100% Foreign Direct Investment (FDI) is permitted under the automatic route for most business sectors in India." },
    { icon: ShieldCheck, title: "Statutory Legal Protection", desc: "The foundational Memorandum of Association (MOA) and Articles of Association (AOA) provide a crystal-clear, legally binding constitutional framework for resolving internal disputes and defining corporate objectives." }
  ];

  // Default documents when DB is empty
  const defaultDocuments = [
    { icon: CreditCard, text: "PAN Card of Directors (Mandatory Identity Proof)" },
    { icon: FileText, text: "Aadhaar Card, Voter ID, or Passport (Address Proof)" },
    { icon: Home, text: "Recent Utility Bill or Bank Statement (Residential Proof)" },
    { icon: Camera, text: "Recent Passport Size Photographs of all Directors" },
    { icon: Mail, text: "Active Email ID and Mobile Number for OTP Verification" },
    { icon: MapPin, text: "Proof of Proposed Registered Office Address (Electricity/Water Bill)" },
    { icon: FileSignature, text: "NOC from Property Owner (if the office premises are rented)" }
  ];

  // Default process steps when DB is empty
  const defaultSteps = [
    { title: "Name Reservation (RUN & Trademark Check)", description: "The process begins by applying for your desired company name through the Reserve Unique Name (RUN) service. Our legal experts conduct a thorough trademark search and MCA database check to ensure your chosen name is unique, compliant with all naming guidelines, and entirely free from existing intellectual property conflicts." },
    { title: "Digital Signature Certificate (DSC)", description: "Every proposed director must obtain a Class 3 Digital Signature Certificate. Since the entire incorporation process in India is now 100% online and paperless, the DSC acts as a secure, legally recognized digital signature used to sign, encrypt, and authenticate all e-forms filed with the Ministry of Corporate Affairs." },
    { title: "Document Preparation (MOA & AOA)", description: "Our elite legal team expertly drafts the Memorandum of Association (MOA), detailing your company's core objectives, and the Articles of Association (AOA), defining the internal rules of management. We ensure these foundational constitutional documents are customized to accommodate your specific future business goals and investor requirements." },
    { title: "SPICe+ Form Submission", description: "We compile all KYC documents, NOCs, and director declarations into the comprehensive SPICe+ (Simplified Proforma for Incorporating Company Electronically) web form. This integrated application seamlessly applies for incorporation, DIN allocation, PAN, TAN, ESIC, EPFO, and Professional Tax registration simultaneously." },
    { title: "Certificate of Incorporation (COI)", description: "Upon successful verification and approval by the Registrar of Companies (ROC), you will be officially issued the digital Certificate of Incorporation (COI). This document serves as the conclusive, undeniable proof of your company's legal existence, complete with your unique Corporate Identification Number (CIN)." },
    { title: "Bank Account & Compliance Kickoff", description: "With the COI and Company PAN in hand, we assist you in instantly opening your corporate current bank account. We also guide you through the critical immediate post-incorporation compliances, such as depositing the initial share capital and filing the mandatory Commencement of Business (Form INC-20A) to begin operations." }
  ];


  // If the service has a `sections` JSONB, use the SectionRenderer (Phase 6 builder)
  if (sections.length > 0) {
    return (
      <main className="min-h-screen bg-ivory pb-20 selection:bg-sage/30 selection:text-sage">
        <ServiceSchema name={formattedTitle} description={stripHtmlTags(shortDescription)} url={`${BASE_URL}/services/${slug}`} />
        <BreadcrumbSchema items={[
          { name: 'Home', href: '/' },
          { name: 'Services', href: '/services' },
          { name: formattedTitle, href: `/services/${slug}` },
        ]} />
        {faqItems.length > 0 && <FAQSchema items={faqItems} />}
        <SectionRenderer sections={sections} pageTitle={formattedTitle} />
      </main>
    );
  }

  // Default layout (backward compatible — existing UI untouched)
  return (
    <main className="min-h-screen bg-ivory pb-20 selection:bg-sage/30 selection:text-sage">
      <ServiceSchema name={formattedTitle} description={stripHtmlTags(shortDescription)} url={`${BASE_URL}/services/${slug}`} />
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: formattedTitle, href: `/services/${slug}` },
      ]} />
      {faqItems.length > 0 && <FAQSchema items={faqItems} />}

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-charcoal text-white rounded-b-[3rem] noise-overlay shadow-2xl">
        {/* Advanced Glow Background */}
        <div className="absolute inset-0 z-0 opacity-80">
          <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gradient-to-tr from-sage/15 to-emerald-800/10 rounded-full blur-[150px] pointer-events-none animate-pulse-glow mix-blend-screen" />
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-amber/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:64px_64px] pointer-events-none" />
        </div>

        <div className="container relative z-10 mx-auto px-4 max-w-[1440px]">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6 text-xs font-bold uppercase tracking-widest text-white shadow-premium backdrop-blur-2xl">
              <Star className="w-3.5 h-3.5 text-amber" /> Premium Service
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-[84px] font-display font-bold mb-6 leading-[1.05] tracking-tight drop-shadow-sm">
              {formattedTitle} <span className="text-sage italic pr-2 relative block mt-2">
                Automated.
              </span>
            </h1>
            <div
              className="prose prose-lg lg:prose-xl prose-invert prose-p:text-white/70 prose-a:text-sage hover:prose-a:text-white prose-a:transition-colors max-w-2xl mb-10 leading-relaxed text-balance font-medium"
              dangerouslySetInnerHTML={{ __html: shortDescription }}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={ctaButtonUrl}>
                <Button size="lg" className="bg-white text-charcoal hover:bg-sage hover:text-white shadow-premium-hover transition-all transition-spring rounded-xl h-14 lg:h-16 px-8 lg:px-10 text-base lg:text-lg group font-bold">
                  {ctaButtonText} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 lg:h-16 px-8 lg:px-10 text-base lg:text-lg glass-dark rounded-xl font-bold">
                Talk to an Expert
              </Button>
            </div>

            <div className="mt-14 flex flex-wrap items-center gap-6 lg:gap-8 text-white/50 text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sage" /> No hidden fees</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber" /> Fast turnaround</div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure process</div>
            </div>
          </div>

          {/* Floating Trust Indicator */}
          <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden xl:flex flex-col gap-4 animate-float">
            <div className="glass-premium bg-white/5 text-white rounded-[2rem] p-6 border border-white/10 shadow-premium w-72 backdrop-blur-3xl ring-1 ring-white/5">
              <div className="flex items-center gap-4 mb-4 border-b border-white/10 pb-4">
                <div className="w-12 h-12 rounded-[14px] bg-sage/20 border border-sage/30 flex items-center justify-center text-sage shadow-inner">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">Success Rate</div>
                  <div className="text-2xl font-bold">99.8%</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[14px] bg-amber/20 border border-amber/30 flex items-center justify-center text-amber shadow-inner">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">Businesses</div>
                  <div className="text-2xl font-bold">50k+ Trust Us</div>
                </div>
              </div>
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
                <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 tracking-tight text-charcoal">Why Choose Vakeel for {formattedTitle}?</h2>
                <p className="text-lg lg:text-xl text-charcoal/65 leading-relaxed text-balance font-medium">
                  {service?.hero_description || `Navigating the complexities of ${formattedTitle} can be challenging without the right expertise. At Vakeel, our AI-powered platform paired with top-tier legal professionals ensures a seamless, transparent, and swift experience. We handle the paperwork so you can focus on building your business.`}
                </p>
              </div>

              {/* Dynamic Benefits or Default */}
              <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
                {(benefitItems.length > 0 ? benefitItems : defaultBenefits.map(b => ({ title: b.title, description: b.desc, icon: b.icon }))).map((item, idx) => {
                  const IconComponent = typeof item.icon === 'string' ? (ICON_MAP[item.icon] || Zap) : (item as any).icon || Zap;
                  return (
                    <div
                      key={idx}
                      className="bg-white p-8 lg:p-10 rounded-[2rem] border border-charcoal/5 shadow-sm group hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 fill-mode-both relative overflow-hidden"
                      style={{ animationDelay: `${400 + idx * 100}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-sage/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="w-14 h-14 rounded-2xl bg-sage/10 border border-sage/20 flex items-center justify-center mb-6 text-sage group-hover:scale-110 group-hover:bg-sage group-hover:text-white transition-all duration-500 transition-spring shadow-inner relative z-10">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <h3 className="font-bold text-charcoal text-xl lg:text-2xl mb-3 relative z-10">{item.title}</h3>
                      <p className="text-charcoal/60 leading-relaxed text-base relative z-10 font-medium">{item.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Key Features (Added as per reference image, reusing UI structure) */}
              <div className="pt-10">
                <h2 className="text-4xl lg:text-5xl font-display font-bold mb-10 tracking-tight text-charcoal">Key Features</h2>
                <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
                  {defaultFeatures.map((item, idx) => {
                    const IconComponent = item.icon || Zap;
                    return (
                      <div
                        key={idx}
                        className="bg-white p-8 lg:p-10 rounded-[2rem] border border-charcoal/5 shadow-sm group hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 fill-mode-both relative overflow-hidden"
                        style={{ animationDelay: `${400 + idx * 100}ms` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-sage/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="w-14 h-14 rounded-2xl bg-sage/10 border border-sage/20 flex items-center justify-center mb-6 text-sage group-hover:scale-110 group-hover:bg-sage group-hover:text-white transition-all duration-500 transition-spring shadow-inner relative z-10">
                          <IconComponent className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-charcoal text-xl lg:text-2xl mb-3 relative z-10">{item.title}</h3>
                        <p className="text-charcoal/60 leading-relaxed text-base relative z-10 font-medium">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Process Steps or Default */}
              <div>
                <h2 className="text-4xl lg:text-5xl font-display font-bold mb-10 tracking-tight text-charcoal">The Process</h2>
                <div className="space-y-6 lg:space-y-8 relative before:absolute before:inset-0 before:ml-[34px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-sage before:via-emerald-400 before:to-sage before:shadow-[0_0_15px_rgba(74,124,89,0.5)]">
                  {(processSteps.length > 0 ? processSteps : defaultSteps).map((step, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active animate-in fade-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: `${800 + idx * 150}ms` }}>
                      <div className="flex items-center justify-center w-16 h-16 rounded-[1.25rem] border border-white/50 bg-charcoal text-white font-display font-bold text-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-premium z-10 group-hover:bg-sage group-hover:scale-110 transition-all duration-500 transition-spring">
                        {('step' in step && typeof step.step === 'number' ? step.step : idx + 1)}
                      </div>
                      <div className="w-[calc(100%-5rem)] md:w-[calc(50%-4rem)] bg-white p-6 lg:p-8 rounded-[1.75rem] border border-charcoal/5 shadow-sm group-hover:shadow-premium-hover transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-sage/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {'title' in step && step.title && (
                          <h3 className="font-bold text-charcoal text-xl mb-2 relative z-10">
                            {step.title}
                          </h3>
                        )}
                        <p className="font-bold text-charcoal/80 text-lg lg:text-xl relative z-10 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents Required */}
              <div className="pt-10">
                <h2 className="text-4xl lg:text-5xl font-display font-bold mb-10 tracking-tight text-charcoal">Documents Required</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {defaultDocuments.map((item, idx) => {
                    const IconComponent = item.icon || FileText;
                    return (
                      <div key={idx} className="bg-white p-6 rounded-2xl border border-charcoal/5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-sage/10 text-sage flex items-center justify-center shrink-0">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-charcoal/80 text-base">{item.text}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* FAQ Section (from DB) */}
              {faqItems.length > 0 && (
                <div>
                  <h2 className="text-4xl lg:text-5xl font-display font-bold mb-10 tracking-tight text-charcoal">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {faqItems.map((item, idx) => (
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
              )}

            </div>

            {/* Right Sticky Sidebar (Tier-1 Lead Form) */}
            <div className="w-full lg:w-2/5 xl:w-1/3">
              <div className="bg-white rounded-[2rem] p-8 lg:p-10 border border-charcoal/5 shadow-premium sticky top-32 animate-in fade-in slide-in-from-right-12 duration-1000 delay-500 fill-mode-both relative overflow-hidden group/sidebar">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-transparent to-sage/5 rounded-bl-[4rem] pointer-events-none group-hover/sidebar:to-sage/10 transition-colors duration-1000" />
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sage to-emerald-500" />

                <h3 className="text-3xl font-display font-bold mb-2 text-charcoal mt-2">Need Expert Help?</h3>
                <p className="text-charcoal/55 mb-8 font-medium">Leave your details and a dedicated manager will call you back within 5 minutes.</p>

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
                  <div className="relative group">
                    <input type="email" id="email" className="peer w-full bg-ivory border border-charcoal/[0.08] rounded-xl h-14 px-4 pt-4 outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage/50 focus:bg-white transition-all text-charcoal font-semibold hover:border-charcoal/[0.15]" placeholder=" " />
                    <label htmlFor="email" className="absolute text-xs font-bold uppercase tracking-wider text-charcoal/40 left-4 top-4 transition-all peer-focus:-translate-y-2 peer-focus:text-[10px] peer-focus:text-sage peer-[:not(:placeholder-shown)]:-translate-y-2 peer-[:not(:placeholder-shown)]:text-[10px]">
                      Email Address
                    </label>
                  </div>
                  <Button className="w-full bg-charcoal hover:bg-sage text-white h-14 shadow-premium-hover mt-6 text-base rounded-xl transition-all duration-300 font-bold group/btn">
                    Request Call Back <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all transition-spring" />
                  </Button>
                </form>

                <div className="mt-8 pt-8 border-t border-charcoal/5 text-center relative">
                  <p className="text-[10px] font-bold text-charcoal/40 mb-2 uppercase tracking-widest">Or connect instantly</p>
                  <a href="tel:+919876543210" className="text-2xl font-display font-bold text-charcoal hover:text-sage transition-colors block">+91 98765 43210</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-32 bg-charcoal text-white text-center relative overflow-hidden mt-20 rounded-t-[3rem] noise-overlay">
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:48px_48px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sage/[0.08] rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber/[0.05] rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

        <div className="container relative z-10 mx-auto px-4 max-w-4xl">
          <h2 className="text-5xl lg:text-6xl xl:text-7xl font-display font-bold mb-8 tracking-tight drop-shadow-sm">{ctaTitle}</h2>
          <p className="text-xl lg:text-2xl text-white/60 mx-auto mb-12 leading-relaxed text-balance font-medium">{ctaDesc}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={ctaButtonUrl}>
              <Button size="lg" className="bg-white text-charcoal hover:bg-sage hover:text-white shadow-premium-hover h-16 px-10 text-lg group rounded-xl font-bold transition-all transition-spring">
                {ctaButtonText} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
