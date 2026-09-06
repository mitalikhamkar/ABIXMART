import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { trustPillars, featuredProduct, HERO_PRODUCT_IMAGE } from '@/data/products';

/**
 * "Meet the Resin" — the ONE section answering origin/process/quality/how-
 * to-use, told once, via a precise tabbed reveal rather than three
 * separate sections repeating the same four facts (the old ProductStory +
 * WhyAbixmart + OpenProduct). Personality: precise, product-focused —
 * quiet hover-driven tab switching, no scroll-triggered stagger, no green
 * fill, no leaf/mist imagery. The product itself sits still, in focus, the
 * whole time — it is the one constant while the facts around it change.
 */
const TABS = [
  ...trustPillars.map((p) => ({ key: p.key, label: p.label, title: p.title, body: p.body })),
  { key: 'use', label: 'How to Use', title: 'A simple daily ritual', body: featuredProduct.howToUse.join(' ') },
];

export default function MeetTheResin() {
  const [active, setActive] = useState(TABS[0].key);
  const tab = TABS.find((t) => t.key === active);

  return (
    <section id="meet-the-resin" className="bg-ivory py-24 lg:py-32 border-t border-stone/15">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-xl mb-14 lg:mb-16">
          <span className="block font-grotesk text-[11px] font-medium uppercase tracking-luxe-sm text-resin">
            Meet the Resin
          </span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-greendark leading-[1.02] tracking-tight">
            One jar. No shortcuts.
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
          {/* Product — quiet, still, in focus the entire time */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 h-[360px] lg:h-[460px] bg-stone/10 flex items-center justify-center overflow-hidden">
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[12%] w-[45%] h-[8%] rounded-full bg-charcoal/15 blur-2xl" />
              <img
                src={HERO_PRODUCT_IMAGE}
                alt={`${featuredProduct.name} ${featuredProduct.subtitle}`}
                className="relative w-[52%] h-auto object-contain"
                style={{ filter: 'drop-shadow(0 20px 26px rgba(20,15,10,0.2))' }}
              />
            </div>
          </div>

          {/* Precise tabbed facts */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-stone/20 pb-5">
              {TABS.map((t) => {
                const on = t.key === active;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActive(t.key)}
                    className={`font-grotesk text-[11px] uppercase tracking-luxe-sm pb-2 border-b-2 transition-colors duration-300 ${
                      on ? 'text-greendark border-resin' : 'text-foreground/40 border-transparent hover:text-foreground/70'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-9 min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="font-display text-3xl lg:text-4xl text-greendark leading-tight">{tab.title}</h3>
                  <p className="mt-5 text-foreground/65 text-lg leading-relaxed max-w-lg">{tab.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}