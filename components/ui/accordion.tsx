'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

export function AccordionItem({ question, answer, isOpen, onClick }: AccordionItemProps) {
  return (
    <div className="border border-warm-gray/20 bg-white rounded-2xl mb-4 overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-sage/40">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between p-6 text-left transition-colors focus:outline-none"
      >
        <span className="font-display text-lg font-semibold text-charcoal pr-4">{question}</span>
        <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center bg-sage/10 text-sage transition-transform duration-300 shrink-0",
            isOpen && "rotate-180 bg-sage text-white"
          )}>
          <ChevronDown className="h-5 w-5" />
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-0 text-charcoal/70 xl:text-lg leading-relaxed text-balance">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
