import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { upcomingProducts } from '@/data/products';

// Discovery/anticipation — a quiet charcoal surface, no green mist wash.
// The "not yet" state is communicated by restraint (muted stone tiles),
// not by a decorative fog image.
export default function WhatsGrowingNext() {
  const [submitted, setSubmitted] = useState({});

  const handleSubmit = (e, name) => {
    e.preventDefault();
    setSubmitted((s) => ({ ...s, [name]: true }));
  };

  return (
    <section id="growing" className="relative bg-charcoal py-24 lg:py-36 overflow-hidden grain">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl mb-14 lg:mb-20">
          <span className="font-grotesk text-[11px] font-medium uppercase tracking-luxe-sm text-gold-light">What's Next</span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.02] tracking-tight">
            What's growing next.
          </h2>
          <p className="mt-6 text-ivory/70 text-lg leading-relaxed max-w-lg">
            More Ayurvedic wellness, crafted with the same patience. Be the first to know when they land.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {upcomingProducts.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="group relative bg-ivory/5 border border-ivory/15 backdrop-blur-sm p-7 flex flex-col hover:bg-ivory/10 transition-colors duration-500"
            >
              <div className="h-40 mb-6 overflow-hidden">
                <div className="h-full w-full bg-gradient-to-br from-stone-dark/50 to-charcoal flex items-center justify-center">
                  <span className="font-display text-6xl text-ivory/25 italic">{p.name[0]}</span>
                </div>
              </div>
              <span className="font-grotesk text-[10px] uppercase tracking-luxe-sm text-gold-light">{p.status}</span>
              <h3 className="mt-2 font-display text-2xl text-ivory">{p.name}</h3>
              <p className="mt-1 text-sm text-ivory/60 leading-relaxed">{p.note}</p>

              <div className="mt-5 pt-5 border-t border-ivory/10">
                <AnimatePresence mode="wait">
                  {submitted[p.name] ? (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 text-gold text-sm"
                    >
                      <Check size={16} /> You're on the list.
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      exit={{ opacity: 0 }}
                      onSubmit={(e) => handleSubmit(e, p.name)}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="email"
                        required
                        placeholder="Email"
                        className="flex-1 min-w-0 bg-transparent border-b border-ivory/30 text-ivory placeholder:text-ivory/40 text-sm py-2 focus:outline-none focus:border-gold transition-colors"
                      />
                      <button
                        type="submit"
                        className="font-grotesk text-[10px] uppercase tracking-luxe-sm text-gold-light hover:text-ivory transition-colors whitespace-nowrap"
                      >
                        Notify me →
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}