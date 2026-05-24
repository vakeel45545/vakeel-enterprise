// 'use client';

// import { useState, useEffect, useRef, useCallback, MouseEvent } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { motion, AnimatePresence } from 'framer-motion';
// import { siteConfig } from '@/config/site';
// import { Button } from '@/components/ui/button';
// import { ChevronDown, Menu, X, ArrowRight, Building2, Calculator, Scale, FileText, Zap, Sparkles, BookOpen, Briefcase, Search, ArrowUpRight, CheckCircle2 } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { usePathname } from 'next/navigation';

// const MEGA_MENU_CONTENT = {
//   "Startup & Registration": {
//     description: "Launch your company with zero errors and fast-tracked ROC approval.",
//     icon: Building2,
//     categories: [
//       {
//         title: "Company Registration",
//         links: [
//           { name: "Private Limited Company", href: "/services/private-limited-company" },
//           { name: "LLP Registration", href: "/services/llp-registration" },
//           { name: "One Person Company", href: "/services/opc-registration" },
//           { name: "Partnership Firm", href: "/services/partnership-firm" },
//           { name: "Sole Proprietorship", href: "/services/sole-proprietorship" }
//         ]
//       },
//       {
//         title: "Startup Services",
//         links: [
//           { name: "Startup India Registration", href: "/services/startup-india" },
//           { name: "DPIIT Recognition", href: "/services/dpiit-recognition" },
//           { name: "Pitch Deck Support", href: "/services/pitch-deck" },
//           { name: "Founder Agreements", href: "/services/founder-agreements" },
//         ]
//       },
//       {
//         title: "International Business",
//         links: [
//           { name: "US Company Registration", href: "/services/us-incorporation" },
//           { name: "Dubai Company Setup", href: "/services/dubai-setup" },
//           { name: "Singapore Incorporation", href: "/services/singapore-incorporation" },
//         ]
//       }
//     ],
//     featured: {
//       title: "Launch Your Startup Faster",
//       desc: "Incorporate + GST + Trademark in one discounted package.",
//       tag: "Best Value",
//       href: "/bundles/startup",
//       image: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=600&q=80&auto=format&fit=crop"
//     }
//   },
//   "GST & Tax": {
//     description: "Automated GST filing, ITR, and corporate tax compliance.",
//     icon: Calculator,
//     categories: [
//       {
//         title: "GST Services",
//         links: [
//           { name: "GST Registration", href: "/services/gst-registration" },
//           { name: "GST Filing", href: "/services/gst-filing" },
//           { name: "GST Cancellation", href: "/services/gst-cancellation" },
//           { name: "GST LUT Filing", href: "/services/lut-filing" },
//           { name: "GST Notices", href: "/services/gst-notices" }
//         ]
//       },
//       {
//         title: "Income Tax",
//         links: [
//           { name: "ITR Filing", href: "/services/itr-filing" },
//           { name: "TDS Filing", href: "/services/tds-filing" },
//           { name: "Tax Consultation", href: "/services/tax-consultation" },
//           { name: "Advance Tax", href: "/services/advance-tax" },
//         ]
//       },
//       {
//         title: "Accounting & Compliance",
//         links: [
//           { name: "Payroll", href: "/services/payroll" },
//           { name: "Bookkeeping", href: "/services/bookkeeping" },
//           { name: "Accounting Services", href: "/services/accounting" },
//           { name: "Audit Support", href: "/services/audit-support" },
//         ]
//       }
//     ],
//     featured: {
//       title: "AI GST Assistant",
//       desc: "Scan your expenses and automatically find tax-saving opportunities.",
//       tag: "Automated",
//       href: "/ai/tax-optimizer",
//       image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&auto=format&fit=crop"
//     }
//   },
//   "IP & Trademark": {
//     description: "Protect your brand identity with trademark and patent registrations.",
//     icon: Scale,
//     categories: [
//       {
//         title: "Trademark Services",
//         links: [
//           { name: "Trademark Registration", href: "/services/trademark-registration" },
//           { name: "Trademark Renewal", href: "/services/trademark-renewal" },
//           { name: "Objection Reply", href: "/services/trademark-objection" },
//           { name: "Trademark Monitoring", href: "/services/trademark-monitoring" },
//         ]
//       },
//       {
//         title: "Intellectual Property",
//         links: [
//           { name: "Patent Filing", href: "/services/patent" },
//           { name: "Copyright Registration", href: "/services/copyright" },
//           { name: "Design Registration", href: "/services/design-registration" },
//         ]
//       },
//       {
//         title: "Legal Protection",
//         links: [
//           { name: "IP Consultation", href: "/services/ip-consultation" },
//           { name: "Legal Notices", href: "/services/legal-notices" },
//           { name: "Brand Protection", href: "/services/brand-protection" },
//         ]
//       }
//     ],
//     featured: {
//       title: "Protect Your Brand Identity",
//       desc: "Secure your logos, brand names, and slogans legally across India and globally.",
//       tag: "Protection",
//       href: "/services/trademark-registration",
//       image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80&auto=format&fit=crop"
//     }
//   },
//   "Licenses": {
//     description: "Get essential business licenses and government certifications.",
//     icon: FileText,
//     categories: [
//       {
//         title: "Food & Trade Licenses",
//         links: [
//           { name: "FSSAI License", href: "/services/fssai" },
//           { name: "Trade License", href: "/services/trade-license" },
//           { name: "Shop & Establishment", href: "/services/shop-establishment" },
//         ]
//       },
//       {
//         title: "Government Registrations",
//         links: [
//           { name: "MSME Registration", href: "/services/msme" },
//           { name: "IEC Code", href: "/services/iec-code" },
//           { name: "PF & ESI Registration", href: "/services/pf-esi" },
//         ]
//       },
//       {
//         title: "Certifications",
//         links: [
//           { name: "ISO Certification", href: "/services/iso" },
//           { name: "BIS Certification", href: "/services/bis" },
//           { name: "Startup Certifications", href: "/services/startup-certifications" },
//         ]
//       }
//     ],
//     featured: {
//       title: "Get Business Ready",
//       desc: "Stay fully compliant with essential trade licenses and registrations.",
//       tag: "Licenses",
//       href: "/services/fssai",
//       image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?w=600&q=80&auto=format&fit=crop"
//     }
//   },
//   "Compliance": {
//     description: "Stay bulletproof with our ongoing compliance tracking.",
//     icon: CheckCircle2,
//     categories: [
//       {
//         title: "Annual Compliance",
//         links: [
//           { name: "ROC Filing", href: "/services/roc-filing" },
//           { name: "Annual Returns", href: "/services/annual-returns" },
//           { name: "DIR-3 KYC", href: "/services/dir-3" },
//           { name: "Compliance Calendar", href: "/dashboard/compliance" },
//         ]
//       },
//       {
//         title: "Secretarial Services",
//         links: [
//           { name: "Board Resolutions", href: "/services/board-resolutions" },
//           { name: "Share Transfer", href: "/services/share-transfer" },
//           { name: "Legal Documentation", href: "/services/legal-docs" },
//         ]
//       },
//       {
//         title: "Environmental Compliance",
//         links: [
//           { name: "Pollution NOC", href: "/services/pollution-noc" },
//           { name: "Waste Management", href: "/services/waste-management" },
//           { name: "Environmental Clearance", href: "/services/environmental-clearance" },
//         ]
//       }
//     ],
//     featured: {
//       title: "AI Compliance Tracker",
//       desc: "Real-time compliance dashboard with automated alerts and reminders.",
//       tag: "Dashboard",
//       href: "/dashboard/compliance",
//       image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80&auto=format&fit=crop"
//     }
//   },
//   "AI Assistant": {
//     description: "Futuristic tools to automate your legal workflows.",
//     icon: Sparkles,
//     categories: [
//       {
//         title: "AI Tools",
//         links: [
//           { name: "AI Legal Chatbot", href: "/ai/chat" },
//           { name: "AI GST Assistant", href: "/ai/gst" },
//           { name: "AI Document Analyzer", href: "/ai/document" },
//           { name: "AI Compliance Reminder", href: "/ai/reminders" },
//         ]
//       },
//       {
//         title: "AI Automation",
//         links: [
//           { name: "Smart Filing", href: "/ai/filing" },
//           { name: "Workflow Automation", href: "/ai/workflow" },
//           { name: "AI Notifications", href: "/ai/notifications" },
//           { name: "AI Summaries", href: "/ai/summaries" },
//         ]
//       },
//       {
//         title: "Smart Systems",
//         links: [
//           { name: "AI Recommendations", href: "/ai/recommendations" },
//           { name: "Legal Risk Analysis", href: "/ai/risk" },
//           { name: "Smart Tracking", href: "/ai/tracking" },
//         ]
//       }
//     ],
//     featured: {
//       title: "Meet Your AI Legal Co-Pilot",
//       desc: "Upload contracts, ask questions, and automate your company's entire legal life.",
//       tag: "Vaakil AI 2.0",
//       href: "/ai",
//       image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80&auto=format&fit=crop"
//     }
//   },
//   "Resources & News": {
//     description: "Guides, updates, and templates for modern teams.",
//     icon: BookOpen,
//     categories: [
//       {
//         title: "Blogs",
//         links: [
//           { name: "Startup Guides", href: "/blog/startups" },
//           { name: "GST Guides", href: "/blog/gst" },
//           { name: "Trademark Articles", href: "/blog/trademarks" },
//           { name: "Compliance News", href: "/blog/compliance" },
//         ]
//       },
//       {
//         title: "News & Updates",
//         links: [
//           { name: "Government Updates", href: "/news/gov" },
//           { name: "Taxation Changes", href: "/news/tax" },
//           { name: "Startup Policies", href: "/news/policies" },
//           { name: "Compliance Deadlines", href: "/news/deadlines" },
//         ]
//       },
//       {
//         title: "Learning Center",
//         links: [
//           { name: "Templates & Documents", href: "/resources/templates" },
//           { name: "Video Tutorials", href: "/resources/videos" },
//           { name: "Webinars", href: "/resources/webinars" },
//           { name: "Case Studies", href: "/case-studies" },
//         ]
//       }
//     ],
//     featured: {
//       title: "The Founder's Legal Handbook",
//       desc: "Everything you need to know about scaling legally in India.",
//       tag: "Featured Guide",
//       href: "/resources/handbook",
//       image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80&auto=format&fit=crop"
//     }
//   },
//   "Company": {
//     description: "About us, careers, and getting in touch.",
//     icon: Briefcase,
//     categories: [
//       {
//         title: "Company",
//         links: [
//           { name: "About Vakeel", href: "/about" },
//           { name: "Mission", href: "/mission" },
//           { name: "Leadership", href: "/leadership" },
//           { name: "Press & Media", href: "/press" },
//         ]
//       },
//       {
//         title: "Careers",
//         links: [
//           { name: "Open Roles", href: "/careers#openings" },
//           { name: "Engineering", href: "/careers/engineering" },
//           { name: "Legal Experts", href: "/careers/legal" },
//           { name: "Life at Vakeel", href: "/careers#culture" },
//         ]
//       },
//       {
//         title: "Contact",
//         links: [
//           { name: "Office Locations", href: "/contact#locations" },
//           { name: "Support Center", href: "/support" },
//           { name: "Consultation Booking", href: "/book" },
//           { name: "WhatsApp Support", href: "/whatsapp" },
//         ]
//       }
//     ],
//     featured: {
//       title: "Join the Legal-Tech Revolution",
//       desc: "We are hiring engineers, CA/CS, and designers to build the future.",
//       tag: "We're Hiring",
//       href: "/careers",
//       image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80&auto=format&fit=crop"
//     }
//   }
// };

