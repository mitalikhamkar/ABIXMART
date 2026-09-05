import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageTransition from '@/components/abix/PageTransition';
import ProductCard from '@/components/abix/ProductCard';
import ComingSoonCard from '@/components/abix/ComingSoonCard';
import Eyebrow from '@/components/abix/Eyebrow';
import { availableProducts, upcomingProductsList, categories, ritualBundles } from '@/data/products';
import { useShop } from '@/lib/ShopContext';

export default function Shop() {
  const [activeCat, setActiveCat] = useState('all');
  const { openCheckout } = useShop();

  const available = availableProducts();
  const upcoming = upcomingProductsList();
  const filtered = activeCat === 'all' ? available : available.filter((p) => p.category === activeCat);

  return (
    <PageTransition>
      {/* Shop hero — sand */}
      <section className="bg-sand pt-28 lg:pt-36 pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Eyebrow tone="moss">The Shop</Eyebrow>
          <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl text-greendark leading-[1] tracking-tight">
            Explore ABIXMART
          </h1>
          <p className="mt-6 max-w-xl text-foreground/65 text-lg leading-relaxed">
            Himalayan Shilajit, crafted with patience — and more Ayurvedic wellness on the way.
            Take your time. Understand the source before you choose.
          </p>
        </div>
      </section>

      {/* Categories + available products — ivory */}
      <section className="bg-ivory py-16 lg:py-24 border-t border-greendark/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-wrap items-center gap-3 mb-12">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCat(c.key)}
                className={`h-11 px-5 text-[12px] font-medium tracking-luxe-sm uppercase border transition-colors duration-300 ${
                  activeCat === c.key
                    ? 'bg-greendark text-ivory border-greendark'
                    : 'border-greendark/20 text-greendark hover:border-greendark'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-foreground/50 text-sm">No products in this category yet — check back soon.</p>
          )}
        </div>
      </section>

      {/* Coming soon — sand */}
      <section id="coming-soon" className="bg-sand py-16 lg:py-24 border-t border-greendark/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-12 max-w-2xl">
            <Eyebrow tone="moss">The Garden Ahead</Eyebrow>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl text-greendark leading-[1.02] tracking-tight">
              Coming soon
            </h2>
            <p className="mt-4 text-foreground/60 leading-relaxed">
              More Ayurvedic wellness, crafted with the same patience. Be the first to know when they land.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {upcoming.map((p, i) => (
              <ComingSoonCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Bundles / offers — ivory */}
      <section id="bundles" className="bg-ivory py-16 lg:py-24 border-t border-greendark/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Eyebrow className="justify-center">Start your ritual</Eyebrow>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl text-greendark leading-[1.02] tracking-tight">
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
                  b.highlight ? 'bg-greendark text-ivory' : 'bg-sand text-greendark'
                }`}
              >
                {b.highlight && (
                  <span className="absolute top-6 right-6 text-[9px] uppercase tracking-luxe-sm text-gold">Most chosen</span>
                )}
                <span className={`font-display text-6xl leading-none ${b.highlight ? 'text-ivory/25' : 'text-greendark/15'}`}>
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
                    b.highlight ? 'bg-ivory text-greendark hover:bg-gold' : 'bg-greendark text-ivory hover:bg-gold hover:text-greendark'
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
    </PageTransition>
  );
}