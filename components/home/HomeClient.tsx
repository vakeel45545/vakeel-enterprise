// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Variants, motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { ArrowRight, ShieldCheck, Zap, Scale, Building2, CheckCircle2, TrendingUp, Users, Activity, FileCheck, Clock, BarChart3, Sparkles, Lock, Globe, Server, CheckSquare } from 'lucide-react';
// import gsap from 'gsap';
// import { FaqSection } from '@/components/home/FaqSection';
// import { HowItWorks } from '@/components/home/HowItWorks';
// import { Testimonials } from '@/components/home/Testimonials';
// import { supabase } from '@/lib/supabase';

// const FADE_UP: Variants = {
//   hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
//   show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 50, damping: 20 } },
// };

// const STAGGER_CONTAINER: Variants = {
//   hidden: {},
//   show: { transition: { staggerChildren: 0.12 } },
// };

// // Animated counter hook
// function useAnimatedCounter(target: number, duration: number = 2000) {
//   const [count, setCount] = useState(0);
//   const ref = useRef<HTMLDivElement>(null);
//   const isInView = useInView(ref, { once: true, margin: "-100px" });

//   useEffect(() => {
//     if (!isInView) return;
//     let start = 0;
//     const step = Math.ceil(target / (duration / 16));
//     const timer = setInterval(() => {
//       start += step;
//       if (start >= target) {
//         setCount(target);
//         clearInterval(timer);
//       } else {
//         setCount(start);
//       }
//     }, 16);
//     return () => clearInterval(timer);
//   }, [isInView, target, duration]);

//   return { count, ref };
// }

// export default function HomeClient({ sections }: { sections: any[] }) {
//   const heroSection = sections.find(s => s.section_key === 'hero');
//   const heroContent = heroSection?.content || {};
//   const bentoSection = sections.find(s => s.section_key === 'bento_features');
//   const bentoContent = bentoSection?.content || {};
//   const aiSection = sections.find(s => s.section_key === 'ai_assistant');
//   const aiContent = aiSection?.content || {};
//   const ctaSection = sections.find(s => s.section_key === 'final_cta');
//   const ctaContent = ctaSection?.content || {};

//   const heroRef = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: heroRef,
//     offset: ["start start", "end start"]
//   });
//   const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
//   const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
//   const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

//   // Animated counters
//   const clients = useAnimatedCounter(50000);
//   const experts = useAnimatedCounter(2000);

//   // Dynamic testimonials from Supabase
//   const [testimonials, setTestimonials] = useState<any[]>([]);
//   useEffect(() => {
//     async function fetchTestimonials() {
//       try {
//         const { data } = await supabase
//           .from('testimonials')
//           .select('*')
//           .order('rating', { ascending: false })
//           .limit(3);
//         if (data && data.length > 0) setTestimonials(data);
//       } catch (err) {
//         console.error('Failed to fetch testimonials', err);
//       }
//     }
//     fetchTestimonials();
//   }, []);

//   // Spotlight effect handler
//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
//     e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
//   };

//   // Floating elements animation
//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       gsap.to(".floating-blob", {
//         y: "random(-35, 35)",
//         x: "random(-35, 35)",
//         rotation: "random(-10, 10)",
//         duration: 7,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//         stagger: { amount: 3, from: "random" }
//       });
//       gsap.to(".floating-card", {
//         y: "random(-15, 15)",
//         rotation: "random(-3, 3)",
//         duration: 5,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//         stagger: { amount: 2, from: "random" }
//       });
//     }, heroRef);
//     return () => ctx.revert();
//   }, []);

//   return (
//     <main className="min-h-screen overflow-hidden selection:bg-sage/30 selection:text-sage">
      
//       {/* 1. HERO SECTION */}
//       <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center pt-8 pb-16 overflow-hidden">
//         {/* Cinematic Background */}
//         <div className="absolute inset-0 z-0 bg-ivory noise-overlay">
//           <motion.div style={{ y, opacity, scale }} className="w-full h-full">
//             <div className="absolute inset-0 gradient-mesh opacity-70" />
//             <div className="absolute top-1/4 -left-1/4 w-[1000px] h-[1000px] rounded-full bg-sage/[0.08] blur-[150px] floating-blob mix-blend-multiply" />
//             <div className="absolute top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-amber/[0.06] blur-[130px] floating-blob mix-blend-multiply" />
//             <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full bg-emerald-600/[0.04] blur-[100px] floating-blob mix-blend-multiply" />
            
//             <div className="absolute inset-0 bg-[linear-gradient(to_right,#8C8C8515_1px,transparent_1px),linear-gradient(to_bottom,#8C8C8515_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_60%,transparent_100%)]" />
//           </motion.div>
//         </div>

//         <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-[1440px]">
//           <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-24">
//             {/* Left: Content */}
//             <motion.div
//               initial="hidden"
//               animate="show"
//               variants={STAGGER_CONTAINER}
//               className="flex-1 max-w-2xl flex flex-col items-center lg:items-start text-center lg:text-left"
//             >
//               {/* Pill badge */}
//               <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium shadow-premium mb-8 border-sage/15 text-sage font-bold text-xs uppercase tracking-widest">
//                 <span className="relative flex h-2.5 w-2.5 mr-1">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sage"></span>
//                 </span>
//                 <span>{heroContent.badge_text || 'Vakeel AI OS 2.0 Live'}</span>
//               </motion.div>

//               <motion.h1 
//                 variants={FADE_UP}
//                 className="text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[72px] xl:text-[84px] font-display font-bold leading-[1.05] tracking-tight mb-6 text-charcoal drop-shadow-sm"
//               >
//                 {heroSection?.title ? (
//                   <>
//                     {heroSection.title.split('.')[0]}.{" "}
//                     <span className="relative whitespace-nowrap block mt-1">
//                       <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-sage via-emerald-600 to-sage animate-shimmer bg-[length:200%_auto]">{heroSection.title.substring(heroSection.title.indexOf('.') + 1).trim()}</span>
//                     </span>
//                   </>
//                 ) : (
//                   <>
//                     Compliance.{" "}
//                     <span className="relative whitespace-nowrap block mt-1">
//                       <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-sage via-emerald-600 to-sage animate-shimmer bg-[length:200%_auto]">Automated by AI.</span>
//                     </span>
//                   </>
//                 )}
//               </motion.h1>

//               <motion.p 
//                 variants={FADE_UP}
//                 className="text-base sm:text-lg md:text-xl xl:text-2xl text-charcoal/65 max-w-xl mb-10 text-balance leading-relaxed font-medium"
//               >
//                 {heroSection?.subtitle || 'Everything your startup needs to launch, scale, and stay compliant. Unified in one intelligent, zero-error dashboard.'}
//               </motion.p>