// export default function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [activeDesktopMenu, setActiveDesktopMenu] = useState<string | null>(null);
//   const [activeMobileMenu, setActiveMobileMenu] = useState<string | null>(null);
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const navRef = useRef<HTMLElement>(null);
//   const megaMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
//   const pathname = usePathname();

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 20);
//     };
//     window.addEventListener('scroll', handleScroll, { passive: true });
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Close menus on route change
//   useEffect(() => {
//     setMobileMenuOpen(false);
//     setActiveDesktopMenu(null);
//     setActiveMobileMenu(null);
//   }, [pathname]);

//   // Close mobile menu on escape key
//   useEffect(() => {
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         setMobileMenuOpen(false);
//         setActiveDesktopMenu(null);
//         setIsSearchOpen(false);
//       }
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, []);

//   // Lock body scroll when mobile menu or search open
//   useEffect(() => {
//     if (mobileMenuOpen || isSearchOpen) {
//       const scrollY = window.scrollY;
//       document.body.style.position = 'fixed';
//       document.body.style.top = `-${scrollY}px`;
//       document.body.style.width = '100%';
//       document.body.style.overflow = 'hidden';
//       document.documentElement.style.overflow = 'hidden';
//     } else {
//       const scrollY = document.body.style.top;
//       document.body.style.position = '';
//       document.body.style.top = '';
//       document.body.style.width = '';
//       document.body.style.overflow = '';
//       document.documentElement.style.overflow = '';
//       if (scrollY) {
//         window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
//       }
//     }

