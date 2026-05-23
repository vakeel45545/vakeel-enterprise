'use client';

import { motion, Variants } from 'framer-motion';
import { ArrowRight, Star, Quote, BadgeCheck } from 'lucide-react';
import Image from 'next/image';

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 50, damping: 20 } },
};

const FALLBACK_TESTIMONIALS = [
  {
    client_name: 'Rahul Sharma',
    company: 'TechFlow AI',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop&crop=face',
    review: 'We registered our entire startup via Vakeel. The AI categorized our IP correctly, filed our LLP, and got our GST done in 8 days. Pure magic.',
    rating: 5,
  },
  {
    client_name: 'Priya Desai',
    company: 'UrbanDwell',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80&auto=format&fit=crop&crop=face',
    review: 'The compliance dashboard is incredible. I never have to worry about missing an ROC deadline. It acts like a silent co-founder.',
    rating: 5,
  },
  {
    client_name: 'Vikram Singh',
    company: 'Nexus Logistics',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80&auto=format&fit=crop&crop=face',
    review: 'Traditional CAs took weeks to respond. The experts on Vakeel platform resolve our queries in minutes. Their tech infrastructure is unmatched in India.',
    rating: 5,
  }
];

interface TestimonialItem {
  client_name: string;
  company: string | null;
  image: string | null;
  review: string;
  rating: number | null;
}

interface TestimonialsProps {
  testimonials?: TestimonialItem[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const items = (testimonials && testimonials.length > 0) ? testimonials : FALLBACK_TESTIMONIALS;
  // Mouse tracking for spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section className="py-32 md:py-40 bg-ivory relative overflow-hidden">
      {/* Background treatment */}
      <div className="absolute top-1/2 left-0 w-full h-[500px] bg-gradient-to-r from-sage/[0.04] via-amber/[0.04] to-sage/[0.04] -skew-y-3 -translate-y-1/2 pointer-events-none mix-blend-multiply" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sage/[0.05] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-[1440px]">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 lg:mb-20 gap-8"
        >
          <motion.div variants={FADE_UP} className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-tight mb-5 lg:mb-6 text-charcoal tracking-tight">
              Trusted by operators building <br className="hidden md:block"/>tomorrow&apos;s unicorns.
            </h2>
            <p className="text-lg lg:text-xl text-charcoal/60 font-medium">Don&apos;t just take our word for it. Hear from founders who scaled with us.</p>
          </motion.div>
          
          <motion.div variants={FADE_UP} className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div className="flex items-center gap-1 bg-white px-4 py-2 rounded-2xl shadow-sm border border-charcoal/5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 lg:w-6 lg:h-6 fill-amber text-amber" />
              ))}
              <span className="font-bold ml-2 text-charcoal text-base lg:text-lg">4.9/5</span>
            </div>
            <span className="font-medium text-charcoal/50 text-sm">Based on 2,000+ Reviews</span>
          </motion.div>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-[1200px] mx-auto"
        >
          {items.map((col, idx) => (
            <motion.div 
              key={idx}
              variants={FADE_UP}
              className="spotlight-wrapper rounded-[2rem] p-1 bg-white shadow-sm border border-charcoal/5 group hover:shadow-premium-hover transition-all duration-700 hover:-translate-y-2 flex"
              onMouseMove={handleMouseMove}
            >
              <div className="bg-white rounded-[1.75rem] p-8 lg:p-10 relative flex flex-col w-full h-full">
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-[1.75rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-sage/[0.04] to-transparent pointer-events-none" />
                
                <div className="absolute top-8 right-8 text-sage/[0.08] group-hover:text-sage/[0.15] transition-colors duration-500">
                  <Quote className="w-12 h-12 lg:w-16 lg:h-16" />
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1 mb-6 relative z-10">
                  {[...Array(col.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber text-amber" />
                  ))}
                </div>
                
                <p className="text-lg lg:text-xl text-charcoal/80 leading-relaxed mb-8 lg:mb-10 relative z-10 font-medium">&quot;{col.review}&quot;</p>
                
                <div className="mt-auto pt-6 lg:pt-8 border-t border-charcoal/5 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden bg-charcoal/5 ring-4 ring-ivory shadow-sm shrink-0">
                      <Image src={col.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80&auto=format&fit=crop&crop=face'} alt={col.client_name} width={56} height={56} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <h4 className="font-bold text-charcoal text-base flex items-center gap-1.5">
                        {col.client_name}
                        <BadgeCheck className="w-4 h-4 text-emerald-500" />
                      </h4>
                      <p className="text-sm text-charcoal/50 font-medium">{col.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