//               <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
//                 <Link href={heroContent.primary_cta_url || '/services/business-registration'} className="w-full sm:w-auto">
//                   <Button size="lg" className="w-full h-14 px-8 text-base shadow-premium-hover bg-charcoal hover:bg-sage text-white transition-all transition-spring transform hover:-translate-y-1 group border border-charcoal/20">
//                     {heroContent.primary_cta_text || 'Start Your Business'}
//                     <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                   </Button>
//                 </Link>
//                 <Link href={heroContent.secondary_cta_url || '/contact'} className="w-full sm:w-auto">
//                   <Button size="lg" variant="outline" className="w-full h-14 px-8 text-base glass-premium shadow-premium border-charcoal/10 hover:bg-white hover:border-sage/30 transition-all transition-spring hover:-translate-y-1">
//                     {heroContent.secondary_cta_text || 'Talk to an Expert'}
//                   </Button>
//                 </Link>
//               </motion.div>

//               <motion.div variants={FADE_UP} className="mt-14 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-sm font-semibold text-charcoal/50 uppercase tracking-wider">
//                 <div ref={clients.ref} className="flex items-center gap-2.5"><ShieldCheck className="w-5 h-5 text-sage" /> SOC2 Compliant</div>
//                 <div className="flex items-center gap-2.5"><CheckCircle2 className="w-5 h-5 text-sage" /> {clients.count.toLocaleString()}+ Founders</div>
//               </motion.div>
//             </motion.div>

//             {/* Right: Floating Dashboard Preview */}
//             <motion.div
//               initial={{ opacity: 0, x: 40, y: 20 }}
//               animate={{ opacity: 1, x: 0, y: 0 }}
//               transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
//               className="flex-1 w-full max-w-lg lg:max-w-2xl relative hidden md:block"
//             >
//               {/* Main Dashboard Card */}
//               <div className="relative z-10 bg-white/95 backdrop-blur-3xl rounded-[2rem] border border-charcoal/10 shadow-premium p-6 floating-card ring-1 ring-charcoal/5">
                
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-6 pb-4 border-b border-charcoal/[0.06]">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-[10px] bg-sage/10 text-sage flex items-center justify-center font-bold font-display shadow-inner border border-sage/20">V</div>
//                     <div>
//                       <div className="text-sm font-bold text-charcoal">Acme Corp Dashboard</div>
//                       <div className="flex items-center gap-1.5 mt-0.5">
//                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
//                         <span className="text-[10px] font-semibold text-charcoal/40 uppercase tracking-widest">All systems nominal</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <div className="w-8 h-8 rounded-full bg-ivory border border-charcoal/5 flex items-center justify-center"><Globe className="w-4 h-4 text-charcoal/40" /></div>
//                     <div className="w-8 h-8 rounded-full bg-ivory border border-charcoal/5 flex items-center justify-center"><Server className="w-4 h-4 text-charcoal/40" /></div>
//                   </div>
//                 </div>

//                 {/* Grid Content */}
//                 <div className="grid grid-cols-2 gap-4">
//                    <div className="col-span-2 bg-gradient-to-br from-charcoal to-emerald-950 rounded-2xl p-5 text-white relative overflow-hidden group shadow-inner">
//                      <div className="absolute top-0 right-0 w-32 h-32 bg-sage/20 rounded-full blur-3xl" />
//                      <div className="relative z-10 flex items-center justify-between">
//                        <div>
//                          <div className="text-xs text-white/50 font-bold uppercase tracking-wider mb-1">AI Compliance Engine</div>
//                          <div className="text-3xl font-display font-bold mb-2">99.8% <span className="text-sm font-normal text-white/60">Health</span></div>
//                        </div>
//                        <div className="w-16 h-16 rounded-full border-4 border-sage border-r-transparent flex items-center justify-center animate-spin" style={{ animationDuration: '3s' }}>
//                          <ShieldCheck className="w-6 h-6 text-sage animate-pulse-glow" />
//                        </div>
//                      </div>
//                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-medium">
//                        <span className="text-white/60">Scanning GST & ROC databases...</span>
//                        <span className="text-sage">Syncing</span>
//                      </div>
//                    </div>

//                    <div className="bg-ivory border border-charcoal/5 rounded-2xl p-4 shadow-sm relative group">
//                       <div className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider mb-2">Tasks</div>
//                       <div className="text-2xl font-display font-bold text-charcoal mb-4">4 <span className="text-xs font-medium text-charcoal/40">Pending</span></div>
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded-md border border-charcoal/5 shadow-sm text-xs">
//                           <span className="font-medium text-charcoal/80">Sign Board Res.</span>
//                           <div className="w-4 h-4 rounded-full border border-sage flex items-center justify-center bg-sage/10"><CheckSquare className="w-2.5 h-2.5 text-sage" /></div>
//                         </div>
//                         <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded-md border border-charcoal/5 shadow-sm text-xs opacity-60">
//                           <span className="font-medium text-charcoal/80">Upload PAN</span>
//                           <div className="w-4 h-4 rounded-full border border-charcoal/20"></div>
//                         </div>
//                       </div>
//                    </div>

//                    <div className="bg-ivory border border-charcoal/5 rounded-2xl p-4 shadow-sm relative">
//                       <div className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider mb-2">Live Logs</div>
//                       <div className="space-y-3 mt-3">
//                          <div className="flex gap-2 items-start">
//                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
//                            <div className="text-[11px] leading-tight font-medium text-charcoal/70">Trademark 'Acme' accepted by registry. <span className="text-charcoal/40 block mt-0.5">2m ago</span></div>
//                          </div>
//                          <div className="flex gap-2 items-start">
//                            <div className="w-1.5 h-1.5 rounded-full bg-amber mt-1.5 shrink-0" />
//                            <div className="text-[11px] leading-tight font-medium text-charcoal/70">GST filing queued for AI review. <span className="text-charcoal/40 block mt-0.5">14m ago</span></div>
//                          </div>
//                       </div>
//                    </div>
//                 </div>
//               </div>

//               {/* Floating Metric Pills */}
//               <motion.div
//                 animate={{ y: [0, -12, 0] }}
//                 transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
//                 className="absolute -top-6 -right-8 z-20 bg-white/95 backdrop-blur-2xl rounded-[1rem] p-3 shadow-premium border border-white/50 flex items-center gap-3"
//               >
//                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-inner">
//                   <Activity className="w-5 h-5 text-white" />
//                 </div>
//                 <div>
//                   <div className="text-[10px] text-charcoal/40 font-bold uppercase tracking-wider mb-0.5">Filing Speed</div>
//                   <div className="text-sm font-bold text-charcoal">10x Faster</div>
//                 </div>
//               </motion.div>