//     return () => {
//       document.body.style.position = '';
//       document.body.style.top = '';
//       document.body.style.width = '';
//       document.body.style.overflow = '';
//       document.documentElement.style.overflow = '';
//     };
//   }, [mobileMenuOpen, isSearchOpen]);

//   const handleMenuEnter = useCallback((title: string) => {
//     if (megaMenuTimeoutRef.current) {
//       clearTimeout(megaMenuTimeoutRef.current);
//       megaMenuTimeoutRef.current = null;
//     }
//     setActiveDesktopMenu(title);
//   }, []);

//   const handleMenuLeave = useCallback(() => {
//     megaMenuTimeoutRef.current = setTimeout(() => {
//       setActiveDesktopMenu(null);
//     }, 150);
//   }, []);

//   // Mouse tracking for spotlight effect in Mega Menu
//   const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
//     e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
//   };

//   return (
//     <>
//       {/* Announcement Bar */}
//       <div className="bg-charcoal text-white/90 text-[13px] py-2.5 text-center px-4 font-medium relative z-50 flex items-center justify-center gap-2">
//         <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
//         <span><strong className="text-white">New:</strong> Introducing Vakeel AI 2.0 – automate compliance in seconds.</span>
//         <Link href="/ai" className="ml-2 text-sage hover:text-white transition-colors flex items-center group">
//           <span className="border-b border-sage/30 group-hover:border-white/50 transition-colors">Try it free</span>
//           <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
//         </Link>
//       </div>

