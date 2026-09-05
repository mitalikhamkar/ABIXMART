import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Minus, Plus } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { featuredProduct, PRODUCT_IMAGE } from '@/data/products';
import { useShop } from '@/lib/ShopContext';

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
    <section id="featured" className="bg-ivory py-24 lg:py-36 border-t border-greendark/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image — layered composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-sand">
              <img
                src={PRODUCT_IMAGE}
                alt={`${p.name} ${p.subtitle}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-greendark/10" />
            </div>
            {/* floating seal */}
            <div className="absolute -bottom-6 -right-2 lg:-right-6 h-28 w-28 lg:h-32 lg:w-32 rounded-full bg-greendark text-ivory flex flex-col items-center justify-center text-center shadow-xl">
              <span className="font-display text-3xl lg:text-4xl leading-none">{p.currency}{p.price}</span>
              <span className="text-[9px] uppercase tracking-luxe-sm mt-1 opacity-70">{p.size}</span>
            </div>
          </motion.div>

          {/* Details */}
          <div>
            <Eyebrow>Featured</Eyebrow>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-[56px] text-greendark leading-[1.02] tracking-tight">
              {p.name}
            </h2>
            <p className="mt-2 font-display text-2xl lg:text-3xl italic text-gold">{p.subtitle}</p>

            <p className="mt-7 text-foreground/70 text-lg leading-relaxed max-w-md">{p.description}</p>

            {/* facts */}
            <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-5 max-w-md">
              {p.facts.map((f) => (
                <div key={f.label} className="border-t border-greendark/15 pt-3">
                  <dt className="text-[10px] uppercase tracking-luxe-sm text-foreground/45">{f.label}</dt>
                  <dd className="mt-1 font-display text-lg text-greendark">{f.value}</dd>
                </div>
              ))}
            </dl>

            {/* how to use */}
            <div className="mt-9">
              <span className="text-[10px] uppercase tracking-luxe-sm text-foreground/45">How to use</span>
              <ul className="mt-3 space-y-2">
                {p.howToUse.map((h) => (
                  <li key={h} className="flex gap-3 text-sm text-foreground/75 leading-relaxed">
                    <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* quantity + actions */}
            <div className="mt-10 flex items-center gap-5">
              <div className="inline-flex items-center border border-greendark/25 h-14">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-full w-12 inline-flex items-center justify-center text-greendark hover:bg-sand transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-display text-xl text-greendark">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="h-full w-12 inline-flex items-center justify-center text-greendark hover:bg-sand transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="font-display text-2xl text-greendark">{p.currency}{p.price * qty}</span>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                className="group inline-flex items-center justify-center h-14 px-8 border border-greendark text-greendark text-[12px] font-semibold tracking-luxe-sm uppercase rounded-none hover:bg-greendark hover:text-ivory transition-colors duration-300"
              >
                {added ? 'Added to ritual' : 'Add to cart'}
                {added && <Check size={16} className="ml-2" />}
              </button>
              <Link
                to="/shop/shilajit"
                className="group inline-flex items-center justify-center h-14 px-8 bg-greendark text-ivory text-[12px] font-semibold tracking-luxe-sm uppercase rounded-none hover:bg-gold hover:text-greendark transition-colors duration-300"
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