//               <motion.div
//                 animate={{ y: [0, 15, 0] }}
//                 transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
//                 className="absolute -bottom-8 -left-8 z-20 bg-charcoal/95 backdrop-blur-2xl rounded-[1rem] p-3 shadow-premium border border-white/10 flex items-center gap-3 text-white"
//               >
//                 <div className="w-10 h-10 rounded-xl bg-sage/20 border border-sage/30 flex items-center justify-center shadow-inner">
//                   <Sparkles className="w-5 h-5 text-sage" />
//                 </div>
//                 <div>
//                   <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">AI Engine</div>
//                   <div className="text-sm font-bold flex items-center gap-1.5">Processing <span className="flex gap-0.5"><span className="w-1 h-1 rounded-full bg-sage animate-bounce"></span><span className="w-1 h-1 rounded-full bg-sage animate-bounce" style={{animationDelay: "0.2s"}}></span><span className="w-1 h-1 rounded-full bg-sage animate-bounce" style={{animationDelay: "0.4s"}}></span></span></div>
//                 </div>
//               </motion.div>

//               {/* Background glow behind card */}
//               <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sage/20 via-transparent to-amber/20 rounded-[3rem] blur-[80px] scale-110 pointer-events-none" />
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* 2. SERVICES BENTO GRID */}
//       <section className="py-32 md:py-48 bg-white relative noise-overlay">
//         <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-ivory to-transparent pointer-events-none" />
//         <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-[1440px]">
//           <motion.div
//             initial="hidden"
//             whileInView="show"
//             viewport={{ once: true, margin: "-100px" }}
//             variants={STAGGER_CONTAINER}
//             className="text-center max-w-3xl mx-auto mb-20 md:mb-24"
//           >
//             <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage/10 border border-sage/15 mb-6 text-xs font-bold uppercase tracking-widest text-sage">
//               {bentoContent.badge_text || 'Platform Features'}
//             </motion.div>
//             <motion.h2 variants={FADE_UP} className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight text-charcoal">
//               {bentoSection?.title ? (
//                 <>
//                   {bentoSection.title.substring(0, bentoSection.title.indexOf('for') + 3)} <br className="hidden md:block"/><span className="text-sage italic pr-1">{bentoSection.title.substring(bentoSection.title.indexOf('for') + 4)}</span>
//                 </>
//               ) : (
//                 <>
//                   A unified system for <br className="hidden md:block"/><span className="text-sage italic pr-1">modern scale.</span>
//                 </>
//               )}
//             </motion.h2>
//             <motion.p variants={FADE_UP} className="text-charcoal/55 text-lg md:text-xl leading-relaxed text-balance">
//               {bentoSection?.subtitle || 'Eliminate disjointed portals. Vakeel unifies incorporation, tax, and IP into a single beautifully engineered workspace.'}
//             </motion.p>
//           </motion.div>

//           <motion.div 
//             initial="hidden"
//             whileInView="show"
//             viewport={{ once: true, margin: "-100px" }}
//             variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
//             className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1200px] mx-auto"
//           >
//             {/* Big Card */}
//             <motion.div 
//               variants={FADE_UP}
//               className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-ivory border border-charcoal/5 p-1 flex spotlight-wrapper"
//               onMouseMove={handleMouseMove}
//             >
//               <div className="relative z-10 bg-ivory w-full h-full rounded-[1.75rem] p-10 lg:p-14 flex flex-col justify-between overflow-hidden shadow-sm transition-shadow duration-500 hover:shadow-premium-hover">
//                 <div className="absolute top-0 right-0 p-8 opacity-[0.02] transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-1000 ease-out">
//                   <Building2 className="w-96 h-96" />
//                 </div>
//                 <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-br from-sage/[0.04] to-transparent pointer-events-none" />
                
//                 <div className="relative z-20">
//                   <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-[1.25rem] bg-white shadow-sm border border-sage/10 text-sage flex items-center justify-center mb-8 group-hover:shadow-md group-hover:border-sage/20 transition-all transition-spring">
//                     <Building2 className="w-7 h-7 lg:w-8 lg:h-8" />
//                   </div>
//                   <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 text-charcoal tracking-tight">Business Registration</h3>
//                   <p className="text-charcoal/60 max-w-md text-lg lg:text-xl leading-relaxed mb-10">Incorporate your Pvt Ltd, LLP, or OPC entirely online. Our AI flags documentation errors before ROC rejection.</p>
                  
//                   <ul className="grid sm:grid-cols-2 gap-4 mb-12">
//                     {['Private Limited Company', 'Limited Liability Partnership', 'One Person Company', 'Section 8 Company'].map(item => (
//                       <li key={item} className="flex items-center gap-3 font-semibold text-charcoal/80 bg-white/60 backdrop-blur-md px-4 py-3 rounded-xl border border-charcoal/5 shadow-sm">
//                         <div className="w-5 h-5 rounded-full bg-sage flex items-center justify-center shrink-0"><CheckCircle2 className="w-3 h-3 text-white" /></div>
//                         {item}
//                       </li>
//                     ))}
//                   </ul>
//                   <Button className="bg-charcoal text-white hover:bg-sage h-14 px-8 text-base shadow-premium transition-all transition-spring rounded-xl group/btn">
//                     Explore Registration <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
//                   </Button>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Small Card 1 */}
//             <motion.div 
//               variants={FADE_UP}
//               className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sage to-emerald-800 p-1 flex spotlight-wrapper"
//               onMouseMove={handleMouseMove}
//             >
//               <div className="relative z-10 w-full h-full rounded-[1.75rem] p-10 flex flex-col justify-between overflow-hidden shadow-premium text-white border border-white/10">
//                 <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-1000 ease-out">
//                   <TrendingUp className="w-64 h-64" />
//                 </div>
//                 <div className="relative z-20">
//                   <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-[1.25rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-8 ring-1 ring-white/10 shadow-inner">
//                     <TrendingUp className="w-7 h-7 lg:w-8 lg:h-8" />
//                   </div>
//                   <h3 className="text-3xl font-display font-bold mb-4 tracking-tight">GST & Tax</h3>
//                   <p className="text-white/70 mb-10 text-lg leading-relaxed">Automated filing, smart input tax credit tracking, and instant error checks.</p>
//                 </div>
//                 <Link href="#" className="relative z-20 inline-flex items-center text-sm font-bold bg-white text-sage px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all w-max group/link">
//                   View plans <ArrowRight className="ml-1.5 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
//                 </Link>
//               </div>
//             </motion.div>

//             {/* Small Card 2 */}
//             <motion.div 
//               variants={FADE_UP}
//               className="group relative overflow-hidden rounded-[2rem] bg-charcoal p-1 flex spotlight-wrapper"
//               onMouseMove={handleMouseMove}
//             >
//               <div className="relative z-10 w-full h-full rounded-[1.75rem] p-10 flex flex-col justify-between overflow-hidden shadow-premium text-white border border-white/5">
//                 <div className="absolute top-0 right-0 p-6 opacity-[0.03] transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-1000 ease-out">
//                   <Scale className="w-64 h-64 text-amber" />
//                 </div>
//                 <div className="relative z-20">
//                   <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner">
//                     <Scale className="w-7 h-7 lg:w-8 lg:h-8 text-amber" />
//                   </div>
//                   <h3 className="text-3xl font-display font-bold mb-4 tracking-tight">IP Protection</h3>
//                   <p className="text-white/60 mb-10 text-lg leading-relaxed">Protect your brand's identity, logos, and inventions globally in one click.</p>
//                 </div>
//                 <Link href="#" className="relative z-20 inline-flex items-center text-sm font-bold text-amber border border-amber/20 bg-amber/10 px-6 py-3.5 rounded-xl hover:bg-amber/20 transition-all w-max group/link">
//                   Protect brand <ArrowRight className="ml-1.5 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
//                 </Link>
//               </div>
//             </motion.div>