//       <motion.header
//         className={cn(
//           "sticky top-0 left-0 right-0 z-40 w-full",
//           "transition-[padding] duration-500 transition-spring",
//           isScrolled ? "py-3" : "py-4 xl:py-5"
//         )}
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
//       >
//         {/* Background layer for sticky nav */}
//         <div 
//           className={cn(
//             "absolute inset-0 transition-all duration-500 ease-in-out z-0 border-b border-charcoal/5",
//             isScrolled ? "opacity-100 bg-white/80 backdrop-blur-2xl shadow-premium" : "opacity-0 bg-transparent"
//           )}
//         />

//         {/* Container */}
//         <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 relative z-10">
//           <div className="flex items-center justify-between">
//             {/* ===== LEFT: Logo ===== */}
//             <Link href="/" className="flex items-center gap-2 group shrink-0">
//               <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-charcoal flex items-center justify-center text-white font-display font-bold text-base lg:text-lg shadow-[0_2px_10px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-spring duration-300">
//                 V
//               </div>
//               <span className="font-display font-bold text-lg lg:text-xl tracking-tight text-charcoal">
//                 {siteConfig.companyName}
//               </span>
//             </Link>

//             {/* ===== CENTER: Desktop Navigation ===== */}
//             <nav
//               ref={navRef}
//               className="hidden lg:flex items-center justify-center flex-1 min-w-0 mx-4 xl:mx-6"
//               onMouseLeave={handleMenuLeave}
//             >
//               <div className="flex items-center gap-1">
//                 {siteConfig.mainNav.map((item) => {
//                   const isMegaMenu = item.title in MEGA_MENU_CONTENT;
//                   const isActive = activeDesktopMenu === item.title;

//                   return (
//                     <div
//                       key={item.title}
//                       className="relative"
//                       onMouseEnter={() => handleMenuEnter(item.title)}
//                     >
//                       <Link
//                         href={item.href}
//                         className={cn(
//                           "py-2 px-3 xl:px-4 rounded-full text-[13px] xl:text-[14px] font-semibold transition-all duration-300 flex items-center gap-1.5",
//                           isActive
//                             ? "bg-sage/10 text-sage"
//                             : "text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5"
//                         )}
//                       >
//                         {item.title}
//                         {isMegaMenu && (
//                           <ChevronDown
//                             className={cn(
//                               "w-3.5 h-3.5 transition-transform duration-300 transition-spring",
//                               isActive ? "rotate-180 text-sage" : "text-charcoal/40"
//                             )}
//                           />
//                         )}
//                       </Link>
//                     </div>
//                   );
//                 })}
//               </div>
//             </nav>

//             {/* ===== RIGHT: Actions ===== */}
//             <div className="hidden lg:flex items-center gap-3 shrink-0">
//               {/* Search */}
//               <button
//                 onClick={() => setIsSearchOpen(true)}
//                 className="w-10 h-10 rounded-full border border-charcoal/10 bg-white/50 flex items-center justify-center text-charcoal/50 hover:bg-white hover:text-charcoal hover:border-charcoal/20 transition-all duration-300 group shadow-sm hover:shadow-md"
//                 aria-label="Search"
//               >
//                 <Search className="w-4 h-4 group-hover:scale-110 transition-transform duration-300 transition-spring" />
//               </button>

//               {/* Sign In */}
//               <Link
//                 href="/login"
//                 className="text-[14px] font-semibold text-charcoal/70 hover:text-charcoal px-3 py-2 transition-all duration-200"
//               >
//                 Sign In
//               </Link>

//               {/* Get Started CTA */}
//               <Link href="/contact" className="shrink-0">
//                 <Button
//                   className={cn(
//                     "rounded-full h-10 px-6 text-[14px] font-bold text-white transition-all duration-300 transform hover:-translate-y-[1px] group relative overflow-hidden",
//                     "bg-charcoal hover:bg-sage border border-charcoal/20",
//                     "shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-premium-hover"
//                   )}
//                 >
//                   <span className="relative z-10 flex items-center">
//                     Get Started <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
//                   </span>
//                 </Button>
//               </Link>
//             </div>

//             {/* ===== MOBILE: Actions & Toggle ===== */}
//             <div className="flex lg:hidden items-center gap-2 shrink-0 relative z-10">
//               <button
//                 onClick={() => setIsSearchOpen(true)}
//                 className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal/70 hover:bg-charcoal/5 transition-colors"
//                 aria-label="Search"
//               >
//                 <Search className="w-[18px] h-[18px]" />
//               </button>

