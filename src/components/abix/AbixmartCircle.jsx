import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const benefits = ['Early Access', 'New Launches', 'Wellness Stories', 'Special Offers'];

// Editorial masthead-style community section — not a popup form card.
export default function AbixmartCircle() {
  const [done, setDone] = useState(false);

  return (
    <section className="bg-ivory py-24 lg:py-36 border-t border-greendark/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-6">
            <span className="text-[11px] font-medium uppercase tracking-luxe-sm text-gold">The ABIXMART Circle</span>
            <h2 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl text-greendark leading-[0.98] tracking-tight">
              Join the<br /><span className="italic text-gold">Circle.</span>
            </h2>
            <p className="mt-7 text-foreground/65 text-lg leading-relaxed max-w-md">
              Be first to discover new products, wellness stories, launches and special offers.
              A small circle — for those who care where their wellness comes from.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 max-w-md">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  <span className="text-sm tracking-wide text-greendark">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-greendark text-ivory p-10 lg:p-14 grain">
              {done ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="h-16 w-16 rounded-full border border-gold flex items-center justify-center mb-6">
                    <Check size={28} className="text-gold" />
                  </div>
                  <h3 className="font-display text-3xl">You're in.</h3>
                  <p className="mt-3 text-ivory/70 max-w-xs">
                    Welcome to the Circle. We'll be in touch when there's something worth sharing.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onSubmit={(e) => { e.preventDefault(); setDone(true); }}
                >
                  <span className="text-[10px] uppercase tracking-luxe-sm text-gold">No noise. Only the good stuff.</span>
                  <h3 className="mt-4 font-display text-3xl lg:text-4xl leading-tight">
                    Join the Circle
                  </h3>
                  <div className="mt-8 space-y-5">
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full bg-transparent border-b border-ivory/30 py-3 text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold transition-colors"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      className="w-full bg-transparent border-b border-ivory/30 py-3 text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="group mt-9 w-full h-14 inline-flex items-center justify-center bg-ivory text-greendark text-[12px] font-semibold tracking-luxe-sm uppercase hover:bg-gold transition-colors duration-300"
                  >
                    Join the Circle
                    <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </motion.form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}