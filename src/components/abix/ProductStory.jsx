import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { HERO_PRODUCT_IMAGE, trustPillars, featuredProduct } from '@/data/products';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * "The ABIXMART Standard" — compact, static, editorial section answering
 * "why choose this product", once ShilajitStory has already answered "how
 * it's made". No scroll-pin, no giant height, no green wash, no reused
 * manufacturing imagery — a plain in-flow section on warm ivory/sand.
 */
export default function ProductStory() {
  return (
    <section id="standard" className="bg-sand/40 py-24 lg:py-32 border-t border-greendark/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
          >
            <span className="text-[11px] font-medium uppercase tracking-luxe-sm text-gold">
              The ABIXMART Standard
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-greendark leading-[1.02] tracking-tight text-balance">
              Why choose ABIXMART
            </h2>
            <p className="mt-5 text-foreground/65 text-lg leading-relaxed max-w-lg">
              Once you know how it's made, here's what it actually means for you.
            </p>

            <dl className="mt-10 space-y-7 max-w-xl">
              {trustPillars.map((pillar) => (
                <div key={pillar.key} className="border-t border-greendark/15 pt-5">
                  <dt className="flex items-baseline gap-3">
                    <span className="text-[10px] uppercase tracking-luxe-sm text-gold shrink-0">
                      {pillar.label}
                    </span>
                    <span className="font-display text-xl lg:text-2xl text-greendark">
                      {pillar.title}
                    </span>
                  </dt>
                  <dd className="mt-2 text-foreground/65 text-base leading-relaxed">{pillar.body}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <span className="text-[10px] uppercase tracking-luxe-sm text-foreground/45">
                How to use
              </span>
              <ul className="mt-3 space-y-2 max-w-md">
                {featuredProduct.howToUse.map((h) => (
                  <li key={h} className="flex gap-3 text-sm text-foreground/75 leading-relaxed">
                    <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <Link
                to="/shop/shilajit"
                className="group inline-flex items-center justify-center h-14 px-8 bg-greendark text-ivory text-[12px] font-semibold tracking-luxe-sm uppercase rounded-none hover:bg-gold hover:text-greendark transition-colors duration-300"
              >
                Explore the Product
                <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </motion.div>

          {/* Product — quiet, editorial, no manufacturing imagery */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full aspect-[4/5] bg-ivory flex items-center justify-center overflow-hidden">
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[10%] w-[55%] h-[10%] rounded-full bg-black/15 blur-2xl" />
              <img
                src={HERO_PRODUCT_IMAGE}
                alt={`${featuredProduct.name} ${featuredProduct.subtitle}`}
                className="relative w-[58%] h-auto object-contain"
                style={{ filter: 'drop-shadow(0 24px 30px rgba(0,0,0,0.22))' }}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-greendark/10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}