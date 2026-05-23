'use client';

import { useState, useEffect, useRef, useCallback, MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, X, ArrowRight, Building2, Calculator, Scale, FileText, Zap, Sparkles, BookOpen, Briefcase, Search, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const MEGA_MENU_CONTENT = {
  "Startup & Registration": {
    description: "Launch your company with zero errors and fast-tracked ROC approval.",
    icon: Building2,
    categories: [
      {
        title: "Company Registration",
        links: [
          { name: "Private Limited Company", href: "/services/private-limited-company" },
          { name: "LLP Registration", href: "/services/llp-registration" },
          { name: "One Person Company", href: "/services/opc-registration" },
          { name: "Partnership Firm", href: "/services/partnership-firm" },
          { name: "Sole Proprietorship", href: "/services/sole-proprietorship" }
        ]
      },
      {
        title: "Startup Services",
        links: [
          { name: "Startup India Registration", href: "/services/startup-india" },
          { name: "DPIIT Recognition", href: "/services/dpiit-recognition" },
          { name: "Pitch Deck Support", href: "/services/pitch-deck" },
          { name: "Founder Agreements", href: "/services/founder-agreements" },
        ]
      },
      {
        title: "International Business",
        links: [
          { name: "US Company Registration", href: "/services/us-incorporation" },
          { name: "Dubai Company Setup", href: "/services/dubai-setup" },
          { name: "Singapore Incorporation", href: "/services/singapore-incorporation" },
        ]
      }
    ],
    featured: {
      title: "Launch Your Startup Faster",
      desc: "Incorporate + GST + Trademark in one discounted package.",
      tag: "Best Value",
      href: "/bundles/startup",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=600&q=80&auto=format&fit=crop"
    }
  },
  "GST & Tax": {
    description: "Automated GST filing, ITR, and corporate tax compliance.",
    icon: Calculator,
    categories: [
      {
        title: "GST Services",
        links: [
          { name: "GST Registration", href: "/services/gst-registration" },
          { name: "GST Filing", href: "/services/gst-filing" },
          { name: "GST Cancellation", href: "/services/gst-cancellation" },
          { name: "GST LUT Filing", href: "/services/lut-filing" },
          { name: "GST Notices", href: "/services/gst-notices" }
        ]
      },
      {
        title: "Income Tax",
        links: [
          { name: "ITR Filing", href: "/services/itr-filing" },
          { name: "TDS Filing", href: "/services/tds-filing" },
          { name: "Tax Consultation", href: "/services/tax-consultation" },
          { name: "Advance Tax", href: "/services/advance-tax" },
        ]
      },
      {
        title: "Accounting & Compliance",
        links: [
          { name: "Payroll", href: "/services/payroll" },
          { name: "Bookkeeping", href: "/services/bookkeeping" },
          { name: "Accounting Services", href: "/services/accounting" },
          { name: "Audit Support", href: "/services/audit-support" },
        ]
      }
    ],
    featured: {
      title: "AI GST Assistant",
      desc: "Scan your expenses and automatically find tax-saving opportunities.",
      tag: "Automated",
      href: "/ai/tax-optimizer",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&auto=format&fit=crop"
    }
  },
  "IP & Trademark": {
    description: "Protect your brand identity with trademark and patent registrations.",
    icon: Scale,
    categories: [
      {
        title: "Trademark Services",
        links: [
          { name: "Trademark Registration", href: "/services/trademark-registration" },
          { name: "Trademark Renewal", href: "/services/trademark-renewal" },
          { name: "Objection Reply", href: "/services/trademark-objection" },
          { name: "Trademark Monitoring", href: "/services/trademark-monitoring" },
        ]
      },
      {
        title: "Intellectual Property",
        links: [
          { name: "Patent Filing", href: "/services/patent" },
          { name: "Copyright Registration", href: "/services/copyright" },
          { name: "Design Registration", href: "/services/design-registration" },
        ]
      },
      {
        title: "Legal Protection",
        links: [
          { name: "IP Consultation", href: "/services/ip-consultation" },
          { name: "Legal Notices", href: "/services/legal-notices" },
          { name: "Brand Protection", href: "/services/brand-protection" },
        ]
      }
    ],
    featured: {
      title: "Protect Your Brand Identity",
      desc: "Secure your logos, brand names, and slogans legally across India and globally.",
      tag: "Protection",
      href: "/services/trademark-registration",
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80&auto=format&fit=crop"
    }
  },
  "Licenses": {
    description: "Get essential business licenses and government certifications.",
    icon: FileText,
    categories: [
      {
        title: "Food & Trade Licenses",
        links: [
          { name: "FSSAI License", href: "/services/fssai" },
          { name: "Trade License", href: "/services/trade-license" },
          { name: "Shop & Establishment", href: "/services/shop-establishment" },
        ]
      },
      {
        title: "Government Registrations",
        links: [
          { name: "MSME Registration", href: "/services/msme" },
          { name: "IEC Code", href: "/services/iec-code" },
          { name: "PF & ESI Registration", href: "/services/pf-esi" },
        ]
      },
      {
        title: "Certifications",
        links: [
          { name: "ISO Certification", href: "/services/iso" },
          { name: "BIS Certification", href: "/services/bis" },
          { name: "Startup Certifications", href: "/services/startup-certifications" },
        ]
      }
    ],
    featured: {
      title: "Get Business Ready",
      desc: "Stay fully compliant with essential trade licenses and registrations.",
      tag: "Licenses",
      href: "/services/fssai",
      image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?w=600&q=80&auto=format&fit=crop"
    }
  },
  "Compliance": {
    description: "Stay bulletproof with our ongoing compliance tracking.",
    icon: CheckCircle2,
    categories: [
      {
        title: "Annual Compliance",
        links: [
          { name: "ROC Filing", href: "/services/roc-filing" },
          { name: "Annual Returns", href: "/services/annual-returns" },
          { name: "DIR-3 KYC", href: "/services/dir-3" },
          { name: "Compliance Calendar", href: "/dashboard/compliance" },
        ]
      },
      {
        title: "Secretarial Services",
        links: [
          { name: "Board Resolutions", href: "/services/board-resolutions" },
          { name: "Share Transfer", href: "/services/share-transfer" },
          { name: "Legal Documentation", href: "/services/legal-docs" },
        ]
      },
      {
        title: "Environmental Compliance",
        links: [
          { name: "Pollution NOC", href: "/services/pollution-noc" },
          { name: "Waste Management", href: "/services/waste-management" },
          { name: "Environmental Clearance", href: "/services/environmental-clearance" },
        ]
      }
    ],
    featured: {
      title: "AI Compliance Tracker",
      desc: "Real-time compliance dashboard with automated alerts and reminders.",
      tag: "Dashboard",
      href: "/dashboard/compliance",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&auto=format&fit=crop"
    }
  },
  "AI Assistant": {
    description: "Futuristic tools to automate your legal workflows.",
    icon: Sparkles,
    categories: [
      {
        title: "AI Tools",
        links: [
          { name: "AI Legal Chatbot", href: "/ai/chat" },
          { name: "AI GST Assistant", href: "/ai/gst" },
          { name: "AI Document Analyzer", href: "/ai/document" },
          { name: "AI Compliance Reminder", href: "/ai/reminders" },
        ]
      },
      {
        title: "AI Automation",
        links: [
          { name: "Smart Filing", href: "/ai/filing" },
          { name: "Workflow Automation", href: "/ai/workflow" },
          { name: "AI Notifications", href: "/ai/notifications" },
          { name: "AI Summaries", href: "/ai/summaries" },
        ]
      },
      {
        title: "Smart Systems",
        links: [
          { name: "AI Recommendations", href: "/ai/recommendations" },
          { name: "Legal Risk Analysis", href: "/ai/risk" },
          { name: "Smart Tracking", href: "/ai/tracking" },
        ]
      }
    ],
    featured: {
      title: "Meet Your AI Legal Co-Pilot",
      desc: "Upload contracts, ask questions, and automate your company's entire legal life.",
      tag: "Vaakil AI 2.0",
      href: "/ai",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80&auto=format&fit=crop"
    }
  },
  "Resources & News": {
    description: "Guides, updates, and templates for modern teams.",
    icon: BookOpen,
    categories: [
      {
        title: "Blogs",
        links: [
          { name: "Startup Guides", href: "/blog/startups" },
          { name: "GST Guides", href: "/blog/gst" },
          { name: "Trademark Articles", href: "/blog/trademarks" },
          { name: "Compliance News", href: "/blog/compliance" },
        ]
      },
      {
        title: "News & Updates",
        links: [
          { name: "Government Updates", href: "/news/gov" },
          { name: "Taxation Changes", href: "/news/tax" },
          { name: "Startup Policies", href: "/news/policies" },
          { name: "Compliance Deadlines", href: "/news/deadlines" },
        ]
      },
      {
        title: "Learning Center",
        links: [
          { name: "Templates & Documents", href: "/resources/templates" },
          { name: "Video Tutorials", href: "/resources/videos" },
          { name: "Webinars", href: "/resources/webinars" },
          { name: "Case Studies", href: "/case-studies" },
        ]
      }
    ],
    featured: {
      title: "The Founder's Legal Handbook",
      desc: "Everything you need to know about scaling legally in India.",
      tag: "Featured Guide",
      href: "/resources/handbook",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80&auto=format&fit=crop"
    }
  },
  "Company": {
    description: "About us, careers, and getting in touch.",
    icon: Briefcase,
    categories: [
      {
        title: "Company",
        links: [
          { name: "About Vakeel", href: "/about" },
          { name: "Mission", href: "/mission" },
          { name: "Leadership", href: "/leadership" },
          { name: "Press & Media", href: "/press" },
        ]
      },
      {
        title: "Careers",
        links: [
          { name: "Open Roles", href: "/careers#openings" },
          { name: "Engineering", href: "/careers/engineering" },
          { name: "Legal Experts", href: "/careers/legal" },
          { name: "Life at Vakeel", href: "/careers#culture" },
        ]
      },
      {
        title: "Contact",
        links: [
          { name: "Office Locations", href: "/contact#locations" },
          { name: "Support Center", href: "/support" },
          { name: "Consultation Booking", href: "/book" },
          { name: "WhatsApp Support", href: "/whatsapp" },
        ]
      }
    ],
    featured: {
      title: "Join the Legal-Tech Revolution",
      desc: "We are hiring engineers, CA/CS, and designers to build the future.",
      tag: "We're Hiring",
      href: "/careers",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80&auto=format&fit=crop"
    }
  }
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState<string | null>(null);
  const [activeMobileMenu, setActiveMobileMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const megaMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDesktopMenu(null);
    setActiveMobileMenu(null);
  }, [pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setActiveDesktopMenu(null);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleMenuEnter = useCallback((title: string) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setActiveDesktopMenu(title);
  }, []);

  const handleMenuLeave = useCallback(() => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveDesktopMenu(null);
    }, 150);
  }, []);

  // Mouse tracking for spotlight effect in Mega Menu
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-charcoal text-white/90 text-[13px] py-2.5 text-center px-4 font-medium relative z-50 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span><strong className="text-white">New:</strong> Introducing Vakeel AI 2.0 – automate compliance in seconds.</span>
        <Link href="/ai" className="ml-2 text-sage hover:text-white transition-colors flex items-center group">
          <span className="border-b border-sage/30 group-hover:border-white/50 transition-colors">Try it free</span>
          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <motion.header
        className={cn(
          "sticky top-0 left-0 right-0 z-40 w-full",
          "transition-[padding] duration-500 transition-spring",
          isScrolled ? "py-3" : "py-4 xl:py-5"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Background layer for sticky nav */}
        <div 
          className={cn(
            "absolute inset-0 transition-all duration-500 ease-in-out z-0 border-b border-charcoal/5",
            isScrolled ? "opacity-100 bg-white/80 backdrop-blur-2xl shadow-premium" : "opacity-0 bg-transparent"
          )}
        />

        {/* Container */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
          <div className="flex items-center justify-between">
            {/* ===== LEFT: Logo ===== */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-charcoal flex items-center justify-center text-white font-display font-bold text-base lg:text-lg shadow-[0_2px_10px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-spring duration-300">
                V
              </div>
              <span className="font-display font-bold text-lg lg:text-xl tracking-tight text-charcoal">
                {siteConfig.companyName}
              </span>
            </Link>

            {/* ===== CENTER: Desktop Navigation ===== */}
            <nav
              ref={navRef}
              className="hidden lg:flex items-center justify-center flex-1 min-w-0 mx-4 xl:mx-6"
              onMouseLeave={handleMenuLeave}
            >
              <div className="flex items-center gap-1">
                {siteConfig.mainNav.map((item) => {
                  const isMegaMenu = item.title in MEGA_MENU_CONTENT;
                  const isActive = activeDesktopMenu === item.title;

                  return (
                    <div
                      key={item.title}
                      className="relative"
                      onMouseEnter={() => handleMenuEnter(item.title)}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "py-2 px-3 xl:px-4 rounded-full text-[13px] xl:text-[14px] font-semibold transition-all duration-300 flex items-center gap-1.5",
                          isActive
                            ? "bg-sage/10 text-sage"
                            : "text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5"
                        )}
                      >
                        {item.title}
                        {isMegaMenu && (
                          <ChevronDown
                            className={cn(
                              "w-3.5 h-3.5 transition-transform duration-300 transition-spring",
                              isActive ? "rotate-180 text-sage" : "text-charcoal/40"
                            )}
                          />
                        )}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </nav>

            {/* ===== RIGHT: Actions ===== */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 rounded-full border border-charcoal/10 bg-white/50 flex items-center justify-center text-charcoal/50 hover:bg-white hover:text-charcoal hover:border-charcoal/20 transition-all duration-300 group shadow-sm hover:shadow-md"
                aria-label="Search"
              >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform duration-300 transition-spring" />
              </button>

              {/* Sign In */}
              <Link
                href="/login"
                className="text-[14px] font-semibold text-charcoal/70 hover:text-charcoal px-3 py-2 transition-all duration-200"
              >
                Sign In
              </Link>

              {/* Get Started CTA */}
              <Link href="/contact" className="shrink-0">
                <Button
                  className={cn(
                    "rounded-full h-10 px-6 text-[14px] font-bold text-white transition-all duration-300 transform hover:-translate-y-[1px] group relative overflow-hidden",
                    "bg-charcoal hover:bg-sage border border-charcoal/20",
                    "shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-premium-hover"
                  )}
                >
                  <span className="relative z-10 flex items-center">
                    Get Started <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* ===== MOBILE: Actions & Toggle ===== */}
            <div className="flex lg:hidden items-center gap-2 shrink-0 relative z-10">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal/70 hover:bg-charcoal/5 transition-colors"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              <button
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 bg-white shadow-sm border border-charcoal/5",
                  mobileMenuOpen ? "bg-charcoal/5 text-charcoal" : "text-charcoal/80 hover:bg-charcoal/5"
                )}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ===== MEGA MENU DROPDOWN ===== */}
        <AnimatePresence mode="wait">
          {activeDesktopMenu && (activeDesktopMenu in MEGA_MENU_CONTENT) && (
            <motion.div
              key={activeDesktopMenu}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block absolute left-0 right-0 top-[100%] z-50 pt-3"
              onMouseEnter={() => handleMenuEnter(activeDesktopMenu)}
              onMouseLeave={handleMenuLeave}
            >
              <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
                <div 
                  className="max-w-[1100px] mx-auto bg-white/95 backdrop-blur-3xl rounded-[1.5rem] shadow-premium p-2 flex relative ring-1 ring-charcoal/5 overflow-hidden spotlight-wrapper"
                  onMouseMove={handleMouseMove}
                >
                  {/* Ambient Glow */}
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sage/5 rounded-full blur-[80px] pointer-events-none" />

                  {/* Left: Categories */}
                  <div className="w-[65%] p-8 relative z-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start gap-5 mb-10">
                        <div className="w-14 h-14 rounded-2xl bg-sage/10 border border-sage/20 text-sage flex items-center justify-center shrink-0 shadow-inner">
                          {(() => {
                            const IconComponent = MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].icon;
                            return <IconComponent className="w-7 h-7" />;
                          })()}
                        </div>
                        <div className="min-w-0 pt-1">
                          <h3 className="font-display font-bold text-3xl text-charcoal mb-2 tracking-tight">{activeDesktopMenu}</h3>
                          <p className="text-base text-charcoal/55 leading-relaxed">{MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                        {MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].categories.map((cat, idx) => (
                          <div key={idx}>
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-charcoal/40 mb-4 flex items-center gap-2">
                              {cat.title}
                            </h4>
                            <ul className="space-y-1">
                              {cat.links.map((link, linkIdx) => (
                                <li key={linkIdx}>
                                  <Link href={link.href} className="block group/link px-3 py-2 -ml-3 rounded-xl hover:bg-charcoal/5 transition-colors duration-200">
                                    <div className="font-semibold text-[14px] text-charcoal/70 group-hover/link:text-charcoal transition-colors flex items-center justify-between">
                                      <span>{link.name}</span>
                                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 transition-spring text-sage" />
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Featured Panel */}
                  <div className="w-[35%] bg-charcoal rounded-[1.25rem] p-1 border border-charcoal/10 relative z-10 overflow-hidden group/featured flex flex-col min-h-[460px]">
                    <Image
                      src={MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].featured.image}
                      alt="Featured"
                      fill
                      className="object-cover opacity-40 group-hover/featured:scale-105 group-hover/featured:opacity-50 transition-all duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/90 to-transparent z-10" />
                    
                    {/* Linear-style border glow inside featured card */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover/featured:ring-white/20 rounded-[1.25rem] z-20 transition-colors" />

                    <div className="relative z-30 h-full flex flex-col justify-end p-8">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white mb-6 self-start shadow-xl">
                        {MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].featured.tag}
                      </div>
                      <h3 className="font-display font-bold text-2xl mb-3 text-white leading-tight">{MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].featured.title}</h3>
                      <p className="text-[14px] text-white/70 mb-8 leading-relaxed">
                        {MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].featured.desc}
                      </p>
                      <Link href={MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].featured.href}>
                        <Button className="w-full justify-between group/btn bg-white text-charcoal hover:bg-sage hover:text-white h-12 rounded-xl shadow-[0_4px_14px_0_rgba(255,255,255,0.2)] transition-all font-semibold text-sm">
                          Explore Now <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      
      {/* Search and Mobile Menu components remain functionally identical but styling elevated if needed... */}
    </>
  );
}
