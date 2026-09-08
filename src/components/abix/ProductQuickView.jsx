import React, { useEffect, useRef, useState } from 'react';
import { X, Minus, Plus, Check } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { useShop } from '@/lib/ShopContext';
import { HERO_PRODUCT_IMAGE, featuredProduct, productBenefits } from '@/data/products';

// Six points evenly spaced around a circle (matches the rotation angles
// used for the connecting line, so the line always points at the
// currently-active benefit).
const ORBIT = [
  { x: 50, y: 6, angle: -90 },
  { x: 87, y: 27, angle: -30 },
  { x: 87, y: 73, angle: 30 },
  { x: 50, y: 94, angle: 90 },
  { x: 13, y: 73, angle: 150 },
  { x: 13, y: 27, angle: 210 },
];

/**
 * Product Quick View — a cinematic "product scan" rather than a plain
 * ecommerce modal.
 *
 * Phases (all one GSAP sequence, plays once per open, never loops):
 *   scan     -> the real product settles into focus, a soft light sweep
 *               passes across it.
 *   benefits -> a thin line pivots from the product to each of the 6
 *               approved benefits in turn, one dominant at a time.
 *   info     -> settles into a plain, readable product panel (name,
 *               price, qty, Add to Cart) plus a quiet reference list of
 *               all six benefits, for anyone who wants to just read.
 *
 * `prefers-reduced-motion` skips straight to the readable info panel —
 * nothing is lost, it's just presented immediately without the sequence.
 */
