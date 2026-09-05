import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { HERO_BACKGROUND_IMAGE, HERO_PRODUCT_IMAGE } from '@/data/products';
import { useHeroIntro } from '@/hooks/useHeroIntro';

export default function Hero() {
  const containerRef = useRef(null);
  const backgroundRef = useRef(null);
  const productWrapRef = useRef(null);
  const productImageRef = useRef(null);
  const productShadowRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headlineLine1Ref = useRef(null);
  const headlineLine2Ref = useRef(null);
  const descriptionRef = useRef(null);
  const primaryCtaRef = useRef(null);
  const secondaryCtaRef = useRef(null);
  const scrollHintRef = useRef(null);

  useHeroIntro({
    container: containerRef,
    background: backgroundRef,
    productWrap: productWrapRef,
    productImage: productImageRef,
    productShadow: productShadowRef,
    eyebrow: eyebrowRef,
    headlineLine1: headlineLine1Ref,
    headlineLine2: headlineLine2Ref,
    description: descriptionRef,
    primaryCta: primaryCtaRef,
    secondaryCta: secondaryCtaRef,
    scrollHint: scrollHintRef,
  });

  return (
    <section
      ref={containerRef}
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden bg-greendark grain"
    >
      {/* Environment — real Himalayan photo, natural color, no green wash */}
      <div ref={backgroundRef} className="absolute inset-0">
        <img
          src={HERO_BACKGROUND_IMAGE}
          alt="Himalayan mountains and rock at golden hour"
          className="h-full w-full object-cover"
        />
        {/* Neutral dark gradient, bottom only — for the scroll cue / mobile text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
        {/* Neutral dark gradient, left side only, desktop — for headline legibility, never reaching the product zone on the right */}
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-black/50 via-black/10 to-transparent" />
      </div>

      {/* Product — the ONLY real ABIXMART asset, a true transparent cutout.
          Enters deeper/smaller/blurred, moves forward into focus, then
          glides right to settle on the rock. Reserved to its own zone on
          the right so it never collides with the headline. */}
      <div
        className="absolute left-0 right-0 top-0 lg:left-auto lg:right-[5%] lg:bottom-[9%] flex justify-center items-start pt-[9%] lg:pt-0 lg:justify-end lg:items-end z-[6] pointer-events-none px-6 lg:px-0"
        aria-hidden="true"
      >
        <div className="relative">
          <div
            ref={productShadowRef}
            className="absolute left-1/2 -translate-x-1/2 bottom-[4%] w-[75%] h-[12%] rounded-full bg-black/45 blur-xl"
          />
          <div
            ref={productWrapRef}
            className="relative w-[42vw] max-w-[170px] sm:max-w-[210px] lg:w-[19vw] lg:max-w-[300px]"
          >
            <img
              ref={productImageRef}
              src={HERO_PRODUCT_IMAGE}
              alt=""
              draggable={false}
              className="w-full h-auto select-none"
              style={{ filter: 'drop-shadow(0 26px 34px rgba(0,0,0,0.4))' }}
            />
          </div>
        </div>
      </div>

      {/* Content — width-constrained so it can never reach the product zone */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 min-h-[100svh] flex flex-col justify-end pb-24 pt-28">
        <div className="lg:max-w-[600px] xl:max-w-[640px]">
          <div ref={eyebrowRef}>
            <Eyebrow light className="mb-7">Himalayan Modern Luxury</Eyebrow>
          </div>

          <h1 className="font-display text-ivory leading-[0.95] tracking-tight text-balance">
            <span className="block overflow-hidden">
              <span
                ref={headlineLine1Ref}
                className="block text-[13vw] sm:text-[10vw] lg:text-[6vw] xl:text-[68px]"
              >
                From the Himalayas.
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                ref={headlineLine2Ref}
                className="block text-[13vw] sm:text-[10vw] lg:text-[6vw] xl:text-[68px] italic text-ivory/90"
              >
                To your daily ritual.
              </span>
            </span>
          </h1>

          <p
            ref={descriptionRef}
            className="mt-8 max-w-xl text-ivory/75 text-base lg:text-lg leading-relaxed font-body"
          >
            Premium Himalayan Shilajit Pure Resin — sourced from the high mountains,
            purified by tradition, crafted for the modern ritual.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              ref={primaryCtaRef}
              to="/shop"
              className="group inline-flex items-center justify-center h-14 px-9 bg-ivory text-greendark text-[12px] font-semibold tracking-luxe-sm uppercase rounded-none hover:bg-gold hover:text-greendark transition-colors duration-300"
            >
              Explore Products
              <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              ref={secondaryCtaRef}
              to="/about"
              className="inline-flex items-center justify-center h-14 px-9 border border-ivory/40 text-ivory text-[12px] font-semibold tracking-luxe-sm uppercase rounded-none hover:bg-ivory/10 transition-colors duration-300"
            >
              Discover Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-ivory/60"
      >
        <span className="text-[10px] uppercase tracking-luxe-sm">Scroll</span>
        <ArrowDown size={14} className="scroll-hint" />
      </div>
    </section>
  );
}