import React from 'react';
import { motion } from 'framer-motion';
import { ritualBundles } from '@/data/products';
import { useShop } from '@/lib/ShopContext';

export default function RitualOffers() {
  const { openCheckout } = useShop();

  return (
    <section id="offers" className="bg-sand py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-20">
          <span className="font-grotesk text-[11px] font-medium uppercase tracking-luxe-sm text-resin">Start your ritual</span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl text-greendark leading-[1.02] tracking-tight">
            Choose your rhythm.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-8 items-stretch">
          {ritualBundles.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className={`relative flex flex-col p-8 lg:p-10 transition-colors duration-500 ${
                b.highlight ? 'bg-greendark text-ivory' : 'bg-ivory text-greendark'
              }`}
            >
              {b.highlight && (
                <span className="absolute top-6 right-6 font-grotesk text-[9px] uppercase tracking-luxe-sm text-gold-light">
                  Most chosen
                </span>
              )}
              <span className={`font-grotesk text-6xl font-medium leading-none ${b.highlight ? 'text-ivory/25' : 'text-greendark/15'}`}>
                0{i + 1}
              </span>
              <h3 className="mt-6 font-display text-3xl">{b.name}</h3>
              <p className={`mt-2 text-sm ${b.highlight ? 'text-ivory/70' : 'text-foreground/60'}`}>{b.detail}</p>

              <div className="mt-8 flex items-baseline gap-3">
                <span className="font-price text-4xl">₹{b.price}</span>
                <span className={`text-xs ${b.highlight ? 'text-ivory/60' : 'text-foreground/50'}`}>{b.note}</span>
              </div>

              <button
                onClick={() => openCheckout({ name: `${b.name} — Shilajit Pure Resin`, jars: b.jars, price: b.price })}
                className={`group mt-8 h-14 inline-flex items-center justify-center text-[12px] font-semibold tracking-luxe-sm uppercase transition-colors duration-300 ${
                  b.highlight
                    ? 'bg-ivory text-greendark hover:bg-gold'
                    : 'bg-greendark text-ivory hover:bg-gold hover:text-greendark'
                }`}
              >
                Start this ritual
                <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-foreground/40 max-w-lg mx-auto">
          Promotional pricing shown is representative. No fabricated urgency — choose what fits your practice.
        </p>
      </div>
    </section>
  );
}