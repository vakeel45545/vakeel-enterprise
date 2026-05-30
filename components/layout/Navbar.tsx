'use client';

import { useState, useEffect, useRef, useCallback, MouseEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ChevronDown, Menu, X, ArrowRight,
  Building2, Calculator, Scale, FileText,
  Zap, Sparkles, BookOpen, Briefcase,
  Search, ArrowUpRight, CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import type { NavigationItem } from '@/lib/cms/navigation-types';

// ─── Icon registry ─────────────────────────────────────────────────────────
const ICON_MAP = {
  Building2,
  Calculator,
  Scale,
  FileText,
  Zap,
  Sparkles,
  BookOpen,
  Briefcase,
  CheckCircle2,
};

// ─── Component ──────────────────────────────────────────────────────────────
interface NavbarProps {
  navItems: NavigationItem[];
  companyName?: string;
}

export default function Navbar({ navItems, companyName = 'Vakeel' }: NavbarProps) {
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

  // Close menus on Escape key
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

  // ── Body scroll lock that doesn't cause layout shift ──
  useEffect(() => {
    if (mobileMenuOpen || isSearchOpen) {
      scrollPositionRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
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
    setActiveMobileMenu(prev => (prev === title ? null : title));
  }, []);

  // ── Derive active mega-menu data from navItems ──────────────────────────
  const activeNavItem = navItems.find(i => i.title === activeDesktopMenu);
  const activeMenuData = activeNavItem?.mega_menu_data ?? null;

  return (
    <>
      {/* ===== Announcement Bar ===== */}
      <div className="bg-charcoal text-white/90 text-[13px] py-2.5 text-center px-4 font-medium relative z-50 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>
          <strong className="text-white">New:</strong> Introducing Vakeel AI 2.0 – automate compliance in seconds.
        </span>
        <Link href="/ai" className="ml-2 text-sage hover:text-white transition-colors flex items-center group">
          <span className="border-b border-sage/30 group-hover:border-white/50 transition-colors">Try it free</span>
          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <motion.header
        className={cn(
          'sticky top-0 left-0 right-0 z-40 w-full',
          'transition-[padding] duration-500 transition-spring',
          isScrolled ? 'py-3' : 'py-4 xl:py-5',
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Background layer */}
        <div
          className={cn(
            'absolute inset-0 transition-all duration-500 ease-in-out z-0 border-b border-charcoal/5',
            isScrolled
              ? 'opacity-100 bg-white/80 backdrop-blur-2xl shadow-premium'
              : 'opacity-0 bg-transparent',
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
                {companyName}
              </span>
            </Link>

            {/* ===== CENTER: Desktop Navigation ===== */}
            <nav
              ref={navRef}
              className="hidden lg:flex items-center justify-center flex-1 min-w-0 mx-4 xl:mx-6"
              onMouseLeave={handleMenuLeave}
            >
              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const isMegaMenu = item.type === 'mega' && !!item.mega_menu_data;
                  const isActive = activeDesktopMenu === item.title;
                  const href = item.url ?? item.slug ?? '/';

                  return (
                    <div
                      key={item.id ?? item.title}
                      className="relative"
                      onMouseEnter={() => handleMenuEnter(item.title)}
                    >
                      <Link
                        href={href}
                        className={cn(
                          'py-2 px-3 xl:px-4 rounded-full text-[13px] xl:text-[14px] font-semibold transition-all duration-300 flex items-center gap-1.5',
                          isActive
                            ? 'bg-sage/10 text-sage'
                            : 'text-charcoal/70 hover:text-charcoal hover:bg-charcoal/5',
                        )}
                      >
                        {item.title}
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-sage text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {isMegaMenu && (
                          <ChevronDown
                            className={cn(
                              'w-3.5 h-3.5 transition-transform duration-300 transition-spring',
                              isActive ? 'rotate-180 text-sage' : 'text-charcoal/40',
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
                    'rounded-full h-10 px-6 text-[14px] font-bold text-white transition-all duration-300 transform hover:-translate-y-[1px] group relative overflow-hidden',
                    'bg-charcoal hover:bg-sage border border-charcoal/20',
                    'shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-premium-hover',
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
                  'w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 bg-white shadow-sm border border-charcoal/5',
                  mobileMenuOpen ? 'bg-charcoal/5 text-charcoal' : 'text-charcoal/80 hover:bg-charcoal/5',
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
          {activeDesktopMenu && activeMenuData && (
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

                  {/* Left: categories */}
                  <div className="w-[65%] p-8 relative z-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start gap-5 mb-10">
                        <div className="w-14 h-14 rounded-2xl bg-sage/10 border border-sage/20 text-sage flex items-center justify-center shrink-0 shadow-inner">
                          {(() => {
                            const iconKey = activeMenuData.icon as keyof typeof ICON_MAP | undefined;
                            const IconComponent = iconKey ? ICON_MAP[iconKey] : null;
                            return IconComponent ? <IconComponent className="w-7 h-7" /> : null;
                          })()}
                        </div>
                        <div className="min-w-0 pt-1">
                          <h3 className="font-display font-bold text-3xl text-charcoal mb-2 tracking-tight">
                            {activeDesktopMenu}
                          </h3>
                          <p className="text-base text-charcoal/55 leading-relaxed">
                            {activeMenuData.description}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-10">
                        {(activeMenuData.categories ?? []).map((cat, idx) => (
                          <div key={idx}>
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-charcoal/40 mb-4 flex items-center gap-2">
                              {cat.title}
                            </h4>
                            <ul className="space-y-1">
                              {cat.links.map((link, linkIdx) => (
                                <li key={linkIdx}>
                                  <Link
                                    href={link.href}
                                    className="block group/link px-3 py-2 -ml-3 rounded-xl hover:bg-charcoal/5 transition-colors duration-200"
                                  >
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

                  {/* Right: featured card */}
                  <div className="w-[35%] bg-charcoal rounded-[1.25rem] p-1 border border-charcoal/10 relative z-10 overflow-hidden group/featured flex flex-col min-h-[460px]">
                    {activeMenuData.featured?.image && (
                      <Image
                        src={activeMenuData.featured.image}
                        alt="Featured"
                        fill
                        className="object-cover opacity-40 group-hover/featured:scale-105 group-hover/featured:opacity-50 transition-all duration-1000 ease-out"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/90 to-transparent z-10" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover/featured:ring-white/20 rounded-[1.25rem] z-20 transition-colors" />

                    <div className="relative z-30 h-full flex flex-col justify-end p-8">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white mb-6 self-start shadow-xl">
                        {activeMenuData.featured?.tag ?? ''}
                      </div>
                      <h3 className="font-display font-bold text-2xl mb-3 text-white leading-tight">
                        {activeMenuData.featured?.title ?? ''}
                      </h3>
                      <p className="text-[14px] text-white/70 mb-8 leading-relaxed">
                        {activeMenuData.featured?.desc ?? ''}
                      </p>
                      <Link href={activeMenuData.featured?.href ?? '/'}>
                        <Button className="w-full justify-between group/btn bg-white text-charcoal hover:bg-sage hover:text-white h-12 rounded-xl shadow-[0_4px_14px_0_rgba(255,255,255,0.2)] transition-all font-semibold text-sm">
                          Explore Now{' '}
                          <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
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
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-premium p-4 flex items-center gap-3 relative"
              onClick={e => e.stopPropagation()}
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
            {/* ── HEADER ── */}
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
                    {companyName}
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

            {/* ── SCROLLABLE BODY ── */}
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
                {navItems.map((item) => {
                  const isMegaMenu = item.type === 'mega' && !!item.mega_menu_data;
                  const isActive = activeMobileMenu === item.title;
                  const menuData = item.mega_menu_data;
                  const href = item.url ?? item.slug ?? '/';

                  if (isMegaMenu && menuData) {
                    return (
                      <div
                        key={item.id ?? item.title}
                        className="rounded-2xl border border-black/[0.06] bg-black/[0.018]"
                        style={{ contain: 'layout' }}
                      >
                        {/* Accordion trigger */}
                        <button
                          onClick={() => toggleMobileSection(item.title)}
                          className="w-full flex items-center justify-between px-5 py-[15px] text-left touch-manipulation active:bg-black/[0.03] rounded-2xl transition-colors"
                        >
                          <span
                            className={cn(
                              'text-[15px] font-bold transition-colors select-none',
                              isActive ? 'text-sage' : 'text-charcoal',
                            )}
                          >
                            {item.title}
                          </span>
                          <div
                            className={cn(
                              'w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0',
                              isActive ? 'bg-sage/10' : 'bg-black/[0.04]',
                            )}
                          >
                            <ChevronDown
                              className={cn(
                                'w-4 h-4 transition-transform duration-300',
                                isActive ? 'rotate-180 text-sage' : 'text-charcoal/40',
                              )}
                            />
                          </div>
                        </button>

                        {/* Expandable content */}
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.div
                              key="panel"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div className="px-4 pb-5 pt-1 space-y-5">
                                {/* Categories */}
                                {(menuData.categories ?? []).map((cat, idx) => (
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

                                {/* Featured card */}
                                {menuData.featured && (
                                  <Link
                                    href={menuData.featured.href ?? '/'}
                                    onClick={closeMobileMenu}
                                    className="block"
                                  >
                                    <div
                                      className="bg-charcoal rounded-2xl px-5 py-5 relative overflow-hidden active:opacity-90 transition-opacity touch-manipulation"
                                      style={{ minHeight: '100px' }}
                                    >
                                      <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/95 to-transparent z-10" />
                                      {menuData.featured.image && (
                                        <Image
                                          src={menuData.featured.image}
                                          alt=""
                                          fill
                                          className="object-cover opacity-25"
                                        />
                                      )}
                                      <div className="relative z-20">
                                        <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-white/60 bg-white/10 px-2.5 py-1 rounded-full mb-2">
                                          {menuData.featured.tag}
                                        </span>
                                        <h5 className="font-display font-bold text-white text-[14px] leading-snug mb-2">
                                          {menuData.featured.title}
                                        </h5>
                                        <div className="flex items-center gap-1 text-sage text-[12px] font-bold">
                                          Explore Now <ArrowRight className="w-3 h-3" />
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  // Plain nav link
                  return (
                    <Link
                      key={item.id ?? item.title}
                      href={href}
                      onClick={closeMobileMenu}
                      className="flex items-center w-full px-5 py-[15px] rounded-2xl text-[15px] font-bold text-charcoal active:bg-black/[0.04] active:text-sage transition-colors touch-manipulation"
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </div>

              <div style={{ height: '8px' }} />
            </div>

            {/* ── FOOTER CTAs ── */}
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
                  Get Started{' '}
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}