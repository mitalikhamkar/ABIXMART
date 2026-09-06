import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { HERO_PRODUCT_IMAGE } from '@/data/products';

import himalayaBG from '@/assets/shilajit-steps/himalayaBG.png';
import collectionImg from '@/assets/shilajit-steps/collection.png';
import purificationImg from '@/assets/shilajit-steps/purification.png';
import testingImg from '@/assets/shilajit-steps/testing.png';
import resinFormulationImg from '@/assets/shilajit-steps/resin_formulation.png';
import fillingImg from '@/assets/shilajit-steps/filling.png';
import sealingImg from '@/assets/shilajit-steps/sealing.png';

/**
 * "The Journey of ABIXMART Shilajit" — a pinned, scroll-scrubbed cinematic
 * sequence. Scroll position IS story progress. The SCENE (photograph)
 * changes at every step, not the product — the product only appears once,
 * as the final payoff, and then stays completely still.
 *
 * 8 scenes, 7 scroll-scrubbed transitions between them:
 *   01 Himalayan Origin   (himalayaBG.png)
 *   02 Carefully Collected (collection.png)
 *   03 Purified With Care (purification.png)
 *   04 Quality Testing    (testing.png)
 *   05 Resin Formulation  (resin_formulation.png)
 *   06 Carefully Filled   (filling.png)
 *   07 Sealed & Checked   (sealing.png)
 *   08 Ready to Reach You (himalayaBG.png again — full-circle backdrop)
 *      -> the REAL ABIXMART product fades/settles in ONCE here and stays put.
 *
 * Each transition combines a directional clip-path reveal on the incoming
 * image with a slow Ken-Burns scale and an opposing scale/opacity pull on
 * the outgoing image — never a plain crossfade. Text crossfades in sync,
 * with a small vertical stagger.
 *
 * `prefers-reduced-motion`: no pin, no scrub — final scene + product shown
 * directly, no scroll-driven motion at all.
 */
const SCENES = [
  {
    num: '01',
    title: 'Himalayan Origin',
    body: 'Our Shilajit is gathered from high-altitude Himalayan rock, where it forms slowly over centuries. We collect in small quantities, with respect for the mountain.',
    image: himalayaBG,
  },
  {
    num: '02',
    title: 'Carefully Collected',
    body: 'Raw Shilajit is carefully collected from high-altitude Himalayan rock.',
    image: collectionImg,
  },
  {
    num: '03',
    title: 'Purified With Care',
    body: 'The raw material is carefully purified through a controlled process to remove impurities.',
    image: purificationImg,
  },
  {
    num: '04',
    title: 'Quality Testing',
    body: 'Each batch goes through careful quality testing before moving forward.',
    image: testingImg,
  },
  {
    num: '05',
    title: 'Resin Formulation',
    body: 'The purified material is carefully concentrated and prepared into its final resin form.',
    image: resinFormulationImg,
  },
  {
    num: '06',
    title: 'Carefully Filled',
    body: 'The prepared resin is carefully filled into glass jars.',
    image: fillingImg,
  },
  {
    num: '07',
    title: 'Sealed & Checked',
    body: 'Each jar is carefully sealed, checked and prepared for its journey.',
    image: sealingImg,
  },
  {
    num: '08',
    title: 'Ready to Reach You',
    body: 'From the mountain to your hands — carefully prepared and ready to become part of your ritual.',
    image: himalayaBG,
    isFinal: true,
  },
];

