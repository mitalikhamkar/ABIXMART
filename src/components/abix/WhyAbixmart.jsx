import React from 'react';
import { motion } from 'framer-motion';
import { whyAbixmart } from '@/data/products';

// Sophisticated trust section — minimal symbols, not icon-card overload.
const symbols = ['⛰', '❋', '◆', '○', '✦'];

export default function WhyAbixmart() {
  return (
    <section id="why" className="bg-sand py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="text-[11px] font-medium uppercase tracking-luxe-sm text-gold">Why ABIXMART</span>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl text-greendark leading-[1.02] tracking-tight">
              Only what we can stand behind.
            </h2>
            <p className="mt-6 text-foreground/65 text-lg leading-relaxed max-w-sm">
              We don't trade in claims we can't verify. We trade in origin, process, and care.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="grid sm:grid-cols-2 gap-px bg-greendark/10">
              {whyAbixmart.map((w, i) => (
                <motion.div
                  key={w.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.07 }}
                  className="bg-sand p-8 lg:p-10 flex gap-5 items-start group hover:bg-ivory transition-colors duration-500"
                >
                  <span className="font-display text-3xl text-gold/70 leading-none mt-1 group-hover:text-gold transition-colors duration-500">
                    {symbols[i % symbols.length]}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl text-greendark leading-tight">{w.title}</h3>
                    <p className="mt-2 text-foreground/60 leading-relaxed">{w.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}