//               <button
//                 className={cn(
//                   "w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 bg-white shadow-sm border border-charcoal/5",
//                   mobileMenuOpen ? "bg-charcoal/5 text-charcoal" : "text-charcoal/80 hover:bg-charcoal/5"
//                 )}
//                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//                 aria-label="Toggle menu"
//               >
//                 {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ===== MEGA MENU DROPDOWN ===== */}
//         <AnimatePresence mode="wait">
//           {activeDesktopMenu && (activeDesktopMenu in MEGA_MENU_CONTENT) && (
//             <motion.div
//               key={activeDesktopMenu}
//               initial={{ opacity: 0, y: 12, scale: 0.98 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: 8, scale: 0.98 }}
//               transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
//               className="hidden lg:block absolute left-0 right-0 top-[100%] z-50 pt-3"
//               onMouseEnter={() => handleMenuEnter(activeDesktopMenu)}
//               onMouseLeave={handleMenuLeave}
//             >
//               <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
//                 <div 
//                   className="max-w-[1100px] mx-auto bg-white/95 backdrop-blur-3xl rounded-[1.5rem] shadow-premium p-2 flex relative ring-1 ring-charcoal/5 overflow-hidden spotlight-wrapper"
//                   onMouseMove={handleMouseMove}
//                 >
//                   {/* Ambient Glow */}
//                   <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sage/5 rounded-full blur-[80px] pointer-events-none" />

//                   {/* Left: Categories */}
//                   <div className="w-[65%] p-8 relative z-10 flex flex-col justify-between">
//                     <div>
//                       <div className="flex items-start gap-5 mb-10">
//                         <div className="w-14 h-14 rounded-2xl bg-sage/10 border border-sage/20 text-sage flex items-center justify-center shrink-0 shadow-inner">
//                           {(() => {
//                             const IconComponent = MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].icon;
//                             return <IconComponent className="w-7 h-7" />;
//                           })()}
//                         </div>
//                         <div className="min-w-0 pt-1">
//                           <h3 className="font-display font-bold text-3xl text-charcoal mb-2 tracking-tight">{activeDesktopMenu}</h3>
//                           <p className="text-base text-charcoal/55 leading-relaxed">{MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].description}</p>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-x-8 gap-y-10">
//                         {MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].categories.map((cat, idx) => (
//                           <div key={idx}>
//                             <h4 className="text-[11px] font-bold uppercase tracking-widest text-charcoal/40 mb-4 flex items-center gap-2">
//                               {cat.title}
//                             </h4>
//                             <ul className="space-y-1">
//                               {cat.links.map((link, linkIdx) => (
//                                 <li key={linkIdx}>
//                                   <Link href={link.href} className="block group/link px-3 py-2 -ml-3 rounded-xl hover:bg-charcoal/5 transition-colors duration-200">
//                                     <div className="font-semibold text-[14px] text-charcoal/70 group-hover/link:text-charcoal transition-colors flex items-center justify-between">
//                                       <span>{link.name}</span>
//                                       <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 transition-spring text-sage" />
//                                     </div>
//                                   </Link>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Right: Featured Panel */}
//                   <div className="w-[35%] bg-charcoal rounded-[1.25rem] p-1 border border-charcoal/10 relative z-10 overflow-hidden group/featured flex flex-col min-h-[460px]">
//                     <Image
//                       src={MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].featured.image}
//                       alt="Featured"
//                       fill
//                       className="object-cover opacity-40 group-hover/featured:scale-105 group-hover/featured:opacity-50 transition-all duration-1000 ease-out"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/90 to-transparent z-10" />
                    
//                     {/* Linear-style border glow inside featured card */}
//                     <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover/featured:ring-white/20 rounded-[1.25rem] z-20 transition-colors" />

//                     <div className="relative z-30 h-full flex flex-col justify-end p-8">
//                       <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white mb-6 self-start shadow-xl">
//                         {MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].featured.tag}
//                       </div>
//                       <h3 className="font-display font-bold text-2xl mb-3 text-white leading-tight">{MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].featured.title}</h3>
//                       <p className="text-[14px] text-white/70 mb-8 leading-relaxed">
//                         {MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].featured.desc}
//                       </p>
//                       <Link href={MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].featured.href}>
//                         <Button className="w-full justify-between group/btn bg-white text-charcoal hover:bg-sage hover:text-white h-12 rounded-xl shadow-[0_4px_14px_0_rgba(255,255,255,0.2)] transition-all font-semibold text-sm">
//                           Explore Now <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
//                         </Button>
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.header>
//       {/* ===== SEARCH MODAL ===== */}
//       <AnimatePresence>
//         {isSearchOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="fixed inset-0 z-[110] flex items-start justify-center pt-20 px-4 bg-charcoal/40 backdrop-blur-sm"
//             onClick={() => setIsSearchOpen(false)}
//           >
//             <motion.div
//               initial={{ opacity: 0, y: -20, scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: -10, scale: 0.95 }}
//               transition={{ duration: 0.2, ease: "easeOut" }}
//               className="w-full max-w-2xl bg-white rounded-2xl shadow-premium p-4 flex items-center gap-3 relative"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <Search className="w-5 h-5 text-charcoal/40 ml-2 shrink-0" />
//               <input
//                 autoFocus
//                 type="text"
//                 placeholder="Search for services, blogs, or guides..."
//                 className="flex-1 bg-transparent border-none outline-none text-charcoal placeholder:text-charcoal/30 text-lg py-2"
//               />
//               <button
//                 onClick={() => setIsSearchOpen(false)}
//                 className="w-8 h-8 flex items-center justify-center rounded-full bg-charcoal/5 hover:bg-charcoal/10 text-charcoal/50 hover:text-charcoal transition-colors shrink-0"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ===== MOBILE MENU (FULL SCREEN) ===== */}
//       <AnimatePresence>
//         {mobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
//             className="fixed inset-0 z-[100] lg:hidden bg-white flex flex-col h-[100dvh] w-full overflow-hidden"
//           >
//             {/* Mobile Menu Header - Fixed to top for easy close */}
//             <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-charcoal/5 shrink-0 z-10">
//               <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
//                 <div className="w-8 h-8 rounded-xl bg-charcoal flex items-center justify-center text-white font-display font-bold text-base shadow-sm">
//                   V
//                 </div>
//                 <span className="font-display font-bold text-lg tracking-tight text-charcoal">
//                   {siteConfig.companyName}
//                 </span>
//               </Link>
//               <button
//                 className="w-10 h-10 flex items-center justify-center rounded-full bg-charcoal/5 hover:bg-charcoal/10 text-charcoal transition-colors"
//                 onClick={() => setMobileMenuOpen(false)}
//                 aria-label="Close menu"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Scrollable Content Container */}
//             <div 
//               className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain scroll-smooth touch-pan-y"
//               style={{ WebkitOverflowScrolling: 'touch' }}
//             >
//               <div className="flex flex-col min-h-full pb-[env(safe-area-inset-bottom)]">
//                 {/* Mobile Menu Items */}
//                 <div className="px-4 py-6 space-y-2">
//                 {siteConfig.mainNav.map((item) => {
//                   const isMegaMenu = item.title in MEGA_MENU_CONTENT;
//                   const isActive = activeMobileMenu === item.title;