//             {/* Medium Card */}
//             <motion.div 
//               variants={FADE_UP}
//               className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-amber/[0.03] p-1 flex spotlight-wrapper"
//               onMouseMove={handleMouseMove}
//             >
//               <div className="relative z-10 w-full h-full rounded-[1.75rem] p-10 flex flex-col sm:flex-row gap-10 items-center justify-between overflow-hidden shadow-sm hover:shadow-premium border border-amber/15 bg-ivory/50">
//                 <div className="flex-1 relative z-20">
//                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber/10 border border-amber/20 text-[10px] font-bold uppercase tracking-widest text-amber mb-6 shadow-sm">
//                      Special Packages
//                    </div>
//                    <h3 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-charcoal tracking-tight">Startups & MSME</h3>
//                    <p className="text-charcoal/60 text-lg mb-8 leading-relaxed max-w-md">Discounted compliance bundles designed for fast-growing teams. From incorporation to DIPP recognition.</p>
//                    <Button variant="secondary" className="shadow-premium h-12 px-6 rounded-xl font-bold bg-white border border-charcoal/10 hover:bg-ivory hover:border-amber/30 transition-all text-charcoal">View Startup Bundles</Button>
//                 </div>
//                 <div className="w-full sm:w-[45%] flex gap-4 relative z-20">
//                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber/10 flex-1 relative overflow-hidden group-hover:border-amber/30 group-hover:shadow-md transition-all">
//                      <div className="text-xs text-charcoal/50 mb-2 font-bold uppercase tracking-wider">Avg Savings</div>
//                      <div className="text-4xl font-display font-bold text-charcoal">₹40k+</div>
//                    </div>
//                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber/10 flex-1 relative overflow-hidden group-hover:border-amber/30 group-hover:shadow-md transition-all">
//                      <div className="text-xs text-charcoal/50 mb-2 font-bold uppercase tracking-wider">Time Saved</div>
//                      <div className="text-4xl font-display font-bold text-charcoal">50hrs</div>
//                    </div>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* 3. HOW IT WORKS */}
//       <HowItWorks />

//       {/* 4. AI ASSISTANT SHOWCASE */}
//       <section className="py-32 md:py-48 bg-white text-charcoal relative overflow-hidden noise-overlay">
//         <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-charcoal/[0.02] to-transparent pointer-events-none z-0" />
//         <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-[1440px]">
//           <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 xl:gap-32">
            
//             <motion.div 
//               initial={{ opacity: 0, x: -40 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true, margin: "-100px" }}
//               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
//               className="flex-1 w-full relative order-2 lg:order-1"
//             >
//                {/* Deep glow */}
//                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-glow-sage -z-10 mix-blend-multiply" />
               
//                {/* Advanced AI Mockup */}
//                <div className="bg-white/95 backdrop-blur-3xl border border-charcoal/10 rounded-[2rem] p-5 shadow-premium-hover relative overflow-hidden ring-1 ring-charcoal/5">
//                   <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sage via-emerald-500 to-sage bg-[length:200%_auto] animate-shimmer"></div>
                  
//                   {/* Mockup Header */}
//                   <div className="flex items-center justify-between p-3 border-b border-charcoal/5 mb-5 bg-ivory rounded-xl">
//                     <div className="flex gap-2">
//                       <div className="w-3 h-3 rounded-full bg-red-400"></div>
//                       <div className="w-3 h-3 rounded-full bg-amber"></div>
//                       <div className="w-3 h-3 rounded-full bg-sage"></div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                        <ShieldCheck className="w-3.5 h-3.5 text-sage" />
//                        <div className="text-[11px] font-bold text-charcoal/40 uppercase tracking-widest">Encrypted Sandbox</div>
//                     </div>
//                   </div>
                  
//                   {/* Chat Content */}
//                   <div className="space-y-6 px-4 pb-4">
//                      <div className="flex gap-4 items-end">
//                        <div className="w-8 h-8 rounded-xl bg-charcoal/5 flex-shrink-0 flex items-center justify-center font-bold text-[10px] text-charcoal/50">USR</div>
//                        <div className="bg-ivory p-4 rounded-2xl rounded-bl-sm text-sm border border-charcoal/5 shadow-sm text-charcoal/80 leading-relaxed font-medium">
//                          Analyze the attached "Vendor_Agreement_Q3.pdf". Does it comply with our standard IP clauses?
//                        </div>
//                      </div>
                     
//                      <div className="flex gap-4 items-end flex-row-reverse">
//                        <div className="w-8 h-8 rounded-xl bg-charcoal flex-shrink-0 flex items-center justify-center font-bold text-[11px] text-white shadow-md">V</div>
//                        <div className="bg-sage/5 p-5 rounded-2xl rounded-br-sm text-sm border border-sage/10 text-charcoal shadow-sm leading-relaxed relative max-w-[85%]">
//                          <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-sage bg-white px-3 py-1.5 rounded-lg w-max shadow-sm border border-sage/10">
//                            <Activity className="w-3.5 h-3.5" /> Scan Complete in 1.2s
//                          </div>
//                          <p className="mb-4">I've analyzed the 42-page document. There is <strong className="text-red-500">1 critical deviation</strong> regarding IP assignment.</p>
                         
//                          <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm mb-4">
//                            <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Clause 7.2 (Found on Page 14)</p>
//                            <p className="text-sm font-mono text-charcoal/60 bg-red-50 p-2 rounded text-balance">"...vendor retains joint ownership of any custom algorithms developed during..."</p>
//                            <p className="text-xs font-bold text-sage mt-3">Recommendation: Rewrite to enforce sole ownership.</p>
//                          </div>

//                          <Button size="sm" className="w-full shadow-sm bg-sage hover:bg-emerald-700 text-white font-bold h-10">Auto-Rewrite Clause</Button>
//                        </div>
//                      </div>
//                   </div>
//                </div>

//                {/* Floating elements */}
//                <motion.div
//                  animate={{ y: [0, -10, 0] }}
//                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
//                  className="absolute -top-6 -right-6 z-20 bg-charcoal text-white rounded-2xl p-4 shadow-premium-hover border border-white/10"
//                >
//                  <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">Model</div>
//                  <div className="text-sm font-bold flex items-center gap-2">Legal-LLM v4 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span></div>
//                </motion.div>
//             </motion.div>

