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
      className="relative min-h-[100svh] w-full overflow-hidden bg-greendark grain flex flex-col"
    >
      {/* Environment — real Himalayan photo. Initial hidden state is set
          entirely by GSAP (gsap.set in useHeroIntro), never via a React
          `style` prop — a static inline style gets re-asserted by React on
          every re-render and silently undoes whatever GSAP animated. */}
      <div ref={backgroundRef} className="absolute inset-0">
        <img
          src={HERO_BACKGROUND_IMAGE}
          alt="Himalayan mountains and rock at golden hour"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-black/50 via-black/10 to-transparent" />
      </div>

      {/* PRODUCT ZONE
          Mobile: a real, dedicated in-flow zone above the text — it
          reserves its own space so it can never overlap the headline.
          Desktop (lg:): switches to absolute, bottom-right, its own
          foreground-rock spot, exactly as the approved design. */}
      <div
        className="relative z-[6] flex items-end justify-center pointer-events-none
                   h-[34vh] min-h-[220px] max-h-[320px] pt-20
                   lg:absolute lg:inset-auto lg:right-[6%] lg:bottom-[10%]
                   lg:h-auto lg:min-h-0 lg:max-h-none lg:pt-0 lg:justify-end lg:block"
        aria-hidden="true"
      >
        <div className="relative">
          <div
            ref={productShadowRef}
            className="absolute left-1/2 -translate-x-1/2 bottom-[4%] w-[75%] h-[12%] rounded-full bg-black/45 blur-xl"
          />
          <div
            ref={productWrapRef}
            className="relative w-[46vw] max-w-[190px] sm:max-w-[220px] lg:w-[19vw] lg:max-w-[300px]"
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

      {/* CONTENT — always below the product zone on mobile; bottom-anchored
          on desktop. Width-constrained on desktop so it never reaches the
          product's zone on the right. */}
      <div
        className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10 flex-1
                   flex flex-col justify-start pt-6 pb-12
                   lg:justify-end lg:pt-28 lg:pb-24"
      >
        <div className="lg:max-w-[600px] xl:max-w-[640px]">
          <div ref={eyebrowRef}>
            <Eyebrow light className="mb-5 lg:mb-7">Himalayan Modern Luxury</Eyebrow>
          </div>

          <h1 className="font-display text-ivory leading-[0.98] lg:leading-[0.95] tracking-tight text-balance">
            <span className="block overflow-hidden">
              <span
                ref={headlineLine1Ref}
                className="block text-[clamp(2.1rem,9vw,3.1rem)] lg:text-[6vw] xl:text-[68px]"
              >
                From the Himalayas.
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                ref={headlineLine2Ref}
                className="block text-[clamp(2.1rem,9vw,3.1rem)] lg:text-[6vw] xl:text-[68px] italic text-ivory/90"
              >
                To your daily ritual.
              </span>
            </span>
          </h1>

          <p
            ref={descriptionRef}
            className="mt-5 lg:mt-8 max-w-xl text-ivory/75 text-sm sm:text-base lg:text-lg leading-relaxed font-body"
          >
            Premium Himalayan Shilajit Pure Resin — sourced from the high mountains,
            purified by tradition, crafted for the modern ritual.
          </p>

          <div className="mt-7 lg:mt-10 flex flex-col sm:flex-row gap-3 lg:gap-4">
            <Link
              ref={primaryCtaRef}
              to="/shop"
              className="group inline-flex items-center justify-center h-12 lg:h-14 px-7 lg:px-9 bg-ivory text-greendark text-[11px] lg:text-[12px] font-semibold tracking-luxe-sm uppercase rounded-none hover:bg-gold hover:text-greendark transition-colors duration-300"
            >
              Explore Products
              <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              ref={secondaryCtaRef}
              to="/about"
              className="inline-flex items-center justify-center h-12 lg:h-14 px-7 lg:px-9 border border-ivory/40 text-ivory text-[11px] lg:text-[12px] font-semibold tracking-luxe-sm uppercase rounded-none hover:bg-ivory/10 transition-colors duration-300"
            >
              Discover Our Story
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator — desktop only, avoids crowding the mobile layout */}
      <div
        ref={scrollHintRef}
        className="hidden lg:flex absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 text-ivory/60"
      >
        <span className="text-[10px] uppercase tracking-luxe-sm">Scroll</span>
        <ArrowDown size={14} className="scroll-hint" />
      </div>
    </section>
  );
}