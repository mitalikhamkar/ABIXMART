import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Minus, Plus, ArrowLeft, Heart } from 'lucide-react';
import PageTransition from '@/components/abix/PageTransition';
import Eyebrow from '@/components/abix/Eyebrow';
import ShopCollectionCard from '@/components/abix/ShopCollectionCard';
import { getProductBySlug, products, openProductTabs, ritualBundles, SOURCING_IMAGE, PURIFICATION_IMAGE, RITUAL_IMAGE } from '@/data/products';
import { useShop } from '@/lib/ShopContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const { addToCart, toggleWishlist, isInWishlist, openCheckout } = useShop();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('source');
  const [added, setAdded] = useState(false);

  if (!product || product.status === 'coming_soon') {
    return (
      <PageTransition>
        <div className="pt-32 pb-24 text-center">
          <p className="font-display text-3xl text-greendark">This product isn't available yet.</p>
          <Link to="/shop" className="btn-primary mt-6">
            Back to shop
          </Link>
        </div>
      </PageTransition>
    );
  }

  const activeTab = openProductTabs.find((t) => t.key === tab);
  const related = products.filter((p) => p.id !== product.id && p.status === 'available');

  const handleAdd = () => {
    addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const tabImage = { source: SOURCING_IMAGE, process: PURIFICATION_IMAGE, quality: RITUAL_IMAGE, use: RITUAL_IMAGE };

  return (
    <PageTransition>
      {/* Gallery + info — ivory */}
      <section className="bg-ivory pt-24 lg:pt-32 pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-foreground/55 hover:text-greendark transition-colors mb-8">
            <ArrowLeft size={16} /> Back to shop
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-sand">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 ring-1 ring-inset ring-greendark/10" />
              </div>
              <div className="hidden lg:grid grid-cols-3 gap-3 mt-3">
                {[product.image, SOURCING_IMAGE, PURIFICATION_IMAGE].map((img, i) => (
                  <div key={i} className="aspect-square bg-sand overflow-hidden">
                    <img src={img} alt="" className="h-full w-full object-cover opacity-70 hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Info */}
            <div>
              <Eyebrow>Featured</Eyebrow>
              <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-[56px] text-greendark leading-[1.02] tracking-tight">
                {product.name}
              </h1>
              <p className="mt-2 font-display text-2xl lg:text-3xl italic text-gold">{product.subtitle}</p>
              <p className="mt-7 text-foreground/70 text-lg leading-relaxed max-w-md">{product.description}</p>

              <dl className="mt-9 grid grid-cols-2 gap-x-8 gap-y-5 max-w-md">
                {product.facts.map((f) => (
                  <div key={f.label} className="border-t border-greendark/15 pt-3">
                    <dt className="label-meta text-foreground/45">{f.label}</dt>
                    <dd className="mt-1 font-display text-lg text-greendark">{f.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Bundle options */}
              <div className="mt-9">
                <span className="label-meta text-foreground/45">Bundle options</span>
                <div className="mt-3 space-y-2">
                  {ritualBundles.map((b) => (
                    <button
                      key={b.name}
                      onClick={() => setQty(b.jars)}
                      className={`w-full flex items-center justify-between p-4 border transition-colors ${
                        qty === b.jars ? 'border-greendark bg-sand' : 'border-greendark/20 hover:border-greendark/40'
                      }`}
                    >
                      <span className="text-left">
                        <span className="font-display text-lg text-greendark">{b.name}</span>
                        <span className="block text-xs text-foreground/50">{b.note}</span>
                      </span>
                      <span className="font-price text-xl text-greendark">₹{b.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity + price */}
              <div className="mt-8 flex items-center gap-5">
                <div className="inline-flex items-center border border-greendark/25 h-14">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-full w-12 inline-flex items-center justify-center text-greendark hover:bg-sand transition-colors" aria-label="Decrease">
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-price text-xl text-greendark">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="h-full w-12 inline-flex items-center justify-center text-greendark hover:bg-sand transition-colors" aria-label="Increase">
                    <Plus size={16} />
                  </button>
                </div>
                <span className="font-price text-3xl text-greendark">{product.currency}{product.price * qty}</span>
                <button onClick={() => toggleWishlist(product.id)} className="ml-auto h-14 w-14 inline-flex items-center justify-center border border-greendark/20 text-greendark hover:border-gold hover:text-gold transition-colors" aria-label="Wishlist">
                  <Heart size={20} className={isInWishlist(product.id) ? 'fill-gold text-gold' : ''} />
                </button>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button onClick={handleAdd} className="group inline-flex items-center justify-center h-14 px-8 border border-greendark text-greendark text-[12px] font-semibold tracking-luxe-sm uppercase hover:bg-greendark hover:text-ivory transition-colors duration-300">
                  {added ? 'Added to ritual' : 'Add to cart'}
                  {added && <Check size={16} className="ml-2" />}
                </button>
                <button onClick={() => openCheckout({ name: `${product.name} — ${product.subtitle}`, jars: qty, price: product.price * qty })} className="group inline-flex items-center justify-center h-14 px-8 bg-greendark text-ivory text-[12px] font-semibold tracking-luxe-sm uppercase hover:bg-gold hover:text-greendark transition-colors duration-300">
                  Buy now
                  <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>

              <ul className="mt-8 space-y-2">
                {product.howToUse.map((h) => (
                  <li key={h} className="flex gap-3 text-sm text-foreground/75 leading-relaxed">
                    <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Product story tabs — sand */}
      <section className="bg-sand py-16 lg:py-24 border-t border-greendark/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl mb-10">
            <Eyebrow tone="moss">The product story</Eyebrow>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl text-greendark leading-[1.02] tracking-tight">
              Origin. Process. Quality. Use.
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
            <div className="lg:col-span-5 flex flex-col">
              {openProductTabs.map((t) => {
                const on = t.key === tab;
                return (
                  <button key={t.key} onClick={() => setTab(t.key)} className={`group text-left py-7 border-b border-greendark/15 transition-colors duration-300 ${on ? 'text-greendark' : 'text-foreground/40 hover:text-greendark/70'}`}>
                    <div className="flex items-baseline justify-between">
                      <span className="font-display text-3xl lg:text-4xl leading-tight">{t.label}</span>
                      <span className={`text-2xl transition-transform duration-300 ${on ? 'translate-x-1 text-gold' : 'opacity-0 group-hover:opacity-60'}`}>→</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7">
              <div className="relative h-full min-h-[420px] bg-greendark overflow-hidden grain">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={tab}
                    src={tabImage[tab]}
                    alt={activeTab.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-greendark via-greendark/70 to-greendark/40" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-12"
                  >
                    <span className="label-meta text-gold-light">{activeTab.label}</span>
                    <h3 className="mt-4 font-display text-3xl lg:text-4xl text-ivory leading-tight">{activeTab.title}</h3>
                    <p className="mt-4 text-ivory/80 text-lg leading-relaxed max-w-md">{activeTab.body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related — ivory */}
      {related.length > 0 && (
        <section className="bg-ivory py-16 lg:py-24 border-t border-greendark/5">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 className="font-display text-3xl sm:text-4xl text-greendark mb-10">You may also like</h2>
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
