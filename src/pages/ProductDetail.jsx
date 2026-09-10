// src/pages/ProductDetail.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Minus, Plus, ArrowLeft, Heart, ChevronDown } from 'lucide-react';
import PageTransition from '@/components/abix/PageTransition';
import Eyebrow from '@/components/abix/Eyebrow';
import ShopCollectionCard from '@/components/abix/ShopCollectionCard';
import MountainToRitual from '@/components/abix/MountainToRitual';
import { getProductBySlug, products, productBenefits, ritualBundles, faqs } from '@/data/products';
import { useShop } from '@/lib/ShopContext';

const INK = '#151417';
const GRAPHITE = '#1E1C1F';
const STONE_SURFACE = '#211E1F';
const IVORY = '#F2ECE2';
const MUTED = '#A79C8D';
const AMBER = '#D3A467';
const AMBER_FILL = '#BE8A4B';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const { addToCart, toggleWishlist, isInWishlist, openCheckout } = useShop();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  if (!product || product.status === 'coming_soon') {
    return (
      <PageTransition>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6" style={{ background: INK }}>
          <p className="font-display text-3xl text-[#F2ECE2]">This product isn't available yet.</p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center justify-center h-12 px-7 border border-[#F2ECE2]/40 text-[#F2ECE2] text-[12px] font-semibold tracking-luxe-sm uppercase hover:bg-[#F2ECE2] hover:text-[#151417] transition-colors duration-300"
          >
            Back to shop
          </Link>
        </div>
      </PageTransition>
    );
  }

  const related = products.filter((p) => p.id !== product.id && p.status === 'available');
  const usageSteps = product.howToUse || [];
  const stepTitles = ['Measure', 'Dissolve', 'Stir', 'Make it a ritual'];

  const handleAdd = () => {
    addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <PageTransition>
      {/* ============ HERO ============ */}
      <section className="pt-24 lg:pt-32 pb-16 lg:pb-24" style={{ background: INK }}>
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
            style={{ color: `${MUTED}` }}
            onMouseEnter={(e) => (e.currentTarget.style.color = IVORY)}
            onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
          >
            <ArrowLeft size={16} /> Back to shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Info */}
            <div className="order-2 lg:order-1">
              <Eyebrow light>The Signature Ritual</Eyebrow>
              <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-[56px] text-[#F2ECE2] leading-[1.02] tracking-tight">
                {product.name}
              </h1>
              <p className="mt-2 font-display text-2xl lg:text-3xl italic" style={{ color: AMBER }}>
                {product.subtitle}
              </p>
              <p className="mt-7 text-lg leading-relaxed max-w-md" style={{ color: `${IVORY}B3` }}>
                {product.description}
              </p>

              <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-5 max-w-md">
                {product.facts.map((f) => (
                  <div key={f.label} className="border-t pt-3" style={{ borderColor: `${IVORY}1F` }}>
                    <dt className="label-meta" style={{ color: MUTED }}>{f.label}</dt>
                    <dd className="mt-1 font-display text-lg text-[#F2ECE2]">{f.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Bundle options */}
              <div className="mt-9">
                <span className="label-meta" style={{ color: MUTED }}>Bundle options</span>
                <div className="mt-3 space-y-2">
                  {ritualBundles.map((b) => {
                    const active = qty === b.jars;
                    return (
                      <button
                        key={b.name}
                        onClick={() => setQty(b.jars)}
                        className="w-full flex items-center justify-between p-4 border transition-colors"
                        style={{
                          borderColor: active ? IVORY : `${IVORY}30`,
                          background: active ? `${IVORY}0D` : 'transparent',
                        }}
                      >
                        <span className="text-left">
                          <span className="font-display text-lg text-[#F2ECE2]">{b.name}</span>
                          <span className="block text-xs" style={{ color: MUTED }}>{b.note}</span>
                        </span>
                        <span className="font-price text-xl text-[#F2ECE2]">₹{b.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity + price */}
              <div className="mt-8 flex items-center gap-5">
                <div className="inline-flex items-center border h-14" style={{ borderColor: `${IVORY}30` }}>
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="h-full w-12 inline-flex items-center justify-center text-[#F2ECE2] hover:bg-white/5 transition-colors"
                    aria-label="Decrease"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-price text-xl text-[#F2ECE2]">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="h-full w-12 inline-flex items-center justify-center text-[#F2ECE2] hover:bg-white/5 transition-colors"
                    aria-label="Increase"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="font-price text-3xl text-[#F2ECE2]">
                  {product.currency}
                  {product.price * qty}
                </span>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="ml-auto h-14 w-14 inline-flex items-center justify-center border transition-colors"
                  style={{ borderColor: `${IVORY}30`, color: isInWishlist(product.id) ? AMBER : IVORY }}
                  aria-label="Wishlist"
                >
                  <Heart size={20} className={isInWishlist(product.id) ? 'fill-current' : ''} />
                </button>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAdd}
                  className="group inline-flex items-center justify-center h-14 px-8 border border-[#F2ECE2]/60 text-[#F2ECE2] text-[12px] font-semibold tracking-luxe-sm uppercase hover:bg-[#F2ECE2] hover:text-[#151417] transition-colors duration-300"
                >
                  {added ? 'Added to ritual' : 'Add to cart'}
                  {added && <Check size={16} className="ml-2" />}
                </button>
                <button
                  onClick={() =>
                    openCheckout({ name: `${product.name} — ${product.subtitle}`, jars: qty, price: product.price * qty })
                  }
                  className="group inline-flex items-center justify-center h-14 px-8 text-[#151417] text-[12px] font-semibold tracking-luxe-sm uppercase transition-colors duration-300"
                  style={{ background: AMBER_FILL }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = AMBER)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = AMBER_FILL)}
                >
                  Buy now
                  <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="order-1 lg:order-2 relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden" style={{ background: GRAPHITE }}>
                <img src={product.shopImage} alt={product.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 ring-1 ring-inset" style={{ boxShadow: `inset 0 0 0 1px ${IVORY}1A` }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ WHAT IS SHILAJIT ============ */}
      <section className="py-16 lg:py-24 border-t" style={{ background: GRAPHITE, borderColor: `${IVORY}0D` }}>
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <Eyebrow light>What is Shilajit?</Eyebrow>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl text-[#F2ECE2] leading-[1.05] tracking-tight">
            A resin formed by the mountain, over centuries.
          </h2>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: `${IVORY}B3` }}>
            Shilajit is a natural resin that forms slowly in the rocks of the high Himalayas. Traditionally
            gathered by hand and purified before use, it has long been part of Ayurvedic daily-wellness
            practice. ABIXMART sources it from high-altitude Himalayan rock and carries it through a
            traditional purification process, so it arrives as a simple, considered daily ritual — not a
            manufactured supplement.
          </p>
        </div>
      </section>

      {/* ============ MOUNTAIN → RITUAL ============ */}
      <MountainToRitual />

      {/* ============ HOW TO USE ============ */}
      <section className="py-16 lg:py-24 border-t" style={{ background: INK, borderColor: `${IVORY}0D` }}>
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="max-w-xl mb-12 lg:mb-16">
            <Eyebrow light>How to use</Eyebrow>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl text-[#F2ECE2] leading-[1.05] tracking-tight">
              A simple daily ritual.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {usageSteps.map((step, i) => (
              <div key={i} className="border-t pt-5" style={{ borderColor: `${IVORY}1F` }}>
                <span className="font-display text-3xl" style={{ color: AMBER }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-display text-xl text-[#F2ECE2]">{stepTitles[i] || 'Ritual'}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BENEFITS ============ */}
      <section className="py-16 lg:py-24 border-t" style={{ background: GRAPHITE, borderColor: `${IVORY}0D` }}>
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="max-w-xl mb-12 lg:mb-16">
            <Eyebrow light>Why people choose Shilajit</Eyebrow>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl text-[#F2ECE2] leading-[1.05] tracking-tight">
              Everyday wellness, considered.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {productBenefits.map((b) => (
              <div key={b.key}>
                <h3 className="font-display text-xl text-[#F2ECE2]">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: MUTED }}>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRODUCT DETAILS ============ */}
      <section className="py-16 lg:py-24 border-t" style={{ background: INK, borderColor: `${IVORY}0D` }}>
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <div className="max-w-xl mb-10">
            <Eyebrow light>Product Details</Eyebrow>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl text-[#F2ECE2] leading-[1.05] tracking-tight">
              What's in the jar.
            </h2>
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8">
            {product.facts.map((f) => (
              <div key={f.label} className="border-t pt-4" style={{ borderColor: `${IVORY}1F` }}>
                <dt className="label-meta" style={{ color: MUTED }}>{f.label}</dt>
                <dd className="mt-1.5 font-display text-lg text-[#F2ECE2]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-16 lg:py-24 border-t" style={{ background: GRAPHITE, borderColor: `${IVORY}0D` }}>
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <div className="max-w-xl mb-10">
            <Eyebrow light>FAQ</Eyebrow>
            <h2 className="mt-5 font-display text-3xl sm:text-4xl text-[#F2ECE2] leading-[1.05] tracking-tight">
              Common questions.
            </h2>
          </div>
          <div>
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="border-t" style={{ borderColor: `${IVORY}1F` }}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left"
                  >
                    <span className="font-display text-lg text-[#F2ECE2] pr-6">{f.q}</span>
                    <ChevronDown
                      size={18}
                      className="shrink-0 transition-transform duration-300"
                      style={{ color: MUTED, transform: open ? 'rotate(180deg)' : 'none' }}
                    />
                  </button>
                  {open && (
                    <p className="pb-5 text-sm leading-relaxed max-w-2xl" style={{ color: MUTED }}>
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ RELATED ============ */}
      {related.length > 0 && (
        <section className="py-16 lg:py-24 border-t" style={{ background: INK, borderColor: `${IVORY}0D` }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 className="font-display text-3xl sm:text-4xl text-[#F2ECE2] mb-10">You may also like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {related.map((p, i) => (
                <ShopCollectionCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
}