//             <motion.div 
//               initial={{ opacity: 0, x: 40 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true, margin: "-100px" }}
//               transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
//               className="flex-1 order-1 lg:order-2"
//             >
//               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage/10 border border-sage/20 mb-8 text-xs font-bold uppercase tracking-widest text-sage">
//                 <SparklesIcon className="w-3.5 h-3.5" /> {aiContent.badge_text || 'Intelligence Layer'}
//               </div>
//               <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6 leading-[1.08] text-charcoal tracking-tight">
//                 {aiSection?.title ? (
//                   <>
//                     {aiSection.title.split('Chief')[0]} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-sage to-emerald-600">Chief{aiSection.title.split('Chief')[1]}</span>
//                   </>
//                 ) : (
//                   <>Your 24/7 personal <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-sage to-emerald-600">Chief Legal Officer.</span></>
//                 )}
//               </h2>
//               <p className="text-charcoal/60 text-lg lg:text-xl xl:text-2xl mb-10 max-w-lg leading-relaxed font-medium">
//                 {aiSection?.subtitle || 'Upload massive contracts for instant plain-English summaries, get automated compliance reminders, and resolve complex tax queries in seconds.'}
//               </p>
              
//               <div className="space-y-6 mb-12">
//                 {[
//                   { title: 'Instant Document Analysis', desc: 'Summarizes 50-page contracts in seconds indicating red flags and IP risks.' },
//                   { title: 'Automated Compliance Calendar', desc: 'Predictive reminders sync directly to your dashboard preventing late fees.' },
//                   { title: 'Smart Scenario Modeling', desc: 'Calculate exact GST liability based on complex supply chains instantly.' }
//                 ].map(feature => (
//                   <div key={feature.title} className="flex gap-4 group">
//                     <div className="w-12 h-12 rounded-xl bg-sage/10 border border-sage/15 flex items-center justify-center shrink-0 group-hover:bg-sage group-hover:text-white group-hover:shadow-glow transition-all transition-spring text-sage">
//                       <CheckCircle2 className="w-6 h-6" />
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-charcoal text-lg mb-1">{feature.title}</h4>
//                       <p className="text-charcoal/55 leading-relaxed text-base">{feature.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               <Button className="bg-charcoal text-white hover:bg-sage shadow-premium-hover h-14 px-8 text-base transition-all transition-spring group rounded-xl">
//                 Try AI Assistant Free <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </motion.div>
            
//           </div>
//         </div>
//       </section>

//       {/* 5. TESTIMONIALS */}
//       <Testimonials testimonials={testimonials} />

//       {/* 6. FAQ SECTION */}
//       <FaqSection />

//       {/* 7. FINAL CTA */}
//       <section className="py-32 md:py-48 bg-charcoal text-white relative overflow-hidden rounded-t-[3rem] mt-4 noise-overlay">
//         {/* Extreme Cinematic glow */}
//         <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-sage/[0.08] rounded-full blur-[150px] pointer-events-none animate-pulse-glow mix-blend-screen" />
//         <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-amber/[0.06] rounded-full blur-[130px] pointer-events-none mix-blend-screen" />
        
//         {/* Dynamic Pattern */}
//         <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:64px_64px] pointer-events-none animate-dot-drift" />
        
//         <motion.div 
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true, margin: "-100px" }}
//           variants={STAGGER_CONTAINER}
//           className="container relative z-10 mx-auto px-4 text-center max-w-[1440px]"
//         >
//           <motion.div variants={FADE_UP} className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-[2rem] bg-gradient-to-br from-sage to-emerald-600 mb-10 shadow-glow ring-1 ring-white/20">
//             <TrendingUp className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
//           </motion.div>
//           <motion.h2 variants={FADE_UP} className="text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-display font-bold mb-8 tracking-tight drop-shadow-sm">
//             {ctaSection?.title ? (
//               <>
//                 {ctaSection.title.substring(0, ctaSection.title.lastIndexOf(' '))} <span className="text-sage italic pr-2">{ctaSection.title.substring(ctaSection.title.lastIndexOf(' '))}</span>
//               </>
//             ) : (
//               <>Ready to make it <span className="text-sage italic pr-2">official?</span></>
//             )}
//           </motion.h2>
//           <motion.p variants={FADE_UP} className="text-xl lg:text-2xl xl:text-3xl text-white/60 max-w-3xl mx-auto mb-14 text-balance leading-relaxed font-medium">
//             {ctaSection?.subtitle || 'Join 50,000+ ambitious founders who trust Vakeel to keep their businesses legally bulletproof.'}
//           </motion.p>
//           <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row justify-center gap-4 lg:gap-6">
//             <Link href={ctaContent.primary_cta_url || '/contact'} className="w-full sm:w-auto">
//               <Button size="lg" className="bg-white text-charcoal hover:bg-sage hover:text-white shadow-premium-hover h-16 lg:h-20 px-10 lg:px-12 text-lg font-bold w-full group rounded-[1.25rem] transition-all transition-spring">
//                 {ctaContent.primary_cta_text || 'Get Started Now'} <ArrowRight className="w-6 h-6 ml-2.5 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </Link>
//              <Link href={ctaContent.secondary_cta_url || '/contact'} className="w-full sm:w-auto">
//               <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-16 lg:h-20 px-10 lg:px-12 text-lg font-bold w-full rounded-[1.25rem] backdrop-blur-md">
//                 {ctaContent.secondary_cta_text || 'Schedule Consultation'}
//               </Button>
//             </Link>
//           </motion.div>
          
//           <motion.div variants={FADE_UP} className="mt-20 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-white/40 text-sm font-bold uppercase tracking-wider">
//              {(ctaContent.badges || ["No hidden fees", "100% online process", "Dedicated account manager"]).map((badge: string) => (
//                <div key={badge} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sage" /> {badge}</div>
//              ))}
//           </motion.div>
//         </motion.div>
//       </section>

//     </main>
//   );
// }

// function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
//       <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
//       <path d="M5 3v4" />
//       <path d="M19 17v4" />
//       <path d="M3 5h4" />
//       <path d="M17 19h4" />
//     </svg>
//   )
// }


'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Variants, motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  ArrowRight, ShieldCheck, Zap, Scale, Building2, CheckCircle2,
  TrendingUp, Activity, Globe, Server, CheckSquare, Sparkles, BarChart3
} from 'lucide-react';
import gsap from 'gsap';
import { FaqSection } from '@/components/home/FaqSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Testimonials } from '@/components/home/Testimonials';
import { supabase } from '@/lib/supabase';

// ─── Animation variants ───────────────────────────────────────────────────────
const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 50, damping: 20 } },
};
const STAGGER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