export default function ProductQuickView({ open, onClose }) {
  const { addToCart } = useShop();
  const [qty, setQty] = useState(1);
  const [phase, setPhase] = useState('scan');
  const [activeBenefit, setActiveBenefit] = useState(0);
  const [added, setAdded] = useState(false);

  const panelRef = useRef(null);
  const imageRef = useRef(null);
  const sweepRef = useRef(null);
  const lineRef = useRef(null);
  const benefitRefs = useRef(productBenefits.map(() => React.createRef()));

  useEffect(() => {
    if (open) {
      setQty(1);
      setAdded(false);
      setPhase('scan');
      setActiveBenefit(0);
    }
  }, [open]);

  // Phase 1 — the scan.
  useGSAP(
    () => {
      if (!open || phase !== 'scan') return;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduceMotion) {
        gsap.set(imageRef.current, { opacity: 1, scale: 1, rotation: 0 });
        setPhase('info');
        return;
      }

      gsap.set(imageRef.current, { opacity: 0, scale: 0.82, rotation: -6 });
      gsap.set(sweepRef.current, { opacity: 0, xPercent: -70 });

      gsap
        .timeline({ onComplete: () => setPhase('benefits') })
        .to(imageRef.current, { opacity: 1, scale: 1, rotation: 0, duration: 0.9, ease: 'power3.out' }, 0)
        .to(sweepRef.current, { opacity: 0.35, xPercent: 170, duration: 1.1, ease: 'sine.inOut' }, 0.3)
        .to(sweepRef.current, { opacity: 0, duration: 0.3 }, 1.3);
    },
    { scope: panelRef, dependencies: [open, phase] }
  );

  // Phase 2 — benefits orbit, one dominant at a time.
  useGSAP(
    () => {
      if (!open || phase !== 'benefits') return;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const benefits = benefitRefs.current.map((r) => r.current);

      if (reduceMotion) {
        gsap.set(benefits, { opacity: 1, scale: 1 });
        setPhase('info');
        return;
      }

      gsap.set(benefits, { opacity: 0, scale: 0.85 });
      gsap.set(lineRef.current, { opacity: 0, rotation: ORBIT[0].angle });

      const tl = gsap.timeline({ onComplete: () => setPhase('info') });
      productBenefits.forEach((_, i) => {
        const t = i * 1.05;
        tl.to(lineRef.current, { opacity: 0.5, rotation: ORBIT[i].angle, duration: 0.5, ease: 'power2.inOut' }, t);
        tl.call(() => setActiveBenefit(i), null, t);
        tl.fromTo(benefits[i], { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4 }, t);
        if (i < productBenefits.length - 1) {
          tl.to(benefits[i], { opacity: 0.3, scale: 0.9, duration: 0.4 }, t + 0.85);
        }
      });
      tl.to(lineRef.current, { opacity: 0, duration: 0.4 });

      return () => {}; // cleanup handled by useGSAP's context revert
    },
    { scope: panelRef, dependencies: [open, phase] }
  );

  if (!open) return null;

  const unit = featuredProduct.price;
  const total = unit * qty;

  const handleAddToCart = () => {
    addToCart('shilajit-resin', qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-ivory w-full max-w-3xl max-h-[92vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-4 right-4 z-10 p-2 text-greendark/60 hover:text-greendark transition-colors"
        >
          <X size={18} />
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-14">
          {/* Product stage — scan + orbiting benefits happen here */}
          <div className="relative aspect-square flex items-center justify-center bg-[#2b2118]">
            <div ref={imageRef} className="relative w-[46%]">
              <img
                src={HERO_PRODUCT_IMAGE}
                alt="ABIXMART Himalayan Shilajit"
                draggable={false}
                className="w-full h-auto select-none"
                style={{ filter: 'drop-shadow(0 18px 24px rgba(0,0,0,0.45))' }}
              />
            </div>

            {/* Light sweep */}
            <div
              ref={sweepRef}
              className="absolute inset-y-0 w-1/3 pointer-events-none mix-blend-soft-light"
              style={{ left: '-20%', background: 'linear-gradient(100deg, transparent, rgba(255,238,205,0.9), transparent)' }}
            />

            {/* Connecting line + orbiting benefits */}
            {phase === 'benefits' && (
              <>
                <div
                  ref={lineRef}
                  className="absolute left-1/2 top-1/2 h-px w-[38%] bg-gold/70 origin-left"
                />
                {productBenefits.map((b, i) => (
                  <div
                    key={b.title}
                    ref={benefitRefs.current[i]}
                    className="absolute -translate-x-1/2 -translate-y-1/2 max-w-[120px] text-center"
                    style={{ left: `${ORBIT[i].x}%`, top: `${ORBIT[i].y}%` }}
                  >
                    <span className={`text-[10px] uppercase tracking-luxe-sm leading-tight block ${activeBenefit === i ? 'text-gold' : 'text-ivory/70'}`}>
                      {b.title}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Info panel */}
          <div className="flex flex-col justify-center">
            {phase !== 'info' ? (
              <div className="text-[11px] uppercase tracking-luxe-sm text-greendark/40">
                {phase === 'scan' ? 'Examining the resin…' : 'Product profile'}
              </div>
            ) : (
              <>
                <span className="text-[11px] uppercase tracking-luxe-sm text-gold">Product Profile</span>
                <h3 className="mt-3 font-display text-3xl lg:text-4xl text-greendark leading-tight">
                  {featuredProduct.name}
                </h3>
                <p className="mt-1 font-display text-xl italic text-gold">{featuredProduct.subtitle}</p>

                <div className="mt-6 flex items-center gap-5">
                  <div className="inline-flex items-center border border-greendark/25 h-12">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="h-full w-10 inline-flex items-center justify-center text-greendark hover:bg-sand transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-9 text-center font-price text-lg text-greendark">{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="h-full w-10 inline-flex items-center justify-center text-greendark hover:bg-sand transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-price text-xl text-greendark">
                    {featuredProduct.currency}
                    {total}
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="mt-6 inline-flex items-center justify-center h-[52px] px-8 bg-greendark text-ivory text-[12px] font-semibold tracking-luxe-sm uppercase hover:bg-gold hover:text-greendark transition-colors duration-300"
                >
                  {added ? 'Added to cart' : 'Add to Cart'}
                  {added && <Check size={16} className="ml-2" />}
                </button>

                {/* Quiet reference list — so nothing is lost if the scan is skipped/missed */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 border-t border-greendark/10 pt-6">
                  {productBenefits.map((b) => (
                    <div key={b.title}>
                      <span className="text-[10px] uppercase tracking-luxe-sm text-greendark/50">{b.title}</span>
                      <p className="text-xs text-foreground/55 leading-relaxed mt-0.5">{b.body}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}