//                   if (isMegaMenu) {
//                      return (
//                        <div key={item.title} className="rounded-2xl border border-charcoal/5 bg-charcoal/[0.02] overflow-hidden">
//                          <button
//                            onClick={() => setActiveMobileMenu(isActive ? null : item.title)}
//                            className="w-full flex items-center justify-between px-5 py-4 text-left"
//                          >
//                            <span className={cn(
//                              "text-[15px] font-bold transition-colors",
//                              isActive ? "text-sage" : "text-charcoal"
//                            )}>
//                              {item.title}
//                            </span>
//                            <ChevronDown
//                              className={cn(
//                                "w-4 h-4 transition-transform duration-300",
//                                isActive ? "rotate-180 text-sage" : "text-charcoal/40"
//                              )}
//                            />
//                          </button>

//                          <AnimatePresence>
//                            {isActive && (
//                              <motion.div
//                                initial={{ height: 0, opacity: 0 }}
//                                animate={{ height: "auto", opacity: 1 }}
//                                exit={{ height: 0, opacity: 0 }}
//                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
//                                className="overflow-hidden"
//                              >
//                                <div className="px-5 pb-5 pt-1 space-y-6">
//                                  {MEGA_MENU_CONTENT[item.title as keyof typeof MEGA_MENU_CONTENT].categories.map((cat, idx) => (
//                                    <div key={idx}>
//                                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-charcoal/40 mb-3">
//                                        {cat.title}
//                                      </h4>
//                                      <ul className="space-y-1">
//                                        {cat.links.map((link, linkIdx) => (
//                                          <li key={linkIdx}>
//                                            <Link 
//                                              href={link.href} 
//                                              onClick={() => setMobileMenuOpen(false)}
//                                              className="block py-2.5 text-[14px] font-semibold text-charcoal/70 hover:text-sage transition-colors"
//                                            >
//                                              {link.name}
//                                            </Link>
//                                          </li>
//                                        ))}
//                                      </ul>
//                                    </div>
//                                  ))}
                                 
//                                  {/* Mobile Featured Card */}
//                                  <div className="mt-4 bg-charcoal rounded-xl p-5 relative overflow-hidden">
//                                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent z-10" />
//                                    <Image
//                                      src={MEGA_MENU_CONTENT[item.title as keyof typeof MEGA_MENU_CONTENT].featured.image}
//                                      alt="Featured"
//                                      fill
//                                      className="object-cover opacity-40 mix-blend-overlay"
//                                    />
//                                    <div className="relative z-20 flex flex-col">
//                                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/80 mb-2">
//                                        {MEGA_MENU_CONTENT[item.title as keyof typeof MEGA_MENU_CONTENT].featured.tag}
//                                      </span>
//                                      <h5 className="font-display font-bold text-white text-lg mb-1">{MEGA_MENU_CONTENT[item.title as keyof typeof MEGA_MENU_CONTENT].featured.title}</h5>
//                                      <Link 
//                                        href={MEGA_MENU_CONTENT[item.title as keyof typeof MEGA_MENU_CONTENT].featured.href}
//                                        onClick={() => setMobileMenuOpen(false)}
//                                        className="mt-4 flex items-center text-xs font-bold text-sage hover:text-white transition-colors w-max"
//                                      >
//                                        Explore Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
//                                      </Link>
//                                    </div>
//                                  </div>
//                                </div>
//                              </motion.div>
//                            )}
//                          </AnimatePresence>
//                        </div>
//                      );
//                   }

