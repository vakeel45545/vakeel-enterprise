'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useRef } from 'react';

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 35, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 50, damping: 20 } },
};

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  const steps = [
    {
      title: 'Consult & Connect',
      description: 'Answer 5 simple questions. Our AI assigns the perfect legal expert to your case instantly.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop',
    },
    {
      title: 'Automated Documentation',
      description: 'Upload basics. We auto-fill forms, draft agreements, and eliminate 90% of paperwork.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop',
    },
    {
      title: 'Instant Filing',
      description: 'Your documents are securely encrypted, signed digitally, and filed directly with government APIs.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80&auto=format&fit=crop',
    },
    {
      title: 'Compliance Dashboard',
      description: 'Get your certificates. Enjoy ongoing automated reminders for taxes, renewals, and board meetings.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80&auto=format&fit=crop',
    }
  ];

  // Mouse tracking for spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section className="py-32 md:py-48 bg-charcoal text-white relative overflow-hidden noise-overlay">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-[900px] h-[900px] bg-sage/[0.08] rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-emerald-500/[0.05] rounded-full blur-[130px] pointer-events-none mix-blend-screen" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
      
      {/* Top section connector */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none z-0" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-[1440px]">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="max-w-3xl mb-24 lg:mb-32"
        >
          <motion.div variants={FADE_UP} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 text-sage font-bold text-xs uppercase tracking-widest backdrop-blur-md shadow-premium">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sage"></span>
            </span>
            Zero friction process
          </motion.div>
          <motion.h2 variants={FADE_UP} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.05] tracking-tight mb-8 drop-shadow-sm">
            We replaced months of paperwork with <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage to-emerald-400 block mt-2">minutes of logic.</span>
          </motion.h2>
          <motion.p variants={FADE_UP} className="text-lg lg:text-xl xl:text-2xl text-white/50 text-balance leading-relaxed max-w-2xl font-medium">
            No endless emails. No scanning physical documents. Welcome to the future of corporate compliance.
          </motion.p>
        </motion.div>

        <div className="relative max-w-6xl" ref={containerRef}>
          {/* Vertical connection line (background) */}
          <div className="absolute left-4 md:left-[35px] top-4 bottom-4 w-[2px] bg-white/[0.05] md:block hidden rounded-full" />
          
          {/* Vertical connection line (animated fill) */}
          <motion.div 
             className="absolute left-4 md:left-[35px] top-4 w-[2px] bg-gradient-to-b from-sage via-emerald-400 to-sage md:block hidden rounded-full shadow-[0_0_15px_rgba(74,124,89,0.5)] z-0" 
             style={{ height: lineHeight, originY: 0 }}
          />
          
          <div className="space-y-20 md:space-y-32 lg:space-y-40 relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col md:flex-row gap-10 md:gap-16 lg:gap-24 items-center relative group"
              >
                {/* Step number indicator */}
                <div className="hidden md:flex absolute left-[36px] -translate-x-1/2 w-12 h-12 rounded-2xl bg-charcoal border border-white/10 items-center justify-center font-display font-bold text-white/50 z-10 shadow-premium group-hover:bg-sage group-hover:text-white group-hover:border-sage group-hover:shadow-glow transition-all duration-500 transition-spring">
                  {idx + 1}
                </div>

                <div className={`flex-1 md:pl-28 ${idx % 2 === 1 ? 'md:order-2 md:pl-0 md:pr-28' : ''}`}>
                   <div className="md:hidden w-12 h-12 rounded-2xl bg-sage/15 border border-sage/25 flex items-center justify-center font-display font-bold text-sage mb-6 shadow-glow">
                     {idx + 1}
                   </div>
                   <h3 className="text-3xl lg:text-4xl xl:text-5xl font-display font-bold mb-4 lg:mb-6 tracking-tight">{step.title}</h3>
                   <p className="text-white/50 text-lg lg:text-xl leading-relaxed mb-8 lg:mb-10 max-w-md font-medium">{step.description}</p>
                   {idx === steps.length - 1 && (
                      <Button className="bg-white text-charcoal shadow-premium-hover h-14 lg:h-16 px-8 lg:px-10 group/btn rounded-xl font-bold text-base transition-all transition-spring hover:bg-sage hover:text-white">
                        Experience it yourself <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                   )}
                </div>
                
                <div className={`flex-1 w-full ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div 
                    className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-premium aspect-[4/3] group-hover:border-sage/30 transition-all duration-700 spotlight-wrapper bg-white/5 p-1"
                    onMouseMove={handleMouseMove}
                  >
                     <div className="relative w-full h-full rounded-[1.75rem] overflow-hidden">
                       <Image 
                         src={step.image} 
                         alt={step.title} 
                         fill 
                         className="object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-1000 ease-out mix-blend-luminosity group-hover:mix-blend-normal"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
                       
                       {/* Premium image overlay */}
                       <div className="absolute inset-0 bg-gradient-to-br from-sage/[0.1] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                       <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-white/20 rounded-[1.75rem] z-20 transition-colors duration-700" />
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom section connector */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ivory/[0.02] to-transparent pointer-events-none z-0" />
    </section>
  );
}