export default function ShilajitStory() {
  const sectionRef = useRef(null);
  const productWrapRef = useRef(null);
  const productShadowRef = useRef(null);

  const imageRefs = useRef(SCENES.map(() => React.createRef()));
  const textRefs = useRef(SCENES.map(() => React.createRef()));
  const dotRefs = useRef(SCENES.map(() => React.createRef()));

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const images = imageRefs.current.map((r) => r.current).filter(Boolean);
      const texts = textRefs.current.map((r) => r.current).filter(Boolean);
      const dots = dotRefs.current.map((r) => r.current).filter(Boolean);

      // ---------------------------------------------------------------
      // Reduced motion: show the final scene + product directly. No pin,
      // no scroll-scrubbed motion.
      // ---------------------------------------------------------------
      if (reduceMotion) {
        gsap.set(images, { opacity: 0, scale: 1, clipPath: 'inset(0 0 0 0)' });
        const lastImage = images[images.length - 1];
        if (lastImage) gsap.set(lastImage, { opacity: 1 });

        gsap.set(texts, { opacity: 0, y: 0 });
        const lastText = texts[texts.length - 1];
        if (lastText) gsap.set(lastText, { opacity: 1 });

        gsap.set(dots, { opacity: 0.35 });
        const lastDot = dots[dots.length - 1];
        if (lastDot) gsap.set(lastDot, { opacity: 1 });

        if (productWrapRef.current) gsap.set(productWrapRef.current, { opacity: 1, y: 0, scale: 1 });
        if (productShadowRef.current) gsap.set(productShadowRef.current, { opacity: 1, scaleX: 1 });
        return;
      }

      // ---------------------------------------------------------------
      // Full cinematic scroll-scrubbed sequence.
      // ---------------------------------------------------------------
      const isMobile = window.innerWidth < 1024;

      // Initial state: scene 1 visible, all others hidden/off (clipped from
      // the right, slightly zoomed, ready to reveal).
      gsap.set(images, { opacity: 0, scale: 1.12, clipPath: 'inset(0 100% 0 0)' });
      if (images[0]) gsap.set(images[0], { opacity: 1, scale: 1.08, clipPath: 'inset(0 0% 0 0)' });

      gsap.set(texts, { opacity: 0, y: 22 });
      if (texts[0]) gsap.set(texts[0], { opacity: 1, y: 0 });

      gsap.set(dots, { opacity: 0.35, scaleY: 1 });
      if (dots[0]) gsap.set(dots[0], { opacity: 1, scaleY: 1.8 });

      // Product: hidden until the very final segment.
      if (productWrapRef.current) {
        gsap.set(productWrapRef.current, { opacity: 0, y: isMobile ? 26 : 34, scale: 0.86 });
      }
      if (productShadowRef.current) {
        gsap.set(productShadowRef.current, { opacity: 0, scaleX: 0.6 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: isMobile ? 0.4 : 0.7,
          pin: sectionRef.current.querySelector('[data-pin]'),
          pinSpacing: false,
        },
        defaults: { ease: 'power2.inOut' },
      });

      const steps = SCENES.length; // 8
      const points = Array.from({ length: steps }, (_, i) => i / (steps - 1)); // 0 .. 1, 8 points, 7 segments

      for (let i = 0; i < steps - 1; i++) {
        const start = points[i];
        const dur = points[i + 1] - start;
        const outImg = images[i];
        const inImg = images[i + 1];
        const outText = texts[i];
        const inText = texts[i + 1];
        const outDot = dots[i];
        const inDot = dots[i + 1];

        // Outgoing scene: pulls back slightly and fades — depth, not a flat fade.
        if (outImg) {
          tl.to(outImg, { opacity: 0, scale: 1.2, duration: dur * 0.85, ease: 'power1.in' }, start);
        }
        // Incoming scene: directional clip-path reveal + Ken Burns settle.
        if (inImg) {
          tl.fromTo(
            inImg,
            { opacity: 0, scale: 1.12, clipPath: 'inset(0 100% 0 0)' },
            { opacity: 1, scale: 1.08, clipPath: 'inset(0 0% 0 0)', duration: dur, ease: 'power2.inOut' },
            start
          );
        }

        // Text crossfade, small vertical stagger.
        if (outText) {
          tl.to(outText, { opacity: 0, y: -16, duration: dur * 0.4 }, start + dur * 0.05);
        }
        if (inText) {
          tl.fromTo(
            inText,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: dur * 0.5 },
            start + dur * 0.45
          );
        }

        // Progress dots.
        if (outDot && inDot) {
          tl.to(outDot, { opacity: 0.35, scaleY: 1, duration: dur * 0.3 }, start + dur * 0.2);
          tl.to(inDot, { opacity: 1, scaleY: 1.8, duration: dur * 0.3 }, start + dur * 0.2);
        }

        // Final segment (07 -> 08): the real product settles in ONCE, as
        // the payoff, timed to land near the end of the last scene's reveal.
        if (i === steps - 2) {
          if (productWrapRef.current) {
            tl.to(
              productWrapRef.current,
              { opacity: 1, y: 0, scale: 1, duration: dur * 0.7, ease: 'power3.out' },
              start + dur * 0.3
            );
          }
          if (productShadowRef.current) {
            tl.to(
              productShadowRef.current,
              { opacity: 1, scaleX: 1, duration: dur * 0.7, ease: 'power2.out' },
              start + dur * 0.3
            );
          }
        }
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#1c150f]"
      style={{ height: `${SCENES.length * 100}vh` }}
    >
      <div data-pin className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Scenes — each an absolutely stacked, full-bleed photograph */}
        <div className="absolute inset-0">
          {SCENES.map((s, i) => (
            <div key={s.num} ref={imageRefs.current[i]} className="absolute inset-0">
              <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
            </div>
          ))}
          {/* Legibility gradients — desktop: left-side wash for the text column.
              Mobile: bottom wash, since text sits at the bottom there. */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25 lg:bg-gradient-to-r lg:from-black/70 lg:via-black/25 lg:to-transparent" />
        </div>

        {/* Progress indicator — desktop only, minimal vertical dots */}
        <div className="hidden lg:flex flex-col gap-3 absolute left-6 xl:left-10 top-1/2 -translate-y-1/2 z-10">
          {SCENES.map((s, i) => (
            <span
              key={s.num}
              ref={dotRefs.current[i]}
              className="w-1.5 h-1.5 rounded-full bg-ivory/70 origin-center"
            />
          ))}
        </div>

        {/* Text column — left/centered on desktop, bottom-anchored on mobile */}
        <div className="absolute inset-x-0 bottom-0 p-6 pb-12 lg:pb-0 lg:inset-y-0 lg:left-0 lg:w-[52%] xl:w-[46%] lg:flex lg:flex-col lg:justify-center lg:p-14 xl:p-20 z-10">
          <div className="relative min-h-[190px] lg:min-h-0">
            {SCENES.map((s, i) => (
              <div key={s.num} ref={textRefs.current[i]} className="lg:absolute lg:inset-0 lg:flex lg:flex-col lg:justify-center">
                <span className="font-display text-3xl lg:text-5xl text-gold/85 leading-none">{s.num}</span>
                <h3 className="mt-3 lg:mt-4 font-display text-2xl sm:text-3xl lg:text-5xl text-ivory leading-tight tracking-tight text-balance">
                  {s.title}
                </h3>
                <p className="mt-3 lg:mt-5 max-w-md text-ivory/75 text-sm sm:text-base lg:text-lg leading-relaxed font-body">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Product zone — appears ONCE at the very end, then holds still */}
        <div
          className="absolute right-0 bottom-0 left-0 lg:left-auto lg:right-[8%] lg:bottom-[10%] flex justify-center lg:justify-end pb-6 lg:pb-0 z-[6] pointer-events-none"
          aria-hidden="true"
        >
          <div className="relative">
            <div
              ref={productShadowRef}
              className="absolute left-1/2 -translate-x-1/2 bottom-[6%] w-[70%] h-[12%] rounded-full bg-black/40 blur-xl"
            />
            <div ref={productWrapRef} className="relative w-[36vw] max-w-[150px] lg:w-[16vw] lg:max-w-[240px]">
              <img
                src={HERO_PRODUCT_IMAGE}
                alt="ABIXMART Himalayan Shilajit"
                draggable={false}
                className="w-full h-auto select-none"
                style={{ filter: 'drop-shadow(0 22px 28px rgba(0,0,0,0.4))' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}