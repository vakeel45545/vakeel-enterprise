'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AccordionItem } from '@/components/ui/accordion';
import { motion, Variants } from 'framer-motion';

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 25, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: "spring", stiffness: 50, damping: 20 } },
};

// Fallback data in case Supabase is not configured yet
const FALLBACK_FAQS = [
  { id: '1', question: 'How long does it take to register a Private Limited Company?', answer: 'Typically, it takes 7-10 working days, subject to ROC processing times and document accuracy. Our automated system ensures applications are filed without errors to avoid delays.' },
  { id: '2', question: 'Do I need to be physically present for the registration?', answer: 'No, the entire process is 100% online. We handle all documentation, signatures, and submissions digitally through our secure portal.' },
  { id: '3', question: 'What are the charges for GST Registration?', answer: 'Our GST registration plans start at ₹1,499. The package includes consultation, document filing, and your GST certificate. Please check the pricing page for detailed inclusions.' },
  { id: '4', question: 'Can Vakeel AI help me choose the right business structure?', answer: 'Yes! Our AI assistant will analyze your vision, funding goals, and scale to recommend whether an LLP, Pvt Ltd, or OPC is best for you.' },
  { id: '5', question: 'Is my data secure with Vakeel?', answer: 'Absolutely. We use bank-grade encryption and secure infrastructure to ensure your business documents and personal data are strictly protected.' },
];

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>('1'); // Open first by default
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);

  useEffect(() => {
    async function fetchFaqs() {
      try {
        // Attempt to fetch global FAQs (service_slug is null)
        const { data, error } = await supabase
          .from('faqs')
          .select('*')
          .is('service_slug', null)
          .order('created_at', { ascending: true })
          .limit(6);
          
        if (data && data.length > 0) {
          setFaqs(data as any);
          setOpenId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch FAQs, using fallback.", err);
      }
    }
    fetchFaqs();
  }, []);

  return (
    <section className="py-24 lg:py-28 bg-ivory relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-glow-sage pointer-events-none opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-[1440px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-3xl mx-auto text-center mb-12 lg:mb-16"
        >
          <motion.h2 variants={FADE_UP} className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 lg:mb-6 tracking-tight">
            Got Questions? <span className="text-sage">We have answers.</span>
          </motion.h2>
          <motion.p variants={FADE_UP} className="text-charcoal/55 text-base lg:text-lg">
            Everything you need to know about our services and how we can help your business grow.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="max-w-3xl mx-auto"
        >
          {faqs.map((faq) => (
            <motion.div key={faq.id} variants={FADE_UP}>
              <AccordionItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openId === faq.id}
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
