import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

// Reusable FAQ accordion.
export default function FAQAccordion({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-greendark/10 border-y border-greendark/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between gap-6 py-6 text-left group"
            >
              <span className={`font-display text-xl lg:text-2xl transition-colors ${isOpen ? 'text-gold' : 'text-greendark group-hover:text-gold'}`}>
                {item.q}
              </span>
              <span className="shrink-0 h-9 w-9 inline-flex items-center justify-center border border-greendark/20 text-greendark group-hover:border-gold transition-colors">
                {isOpen ? <Minus size={16} /> : <Plus size={16} />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-7 pr-12 text-foreground/65 leading-relaxed">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}