// ─── Animated counter ─────────────────────────────────────────────────────────
function useAnimatedCounter(target: number, duration = 2000) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  useEffect(() => {
    if (!isInView || !ref.current) return;
    
    let startTimestamp: number | null = null;
    let animationFrameId: number;
    const node = ref.current;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Use easeOut-like curve for smoother ending
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      node.textContent = Math.floor(easeProgress * target).toLocaleString();
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        node.textContent = target.toLocaleString();
      }
    };
    
    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, target, duration]);
  
  return ref;
}

// ─── Helper: get section by key ───────────────────────────────────────────────
function useSection(sections: any[], key: string) {
  const s = sections.find(s => s.section_key === key);
  return {
    title: s?.title ?? null,
    subtitle: s?.subtitle ?? null,
    content: s?.content ?? {},
    visible: s?.visible !== false,
  };
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function HomeClient({ sections }: { sections: any[] }) {

  // Read each section from DB
  const hero = useSection(sections, 'hero');
  const bento = useSection(sections, 'bento_features');
  const ai = useSection(sections, 'ai_assistant');
  const cta = useSection(sections, 'final_cta');

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const clientsRef = useAnimatedCounter(50000);

  const [testimonials, setTestimonials] = useState<any[]>([]);
  useEffect(() => {
    supabase.from('testimonials').select('*').order('rating', { ascending: false }).limit(3)
      .then(({ data }) => { if (data?.length) setTestimonials(data); });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.floating-blob', { y: 'random(-35,35)', x: 'random(-35,35)', rotation: 'random(-10,10)', duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: { amount: 3, from: 'random' } });
      gsap.to('.floating-card', { y: 'random(-15,15)', rotation: 'random(-3,3)', duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: { amount: 2, from: 'random' } });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  // CMS-driven values with fallbacks
  const heroTitle = hero.title ?? 'Compliance. Automated by AI.';
  const heroSubtitle = hero.subtitle ?? 'Everything your startup needs to launch, scale, and stay compliant.';
  const heroBadge = hero.content.badge ?? 'Vakeel AI OS 2.0 Live';
  const heroPrimaryCta = hero.content.primaryButtonText ?? 'Start Your Business';
  const heroPrimaryUrl = hero.content.primaryButtonUrl ?? '/services/business-registration';
  const heroSecondaryCta = hero.content.secondaryButtonText ?? 'Talk to an Expert';
  const heroSecondaryUrl = hero.content.secondaryButtonUrl ?? '/contact';

  const bentoTitle = bento.title ?? 'A unified system for modern scale.';
  const bentoSubtitle = bento.subtitle ?? 'Eliminate disjointed portals. Vakeel unifies incorporation, tax, and IP into one workspace.';
  const bentoBadge = bento.content.badge ?? 'Platform Features';

  const aiTitle = ai.title ?? 'Your 24/7 personal Chief Legal Officer.';
  const aiSubtitle = ai.subtitle ?? 'Upload massive contracts for instant plain-English summaries.';
  const aiBadge = ai.content.badge ?? 'Intelligence Layer';

  const ctaTitle = cta.title ?? 'Ready to make it official?';
  const ctaSubtitle = cta.subtitle ?? 'Join 50,000+ ambitious founders who trust Vakeel.';
  const ctaPrimaryCta = cta.content.primaryButtonText ?? 'Get Started Now';
  const ctaPrimaryUrl = cta.content.primaryButtonUrl ?? '/contact';
  const ctaSecondaryCta = cta.content.secondaryButtonText ?? 'Schedule Consultation';
  const ctaSecondaryUrl = cta.content.secondaryButtonUrl ?? '/contact';
  const ctaBadges = cta.content.badges ?? ['No hidden fees', '100% online process', 'Dedicated account manager'];

  return (
    <main className="min-h-screen overflow-hidden selection:bg-sage/30 selection:text-sage">

      {/* ── 1. HERO ── */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center pt-8 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-ivory noise-overlay">
          <motion.div style={{ y, opacity, scale }} className="w-full h-full">
            <div className="absolute inset-0 gradient-mesh opacity-70" />
            <div className="absolute top-1/4 -left-1/4 w-[1000px] h-[1000px] rounded-full bg-sage/[0.08] blur-[150px] floating-blob mix-blend-multiply" />
            <div className="absolute top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-amber/[0.06] blur-[130px] floating-blob mix-blend-multiply" />
            <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full bg-emerald-600/[0.04] blur-[100px] floating-blob mix-blend-multiply" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8C8C8515_1px,transparent_1px),linear-gradient(to_bottom,#8C8C8515_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_60%,transparent_100%)]" />
          </motion.div>
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-[1440px]">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-24">

            {/* Left: Content */}
            <motion.div initial="hidden" animate="show" variants={STAGGER}
              className="flex-1 max-w-2xl flex flex-col items-center lg:items-start text-center lg:text-left">

              <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium shadow-premium mb-8 border-sage/15 text-sage font-bold text-xs uppercase tracking-widest">
                <span className="relative flex h-2.5 w-2.5 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sage" />
                </span>
                {heroBadge}
              </motion.div>

              <motion.h1 variants={FADE_UP}
                className="text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[72px] xl:text-[84px] font-display font-bold leading-[1.05] tracking-tight mb-6 text-charcoal drop-shadow-sm">
                {heroTitle.includes('.') ? (
                  <>
                    {heroTitle.split('.')[0]}.{' '}
                    <span className="relative whitespace-nowrap block mt-1">
                      <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-sage via-emerald-600 to-sage animate-shimmer bg-[length:200%_auto]">
                        {heroTitle.substring(heroTitle.indexOf('.') + 1).trim()}
                      </span>
                    </span>
                  </>
                ) : heroTitle}
              </motion.h1>

              <motion.p variants={FADE_UP}
                className="text-base sm:text-lg md:text-xl xl:text-2xl text-charcoal/65 max-w-xl mb-10 text-balance leading-relaxed font-medium">
                {heroSubtitle}
              </motion.p>

              <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                <Link href={heroPrimaryUrl} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-14 px-8 text-base shadow-premium-hover bg-charcoal hover:bg-sage text-white transition-all transition-spring transform hover:-translate-y-1 group border border-charcoal/20">
                    {heroPrimaryCta} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href={heroSecondaryUrl} className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full h-14 px-8 text-base glass-premium shadow-premium border-charcoal/10 hover:bg-white hover:border-sage/30 transition-all transition-spring hover:-translate-y-1">
                    {heroSecondaryCta}
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={FADE_UP} className="mt-14 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-sm font-semibold text-charcoal/50 uppercase tracking-wider">
                <div className="flex items-center gap-2.5"><ShieldCheck className="w-5 h-5 text-sage" /> SOC2 Compliant</div>
                <div className="flex items-center gap-2.5"><CheckCircle2 className="w-5 h-5 text-sage" /> <span ref={clientsRef}>0</span>+ Founders</div>
              </motion.div>
            </motion.div>

            {/* Right: Dashboard preview (static - design unchanged) */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 w-full max-w-lg lg:max-w-2xl relative hidden md:block"
            >
              <div className="relative z-10 bg-white/95 backdrop-blur-3xl rounded-[2rem] border border-charcoal/10 shadow-premium p-6 floating-card ring-1 ring-charcoal/5">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-charcoal/[0.06]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-sage/10 text-sage flex items-center justify-center font-bold font-display shadow-inner border border-sage/20">V</div>
                    <div>
                      <div className="text-sm font-bold text-charcoal">Acme Corp Dashboard</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-semibold text-charcoal/40 uppercase tracking-widest">All systems nominal</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-ivory border border-charcoal/5 flex items-center justify-center"><Globe className="w-4 h-4 text-charcoal/40" /></div>
                    <div className="w-8 h-8 rounded-full bg-ivory border border-charcoal/5 flex items-center justify-center"><Server className="w-4 h-4 text-charcoal/40" /></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 bg-gradient-to-br from-charcoal to-emerald-950 rounded-2xl p-5 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sage/20 rounded-full blur-3xl" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-white/50 font-bold uppercase tracking-wider mb-1">AI Compliance Engine</div>
                        <div className="text-3xl font-display font-bold mb-2">99.8% <span className="text-sm font-normal text-white/60">Health</span></div>
                      </div>
                      <div className="w-16 h-16 rounded-full border-4 border-sage border-r-transparent flex items-center justify-center animate-spin" style={{ animationDuration: '3s' }}>
                        <ShieldCheck className="w-6 h-6 text-sage animate-pulse-glow" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-medium">
                      <span className="text-white/60">Scanning GST & ROC databases...</span>
                      <span className="text-sage">Syncing</span>
                    </div>
                  </div>
                  <div className="bg-ivory border border-charcoal/5 rounded-2xl p-4 shadow-sm">
                    <div className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider mb-2">Tasks</div>
                    <div className="text-2xl font-display font-bold text-charcoal mb-4">4 <span className="text-xs font-medium text-charcoal/40">Pending</span></div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded-md border border-charcoal/5 shadow-sm text-xs">
                        <span className="font-medium text-charcoal/80">Sign Board Res.</span>
                        <div className="w-4 h-4 rounded-full border border-sage flex items-center justify-center bg-sage/10"><CheckSquare className="w-2.5 h-2.5 text-sage" /></div>
                      </div>
                      <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded-md border border-charcoal/5 shadow-sm text-xs opacity-60">
                        <span className="font-medium text-charcoal/80">Upload PAN</span>
                        <div className="w-4 h-4 rounded-full border border-charcoal/20" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-ivory border border-charcoal/5 rounded-2xl p-4 shadow-sm">
                    <div className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider mb-2">Live Logs</div>
                    <div className="space-y-3 mt-3">
                      <div className="flex gap-2 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <div className="text-[11px] leading-tight font-medium text-charcoal/70">Trademark accepted. <span className="text-charcoal/40 block mt-0.5">2m ago</span></div>
                      </div>
                      <div className="flex gap-2 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber mt-1.5 shrink-0" />
                        <div className="text-[11px] leading-tight font-medium text-charcoal/70">GST filing queued. <span className="text-charcoal/40 block mt-0.5">14m ago</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-8 z-20 bg-white/95 backdrop-blur-2xl rounded-[1rem] p-3 shadow-premium border border-white/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-inner">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] text-charcoal/40 font-bold uppercase tracking-wider mb-0.5">Filing Speed</div>
                  <div className="text-sm font-bold text-charcoal">10x Faster</div>
                </div>
              </motion.div>
              <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-8 -left-8 z-20 bg-charcoal/95 backdrop-blur-2xl rounded-[1rem] p-3 shadow-premium border border-white/10 flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-xl bg-sage/20 border border-sage/30 flex items-center justify-center shadow-inner">
                  <Sparkles className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-0.5">AI Engine</div>
                  <div className="text-sm font-bold flex items-center gap-1.5">Processing <span className="flex gap-0.5"><span className="w-1 h-1 rounded-full bg-sage animate-bounce" /><span className="w-1 h-1 rounded-full bg-sage animate-bounce" style={{ animationDelay: '0.2s' }} /><span className="w-1 h-1 rounded-full bg-sage animate-bounce" style={{ animationDelay: '0.4s' }} /></span></div>
                </div>
              </motion.div>
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sage/20 via-transparent to-amber/20 rounded-[3rem] blur-[80px] scale-110 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. BENTO GRID (design unchanged, titles from CMS) ── */}
      <section className="py-32 md:py-48 bg-white relative noise-overlay">
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-ivory to-transparent pointer-events-none" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-[1440px]">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={STAGGER}
            className="text-center max-w-3xl mx-auto mb-20 md:mb-24">
            <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sage/10 border border-sage/15 mb-6 text-xs font-bold uppercase tracking-widest text-sage">
              {bentoBadge}
            </motion.div>
            <motion.h2 variants={FADE_UP} className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight text-charcoal">
              {bentoTitle.includes('for') ? (
                <>{bentoTitle.substring(0, bentoTitle.indexOf('for') + 3)} <br className="hidden md:block" /><span className="text-sage italic pr-1">{bentoTitle.substring(bentoTitle.indexOf('for') + 4)}</span></>
              ) : bentoTitle}
            </motion.h2>
            <motion.p variants={FADE_UP} className="text-charcoal/55 text-lg md:text-xl leading-relaxed text-balance">{bentoSubtitle}</motion.p>
          </motion.div>

          {/* Bento cards - design 100% unchanged */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1200px] mx-auto">
            <motion.div variants={FADE_UP} className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-ivory border border-charcoal/5 p-1 flex spotlight-wrapper" onMouseMove={handleMouseMove}>
              <div className="relative z-10 bg-ivory w-full h-full rounded-[1.75rem] p-10 lg:p-14 flex flex-col justify-between overflow-hidden shadow-sm transition-shadow duration-500 hover:shadow-premium-hover">
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-1000 ease-out"><Building2 className="w-96 h-96" /></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-br from-sage/[0.04] to-transparent pointer-events-none" />
                <div className="relative z-20">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-[1.25rem] bg-white shadow-sm border border-sage/10 text-sage flex items-center justify-center mb-8 group-hover:shadow-md group-hover:border-sage/20 transition-all transition-spring">
                    <Building2 className="w-7 h-7 lg:w-8 lg:h-8" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 text-charcoal tracking-tight">Business Registration</h3>
                  <p className="text-charcoal/60 max-w-md text-lg lg:text-xl leading-relaxed mb-10">Incorporate your Pvt Ltd, LLP, or OPC entirely online. Our AI flags documentation errors before ROC rejection.</p>
                  <ul className="grid sm:grid-cols-2 gap-4 mb-12">
                    {['Private Limited Company', 'Limited Liability Partnership', 'One Person Company', 'Section 8 Company'].map(item => (
                      <li key={item} className="flex items-center gap-3 font-semibold text-charcoal/80 bg-white/60 backdrop-blur-md px-4 py-3 rounded-xl border border-charcoal/5 shadow-sm">
                        <div className="w-5 h-5 rounded-full bg-sage flex items-center justify-center shrink-0"><CheckCircle2 className="w-3 h-3 text-white" /></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="bg-charcoal text-white hover:bg-sage h-14 px-8 text-base shadow-premium transition-all transition-spring rounded-xl group/btn">
                    Explore Registration <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
            <motion.div variants={FADE_UP} className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sage to-emerald-800 p-1 flex spotlight-wrapper" onMouseMove={handleMouseMove}>
              <div className="relative z-10 w-full h-full rounded-[1.75rem] p-10 flex flex-col justify-between overflow-hidden shadow-premium text-white border border-white/10">
                <div className="relative z-20">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-[1.25rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-8 ring-1 ring-white/10 shadow-inner"><TrendingUp className="w-7 h-7 lg:w-8 lg:h-8" /></div>
                  <h3 className="text-3xl font-display font-bold mb-4 tracking-tight">GST & Tax</h3>
                  <p className="text-white/70 mb-10 text-lg leading-relaxed">Automated filing, smart input tax credit tracking, and instant error checks.</p>
                </div>
                <Link href="#" className="relative z-20 inline-flex items-center text-sm font-bold bg-white text-sage px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all w-max group/link">
                  View plans <ArrowRight className="ml-1.5 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
            <motion.div variants={FADE_UP} className="group relative overflow-hidden rounded-[2rem] bg-charcoal p-1 flex spotlight-wrapper" onMouseMove={handleMouseMove}>
              <div className="relative z-10 w-full h-full rounded-[1.75rem] p-10 flex flex-col justify-between overflow-hidden shadow-premium text-white border border-white/5">
                <div className="relative z-20">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner"><Scale className="w-7 h-7 lg:w-8 lg:h-8 text-amber" /></div>
                  <h3 className="text-3xl font-display font-bold mb-4 tracking-tight">IP Protection</h3>
                  <p className="text-white/60 mb-10 text-lg leading-relaxed">Protect your brand&apos;s identity, logos, and inventions globally in one click.</p>
                </div>
                <Link href="#" className="relative z-20 inline-flex items-center text-sm font-bold text-amber border border-amber/20 bg-amber/10 px-6 py-3.5 rounded-xl hover:bg-amber/20 transition-all w-max group/link">
                  Protect brand <ArrowRight className="ml-1.5 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
            <motion.div variants={FADE_UP} className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-amber/[0.03] p-1 flex spotlight-wrapper" onMouseMove={handleMouseMove}>
              <div className="relative z-10 w-full h-full rounded-[1.75rem] p-10 flex flex-col sm:flex-row gap-10 items-center justify-between overflow-hidden shadow-sm hover:shadow-premium border border-amber/15 bg-ivory/50">
                <div className="flex-1 relative z-20">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber/10 border border-amber/20 text-[10px] font-bold uppercase tracking-widest text-amber mb-6 shadow-sm">Special Packages</div>
                  <h3 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-charcoal tracking-tight">Startups & MSME</h3>
                  <p className="text-charcoal/60 text-lg mb-8 leading-relaxed max-w-md">Discounted compliance bundles designed for fast-growing teams.</p>
                  <Button variant="secondary" className="shadow-premium h-12 px-6 rounded-xl font-bold bg-white border border-charcoal/10 hover:bg-ivory hover:border-amber/30 transition-all text-charcoal">View Startup Bundles</Button>
                </div>
                <div className="w-full sm:w-[45%] flex gap-4 relative z-20">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber/10 flex-1 group-hover:border-amber/30 group-hover:shadow-md transition-all">
                    <div className="text-xs text-charcoal/50 mb-2 font-bold uppercase tracking-wider">Avg Savings</div>
                    <div className="text-4xl font-display font-bold text-charcoal">₹40k+</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber/10 flex-1 group-hover:border-amber/30 group-hover:shadow-md transition-all">
                    <div className="text-xs text-charcoal/50 mb-2 font-bold uppercase tracking-wider">Time Saved</div>
                    <div className="text-4xl font-display font-bold text-charcoal">50hrs</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ── */}
      <HowItWorks />

      {/* ── 4. TESTIMONIALS ── */}
      <Testimonials testimonials={testimonials} />

      {/* ── 5. FAQ ── */}
      <FaqSection />

      {/* ── 6. FINAL CTA (titles from CMS) ── */}
      <section className="py-32 md:py-48 bg-charcoal text-white relative overflow-hidden rounded-t-[3rem] mt-4 noise-overlay">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-sage/[0.08] rounded-full blur-[150px] pointer-events-none animate-pulse-glow mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-amber/[0.06] rounded-full blur-[130px] pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[size:64px_64px] pointer-events-none" />
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={STAGGER}
          className="container relative z-10 mx-auto px-4 text-center max-w-[1440px]">
          <motion.div variants={FADE_UP} className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-[2rem] bg-gradient-to-br from-sage to-emerald-600 mb-10 shadow-glow ring-1 ring-white/20">
            <TrendingUp className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
          </motion.div>
          <motion.h2 variants={FADE_UP} className="text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-display font-bold mb-8 tracking-tight drop-shadow-sm">
            {ctaTitle.includes(' ') ? (
              <>{ctaTitle.substring(0, ctaTitle.lastIndexOf(' '))} <span className="text-sage italic pr-2">{ctaTitle.substring(ctaTitle.lastIndexOf(' '))}</span></>
            ) : ctaTitle}
          </motion.h2>
          <motion.p variants={FADE_UP} className="text-xl lg:text-2xl xl:text-3xl text-white/60 max-w-3xl mx-auto mb-14 text-balance leading-relaxed font-medium">
            {ctaSubtitle}
          </motion.p>
          <motion.div variants={FADE_UP} className="flex flex-col sm:flex-row justify-center gap-4 lg:gap-6">
            <Link href={ctaPrimaryUrl} className="w-full sm:w-auto">
              <Button size="lg" className="bg-white text-charcoal hover:bg-sage hover:text-white shadow-premium-hover h-16 lg:h-20 px-10 lg:px-12 text-lg font-bold w-full group rounded-[1.25rem] transition-all transition-spring">
                {ctaPrimaryCta} <ArrowRight className="w-6 h-6 ml-2.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href={ctaSecondaryUrl} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-16 lg:h-20 px-10 lg:px-12 text-lg font-bold w-full rounded-[1.25rem] backdrop-blur-md">
                {ctaSecondaryCta}
              </Button>
            </Link>
          </motion.div>
          <motion.div variants={FADE_UP} className="mt-20 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-white/40 text-sm font-bold uppercase tracking-wider">
            {ctaBadges.map((badge: string) => (
              <div key={badge} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-sage" /> {badge}</div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}