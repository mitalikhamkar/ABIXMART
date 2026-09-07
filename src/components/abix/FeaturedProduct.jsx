import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Minus, Plus } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { featuredProduct, HERO_PRODUCT_IMAGE } from '@/data/products';
import { useShop } from '@/lib/ShopContext';

// Warm-dark dominant surface (espresso), matching the tonal handoff from
// DailyRitual above it. Ivory is used only selectively: the product plinth
// (contrast for the dark jar) and as text color — never as the section fill.
export default function FeaturedProduct() {
  const { openCheckout } = useShop();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const p = featuredProduct;

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = () => {
    openCheckout({ name: `${p.name} — ${p.subtitle}`, jars: qty, price: p.price * qty });
  };

  return (
    <section id="featured" className="bg-espresso py-24 lg:py-36 border-t border-ivory/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image — selective ivory plinth for contrast against the dark jar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-ivory flex items-center justify-center">
              <img
                src={HERO_PRODUCT_IMAGE}
                alt={`${p.name} ${p.subtitle}`}
                className="w-[70%] h-auto object-contain"
                style={{ filter: 'drop-shadow(0 20px 26px rgba(20,15,10,0.25))' }}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-charcoal/10" />
            </div>
            {/* floating seal — resin accent pops against the dark section */}
            <div className="absolute -bottom-6 -right-2 lg:-right-6 h-28 w-28 lg:h-32 lg:w-32 rounded-full bg-resin text-ivory flex flex-col items-center justify-center text-center shadow-xl">
              <span className="font-price text-3xl lg:text-4xl leading-none">{p.currency}{p.price}</span>
              <span className="font-grotesk text-[9px] uppercase tracking-luxe-sm mt-1 opacity-80">{p.size}</span>
            </div>
          </motion.div>

          {/* Details */}
          <div>
            <Eyebrow light>What's Inside the Jar</Eyebrow>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-[56px] text-ivory leading-[1.02] tracking-tight">
              {p.name}
            </h2>
            <p className="mt-2 font-display text-2xl lg:text-3xl italic text-gold-light">{p.subtitle}</p>

            <p className="mt-7 text-ivory/70 text-lg leading-relaxed max-w-md">{p.description}</p>

            {/* facts */}
            <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-5 max-w-md">
              {p.facts.map((f) => (
                <div key={f.label} className="border-t border-ivory/15 pt-3">
                  <dt className="font-grotesk text-[10px] uppercase tracking-luxe-sm text-ivory/45">{f.label}</dt>
                  <dd className="mt-1 font-display text-lg text-ivory">{f.value}</dd>
                </div>
              ))}
            </dl>

            {/* quantity + actions */}
            <div className="mt-10 flex items-center gap-5">
              <div className="inline-flex items-center border border-ivory/25 h-14">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-full w-12 inline-flex items-center justify-center text-ivory hover:bg-ivory/10 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-price text-xl text-ivory">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="h-full w-12 inline-flex items-center justify-center text-ivory hover:bg-ivory/10 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="font-price text-2xl text-ivory">{p.currency}{p.price * qty}</span>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                className="group inline-flex items-center justify-center h-14 px-8 border border-ivory text-ivory text-[12px] font-semibold tracking-luxe-sm uppercase rounded-none hover:bg-ivory hover:text-espresso transition-colors duration-300"
              >
                {added ? 'Added to ritual' : 'Add to cart'}
                {added && <Check size={16} className="ml-2" />}
              </button>
              <Link
                to="/shop/shilajit"
                className="group inline-flex items-center justify-center h-14 px-8 bg-resin text-ivory text-[12px] font-semibold tracking-luxe-sm uppercase rounded-none hover:bg-gold-light hover:text-charcoal transition-colors duration-300"
              >
                View product
                <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}