//                   return (
//                     <Link
//                       key={item.title}
//                       href={item.href}
//                       onClick={() => setMobileMenuOpen(false)}
//                       className="block w-full px-5 py-4 rounded-2xl text-[15px] font-bold text-charcoal hover:bg-charcoal/5 hover:text-sage transition-colors"
//                     >
//                       {item.title}
//                     </Link>
//                   );
//                 })}
//               </div>

//               {/* Mobile Actions */}
//               <div className="mt-auto p-4 pb-8 border-t border-charcoal/5">
//                 <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
//                   <Button variant="outline" className="w-full justify-center mb-3 h-12 rounded-xl border-charcoal/10 font-bold text-[14px]">
//                     Sign In
//                   </Button>
//                 </Link>
//                 <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
//                   <Button className="w-full justify-center bg-charcoal hover:bg-sage text-white h-12 rounded-xl font-bold text-[14px] shadow-premium">
//                     Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }


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
  const scrollPositionRef = useRef(0);

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

  // ── FIXED: Body scroll lock that doesn't cause layout shift ──
  useEffect(() => {
    if (mobileMenuOpen || isSearchOpen) {
      // Save current scroll position
      scrollPositionRef.current = window.scrollY;
      // Lock the body in place using position fixed + top offset
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body position
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      // Restore scroll position without jarring jump
      window.scrollTo({ top: scrollPositionRef.current, behavior: 'instant' as ScrollBehavior });
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, isSearchOpen]);

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

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setActiveMobileMenu(null);
  }, []);

  const toggleMobileSection = useCallback((title: string) => {
    setActiveMobileMenu(prev => prev === title ? null : title);
  }, []);

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
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 rounded-full border border-charcoal/10 bg-white/50 flex items-center justify-center text-charcoal/50 hover:bg-white hover:text-charcoal hover:border-charcoal/20 transition-all duration-300 group shadow-sm hover:shadow-md"
                aria-label="Search"
              >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform duration-300 transition-spring" />
              </button>

              <Link
                href="/login"
                className="text-[14px] font-semibold text-charcoal/70 hover:text-charcoal px-3 py-2 transition-all duration-200"
              >
                Sign In
              </Link>

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
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-sage/5 rounded-full blur-[80px] pointer-events-none" />

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

                  <div className="w-[35%] bg-charcoal rounded-[1.25rem] p-1 border border-charcoal/10 relative z-10 overflow-hidden group/featured flex flex-col min-h-[460px]">
                    <Image
                      src={MEGA_MENU_CONTENT[activeDesktopMenu as keyof typeof MEGA_MENU_CONTENT].featured.image}
                      alt="Featured"
                      fill
                      className="object-cover opacity-40 group-hover/featured:scale-105 group-hover/featured:opacity-50 transition-all duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/90 to-transparent z-10" />
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

      {/* ===== SEARCH MODAL ===== */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[110] flex items-start justify-center pt-20 px-4 bg-charcoal/40 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-premium p-4 flex items-center gap-3 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Search className="w-5 h-5 text-charcoal/40 ml-2 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search for services, blogs, or guides..."
                className="flex-1 bg-transparent border-none outline-none text-charcoal placeholder:text-charcoal/30 text-lg py-2"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-charcoal/5 hover:bg-charcoal/10 text-charcoal/50 hover:text-charcoal transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MOBILE MENU (FULL SCREEN) ===== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] lg:hidden bg-white"
            // Inline style is the most reliable cross-browser way to create a
            // true fixed full-height flex column that doesn't collapse
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              maxHeight: '100%',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {/* ── HEADER: fixed height, never scrolls ── */}
            <div
              style={{ flexShrink: 0, height: '64px' }}
              className="flex items-center justify-between px-5 bg-white border-b border-black/[0.06]"
            >
              <div className="flex items-center justify-between w-full h-full">
                <Link href="/" className="flex items-center gap-2.5" onClick={closeMobileMenu}>
                  <div className="w-8 h-8 rounded-xl bg-charcoal flex items-center justify-center text-white font-display font-bold text-base shadow-sm">
                    V
                  </div>
                  <span className="font-display font-bold text-[17px] tracking-tight text-charcoal">
                    {siteConfig.companyName}
                  </span>
                </Link>
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black/[0.04] active:bg-black/[0.08] text-charcoal transition-colors touch-manipulation"
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ── SCROLLABLE BODY ──
                The THREE rules that make this work reliably in every browser:
                1. flex: 1 1 0   → grows to fill remaining space
                2. min-height: 0 → allows shrinking below content height (flex default is auto)
                3. overflow-y: auto → enables scrolling

                Do NOT put overflow:hidden on any ancestor of this element.
            ── */}
            <div
              style={{
                flex: '1 1 0',
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
              }}
            >
              <div className="px-4 pt-4 pb-3 space-y-2">
                {siteConfig.mainNav.map((item) => {
                  const isMegaMenu = item.title in MEGA_MENU_CONTENT;
                  const isActive = activeMobileMenu === item.title;

                  if (isMegaMenu) {
                    return (
                      <div
                        key={item.title}
                        // ⚠️ NO overflow-hidden here — that was the bug.
                        // Rounded corners are preserved via CSS outline trick below.
                        className="rounded-2xl border border-black/[0.06] bg-black/[0.018]"
                        style={{ contain: 'layout' }}
                      >
                        {/* Accordion trigger */}
                        <button
                          onClick={() => toggleMobileSection(item.title)}
                          className="w-full flex items-center justify-between px-5 py-[15px] text-left touch-manipulation active:bg-black/[0.03] rounded-2xl transition-colors"
                        >
                          <span className={cn(
                            "text-[15px] font-bold transition-colors select-none",
                            isActive ? "text-sage" : "text-charcoal"
                          )}>
                            {item.title}
                          </span>
                          <div className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                            isActive ? "bg-sage/10" : "bg-black/[0.04]"
                          )}>
                            <ChevronDown className={cn(
                              "w-4 h-4 transition-transform duration-300",
                              isActive ? "rotate-180 text-sage" : "text-charcoal/40"
                            )} />
                          </div>
                        </button>

                        {/* Expandable content — animates height, NO overflow:hidden wrapper */}
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.div
                              key="panel"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              // overflow:hidden is scoped ONLY to this motion div
                              // for the height animation clip — it does NOT affect
                              // the outer scroll container
                              style={{ overflow: 'hidden' }}
                            >
                              <div className="px-4 pb-5 pt-1 space-y-5">

                                {/* ── Categories ── */}
                                {MEGA_MENU_CONTENT[item.title as keyof typeof MEGA_MENU_CONTENT].categories.map((cat, idx) => (
                                  <div key={idx}>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/30 mb-2.5 px-2">
                                      {cat.title}
                                    </p>
                                    <ul>
                                      {cat.links.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                          <Link
                                            href={link.href}
                                            onClick={closeMobileMenu}
                                            className="flex items-center justify-between py-[11px] px-2 rounded-xl text-[14px] font-semibold text-charcoal/60 active:bg-black/[0.04] active:text-sage transition-colors touch-manipulation"
                                          >
                                            <span>{link.name}</span>
                                            <ArrowRight className="w-3.5 h-3.5 text-sage/50 shrink-0" />
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}

                                {/* ── Featured card ── */}
                                <Link
                                  href={MEGA_MENU_CONTENT[item.title as keyof typeof MEGA_MENU_CONTENT].featured.href}
                                  onClick={closeMobileMenu}
                                  className="block"
                                >
                                  <div className="bg-charcoal rounded-2xl px-5 py-5 relative overflow-hidden active:opacity-90 transition-opacity touch-manipulation"
                                    style={{ minHeight: '100px' }}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/95 to-transparent z-10" />
                                    <Image
                                      src={MEGA_MENU_CONTENT[item.title as keyof typeof MEGA_MENU_CONTENT].featured.image}
                                      alt=""
                                      fill
                                      className="object-cover opacity-25"
                                    />
                                    <div className="relative z-20">
                                      <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-white/60 bg-white/10 px-2.5 py-1 rounded-full mb-2">
                                        {MEGA_MENU_CONTENT[item.title as keyof typeof MEGA_MENU_CONTENT].featured.tag}
                                      </span>
                                      <h5 className="font-display font-bold text-white text-[14px] leading-snug mb-2">
                                        {MEGA_MENU_CONTENT[item.title as keyof typeof MEGA_MENU_CONTENT].featured.title}
                                      </h5>
                                      <div className="flex items-center gap-1 text-sage text-[12px] font-bold">
                                        Explore Now <ArrowRight className="w-3 h-3" />
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  // Plain nav link (no sub-menu)
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="flex items-center w-full px-5 py-[15px] rounded-2xl text-[15px] font-bold text-charcoal active:bg-black/[0.04] active:text-sage transition-colors touch-manipulation"
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </div>

              {/* Spacer so last item doesn't sit flush against the footer */}
              <div style={{ height: '8px' }} />
            </div>

            {/* ── FOOTER CTAs: fixed height, never scrolls ── */}
            <div
              style={{
                flexShrink: 0,
                paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
              }}
              className="px-4 pt-3 pb-4 border-t border-black/[0.06] bg-white space-y-2.5"
            >
              <Link href="/login" onClick={closeMobileMenu} className="block">
                <Button
                  variant="outline"
                  className="w-full justify-center h-12 rounded-xl border-black/[0.12] font-bold text-[14px] text-charcoal active:bg-black/[0.04] transition-colors touch-manipulation"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/contact" onClick={closeMobileMenu} className="block">
                <Button className="w-full justify-center bg-charcoal hover:bg-sage active:bg-sage text-white h-12 rounded-xl font-bold text-[14px] shadow-sm transition-all touch-manipulation group">
                  Get Started <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}