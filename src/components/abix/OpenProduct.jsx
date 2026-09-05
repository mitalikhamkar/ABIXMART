import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { openProductTabs, RITUAL_IMAGE } from '@/data/products';

// Interactive product knowledge experience — explore, don't read a wall of text.
export default function OpenProduct() {
  const [active, setActive] = useState('source');
  const tab = openProductTabs.find((t) => t.key === active);

  return (
    <section id="open-product" className="bg-ivory py-24 lg:py-36 border-t border-greendark/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl mb-14 lg:mb-20">
          <span className="text-[11px] font-medium uppercase tracking-luxe-sm text-gold">Open the product</span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl text-greendark leading-[1.02] tracking-tight">
            Know what you're buying.
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          {/* Tabs as a vertical list */}
          <div className="lg:col-span-5 flex flex-col">
            {openProductTabs.map((t) => {
              const on = t.key === active;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={`group text-left py-7 border-b border-greendark/15 transition-colors duration-300 ${
                    on ? 'text-greendark' : 'text-foreground/40 hover:text-greendark/70'
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-3xl lg:text-4xl leading-tight">{t.label}</span>
                    <span className={`text-2xl transition-transform duration-300 ${on ? 'translate-x-1 text-gold' : 'opacity-0 group-hover:opacity-60'}`}>→</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Reveal panel */}
          <div className="lg:col-span-7">
            <div className="relative h-full min-h-[420px] bg-greendark overflow-hidden grain">
              <img
                src={RITUAL_IMAGE}
                alt="Daily ritual"
                className="absolute inset-0 h-full w-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-greendark via-greendark/70 to-greendark/40" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12"
                >
                  <span className="text-[11px] uppercase tracking-luxe-sm text-gold">{tab.label}</span>
                  <h3 className="mt-4 font-display text-3xl lg:text-4xl text-ivory leading-tight">{tab.title}</h3>
                  <p className="mt-4 text-ivory/80 text-lg leading-relaxed max-w-md">{tab.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}