import Link from 'next/link';
import { Twitter, Linkedin, Instagram, Facebook, Mail, Phone, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

interface FooterLink {
  id: string;
  title: string;
  url: string;
  visible?: boolean | null;
  open_new_tab?: boolean | null;
}

interface FooterSection {
  id: string;
  title: string;
  order?: number | null;
  visible?: boolean | null;
  footer_links?: FooterLink[];
}

interface SiteSettings {
  company_name?: string | null;
  phone?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  social_links?: any;
  footer_tagline?: string | null;
  footer_cta_title?: string | null;
  footer_cta_description?: string | null;
  footer_cta_button_text?: string | null;
  footer_cta_button_url?: string | null;
  footer_badges?: any;
  copyright_text?: string | null;
}

interface FooterData {
  sections: FooterSection[];
  settings: SiteSettings | null;
}



interface FooterProps {
  footerData?: FooterData;
}

export default function Footer({ footerData }: FooterProps) {
  // Pure DB
  const settings = footerData?.settings;
  const dbSections = footerData?.sections || [];

  const phone = settings?.phone;
  const email = settings?.email;
  const companyName = settings?.company_name || 'Vakeel';
  const description = settings?.footer_tagline;
  const ctaTitle = settings?.footer_cta_title || 'Ready to automate your compliance?';
  const ctaDesc = settings?.footer_cta_description || 'Join thousands of founders running their companies on autopilot.';
  const ctaButtonText = settings?.footer_cta_button_text || 'Get Started Free';
  const ctaButtonUrl = settings?.footer_cta_button_url || '/contact';
  const copyright = settings?.copyright_text || `© ${new Date().getFullYear()} ${companyName}. Built for scale.`;

  // Social links from DB
  const socialLinks = settings?.social_links
    ? (typeof settings.social_links === 'string' ? JSON.parse(settings.social_links) : settings.social_links)
    : null;

  // Badges from DB
  const badges: string[] = settings?.footer_badges
    ? (Array.isArray(settings.footer_badges) ? settings.footer_badges : JSON.parse(String(settings.footer_badges)))
    : [];

  // Footer columns — Pure DB
  const footerColumns: { title: string; links: { title: string; href: string }[] }[] =
    dbSections.length > 0
      ? dbSections
          .filter((s) => s.visible !== false)
          .map((section) => ({
            title: section.title,
            links: (section.footer_links || [])
              .filter((l) => l.visible !== false)
              .map((l) => ({ title: l.title, href: l.url })),
          }))
      : [];

  return (
    <footer className="bg-charcoal text-ivory pt-24 pb-12 border-t border-white/5 relative overflow-hidden noise-overlay">
      {/* Background glow for premium feel */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sage/5 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber/5 rounded-full blur-[100px] pointer-events-none animate-float-slow" />
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:48px_48px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-[1440px]">

        {/* Top Floating CTA */}
        <div className="mb-20 -mt-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-sage/10 via-emerald-800/10 to-amber/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sage to-emerald-400 opacity-50" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 mb-4 text-xs font-bold uppercase tracking-widest text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" /> Vakeel AI 2.0
              </div>
              <h3 className="text-3xl font-display font-bold text-white mb-2">{ctaTitle}</h3>
              <p className="text-white/60 text-lg">{ctaDesc}</p>
            </div>
            <div className="shrink-0">
              <Link href={ctaButtonUrl}>
                <Button className="bg-white text-charcoal hover:bg-sage hover:text-white h-14 px-8 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-glow transition-all duration-300 font-bold text-base group/btn">
                  {ctaButtonText} <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          {/* Brand & Contact */}
          <div className="lg:col-span-5 pr-0 xl:pr-12">
            <Link href="/" className="inline-flex items-center gap-3 group mb-8">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-sage to-emerald-700 flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg group-hover:scale-105 transition-spring duration-500 shadow-sage/30 border border-white/20">
                V
              </div>
              <span className="font-display font-bold text-3xl tracking-tight text-white">{companyName}</span>
            </Link>

            <p className="text-white/60 mb-10 max-w-sm text-balance text-lg leading-relaxed">
              {description}
            </p>

            {/* Newsletter */}
            <div className="mb-10">
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Subscribe to Legal Updates</h4>
              <form className="relative group/form">
                <input
                  type="email"
                  placeholder="founder@startup.com"
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-4 pr-32 text-white placeholder:text-white/30 outline-none focus:border-sage/50 focus:bg-white/10 transition-all font-medium"
                />
                <Button className="absolute right-1.5 top-1.5 bottom-1.5 h-11 bg-sage hover:bg-emerald-600 text-white rounded-lg px-6 font-semibold shadow-md transition-colors">
                  Subscribe
                </Button>
              </form>
            </div>

            <div className="space-y-4">
              {phone && (
                <div className="flex items-center gap-4 text-white/60 group">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-sage/20 group-hover:text-sage group-hover:border-sage/30 transition-all">
                    <Phone className="w-4 h-4" />
                  </div>
                  <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">{phone}</a>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-4 text-white/60 group">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-sage/20 group-hover:text-sage group-hover:border-sage/30 transition-all">
                    <Mail className="w-4 h-4" />
                  </div>
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Footer Columns */}
          <div className={`lg:col-span-7 grid grid-cols-2 ${footerColumns.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-x-8 gap-y-12`}>
            {footerColumns.map((col, idx) => (
              <div key={idx} className={footerColumns.length >= 3 && idx === footerColumns.length - 1 ? 'col-span-2 md:col-span-1' : ''}>
                <h4 className="font-display font-bold mb-6 text-white text-lg">{col.title}</h4>
                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link.title}>
                      <Link href={link.href} className="text-white/50 hover:text-white transition-colors text-[15px] inline-flex items-center group">
                        <span className="relative">
                          {link.title}
                          <span className="absolute -bottom-1 left-0 w-0 h-px bg-sage transition-all group-hover:w-full"></span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Trust Badges */}
        <div className="pt-8 pb-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {badges.map((badge: string, i: number) => (
            <div key={i} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
              <ShieldCheck className="w-4 h-4 text-sage" /> {badge}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <span>{copyright}</span>
          </div>

          <div className="flex items-center flex-wrap gap-4 justify-center">
            {socialLinks?.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-sage hover:text-white hover:border-sage hover:shadow-glow transition-all transition-spring hover:-translate-y-1">
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {socialLinks?.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-sage hover:text-white hover:border-sage hover:shadow-glow transition-all transition-spring hover:-translate-y-1">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {socialLinks?.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-sage hover:text-white hover:border-sage hover:shadow-glow transition-all transition-spring hover:-translate-y-1">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {socialLinks?.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-sage hover:text-white hover:border-sage hover:shadow-glow transition-all transition-spring hover:-translate-y-1">
                <Facebook className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
