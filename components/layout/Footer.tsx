import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Twitter, Linkedin, Instagram, Facebook, Mail, Phone, MapPin, ShieldCheck, Zap, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory pt-24 pb-12 border-t border-white/5 relative overflow-hidden noise-overlay">
      {/* Background glow for premium feel */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sage/5 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber/5 rounded-full blur-[100px] pointer-events-none animate-float-slow" />
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:48px_48px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-[1440px]">
        
        {/* Top Floating AI CTA */}
        <div className="mb-20 -mt-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-sage/10 via-emerald-800/10 to-amber/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sage to-emerald-400 opacity-50" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div>
               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 mb-4 text-xs font-bold uppercase tracking-widest text-emerald-400">
                 <Sparkles className="w-3.5 h-3.5" /> Vakeel AI 2.0
               </div>
               <h3 className="text-3xl font-display font-bold text-white mb-2">Ready to automate your compliance?</h3>
               <p className="text-white/60 text-lg">Join thousands of founders running their companies on autopilot.</p>
            </div>
            <div className="shrink-0">
               <Link href="/ai">
                 <Button className="bg-white text-charcoal hover:bg-sage hover:text-white h-14 px-8 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-glow transition-all duration-300 font-bold text-base group/btn">
                   Try AI Assistant Free <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                 </Button>
               </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-5 pr-0 xl:pr-12">
            <Link href="/" className="inline-flex items-center gap-3 group mb-8">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-sage to-emerald-700 flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg group-hover:scale-105 transition-spring duration-500 shadow-sage/30 border border-white/20">
                V
              </div>
              <span className="font-display font-bold text-3xl tracking-tight text-white">{siteConfig.companyName}</span>
            </Link>
            
            <p className="text-white/60 mb-10 max-w-sm text-balance text-lg leading-relaxed">
              {siteConfig.description}
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
              <div className="flex items-center gap-4 text-white/60 group">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-sage/20 group-hover:text-sage group-hover:border-sage/30 transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <a href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">{siteConfig.phone}</a>
              </div>
              <div className="flex items-center gap-4 text-white/60 group">
                <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-sage/20 group-hover:text-sage group-hover:border-sage/30 transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white transition-colors">{siteConfig.email}</a>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
            <div>
              <h4 className="font-display font-bold mb-6 text-white text-lg">Services</h4>
              <ul className="space-y-4">
                {siteConfig.footerLinks.services.map(link => (
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
            
            <div>
              <h4 className="font-display font-bold mb-6 text-white text-lg">Company</h4>
              <ul className="space-y-4">
                {siteConfig.footerLinks.company.map(link => (
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
            
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-display font-bold mb-6 text-white text-lg">Legal</h4>
              <ul className="space-y-4">
                {siteConfig.footerLinks.legal.map(link => (
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
          </div>
        </div>

        {/* Certifications & Trust Badges */}
        <div className="pt-8 pb-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
           {['ISO 27001 Certified', 'Startup India Recognized', 'DPIIT Approved', 'SSL Secured'].map((badge, i) => (
             <div key={i} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                <ShieldCheck className="w-4 h-4 text-sage" /> {badge}
             </div>
           ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <span>&copy; {new Date().getFullYear()} {siteConfig.companyName}. Built for scale.</span>
          </div>
          
          <div className="flex items-center flex-wrap gap-4 justify-center">
            {siteConfig.socialLinks.twitter && (
              <a href={siteConfig.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-sage hover:text-white hover:border-sage hover:shadow-glow transition-all transition-spring hover:-translate-y-1">
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {siteConfig.socialLinks.linkedin && (
              <a href={siteConfig.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-sage hover:text-white hover:border-sage hover:shadow-glow transition-all transition-spring hover:-translate-y-1">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {siteConfig.socialLinks.instagram && (
              <a href={siteConfig.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-sage hover:text-white hover:border-sage hover:shadow-glow transition-all transition-spring hover:-translate-y-1">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {siteConfig.socialLinks.facebook && (
              <a href={siteConfig.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-sage hover:text-white hover:border-sage hover:shadow-glow transition-all transition-spring hover:-translate-y-1">
                <Facebook className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
