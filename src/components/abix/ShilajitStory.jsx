import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

import himalayaBG from '@/assets/shilajit-steps/himalayaBG.png';
import collectionImg from '@/assets/shilajit-steps/collection.png';
import purificationImg from '@/assets/shilajit-steps/purification.png';
import testingImg from '@/assets/shilajit-steps/testing.png';
import resinFormulationImg from '@/assets/shilajit-steps/resin_formulation.png';
import fillingImg from '@/assets/shilajit-steps/filling.png';
import sealingImg from '@/assets/shilajit-steps/sealing.png';
import ReadyToReach from '@/assets/shilajit-steps/ReadyToReach.jpeg';
/**
 * "How Our Shilajit Is Made" — ambient film in normal page flow. No
 * ScrollTrigger, no pinning, no hover-pause (removed — it was causing the
 * "stuck for a minute" issue whenever the cursor rested over the frame).
 * It advances on a strict, uninterrupted clock: ~3.2s per scene, plain
 * crossfade, always looping.
 */
const SCENES = [
  { num: '01', title: 'Himalayan Origin', body: 'Our Shilajit is gathered from high-altitude Himalayan rock, where it forms slowly over centuries.', image: himalayaBG, duration: 3200 },
  { num: '02', title: 'Carefully Collected', body: 'Raw Shilajit is carefully collected from high-altitude Himalayan rock.', image: collectionImg, duration: 3200 },
  { num: '03', title: 'Purified With Care', body: 'The raw material is carefully purified through a controlled process.', image: purificationImg, duration: 3200 },
  { num: '04', title: 'Quality Testing', body: 'Each batch goes through careful quality testing before moving forward.', image: testingImg, duration: 3200 },
  { num: '05', title: 'Resin Formulation', body: 'The purified material is carefully concentrated and prepared into its final resin form.', image: resinFormulationImg, duration: 3200 },
  { num: '06', title: 'Carefully Filled', body: 'The prepared resin is carefully filled into glass jars.', image: fillingImg, duration: 3200 },
  { num: '07', title: 'Sealed & Checked', body: 'Each jar is carefully sealed, checked and prepared for its journey.', image: sealingImg, duration: 3200 },
  { num: '08', title: 'Ready to Reach You', body: 'From the mountain to your hands — carefully prepared and ready to become part of your ritual.', image: ReadyToReach, duration: 3600 },
];
const STEPS = SCENES.length;
const FADE = 0.5; // seconds

export default function ShilajitStory() {
  const [index, setIndex] = useState(0);
  const prevIndexRef = useRef(0);

  const frameRef = useRef(null);
  const imageRefs = useRef(SCENES.map(() => React.createRef()));
  const numRefs = useRef(SCENES.map(() => React.createRef()));
  const headingRefs = useRef(SCENES.map(() => React.createRef()));
  const bodyRefs = useRef(SCENES.map(() => React.createRef()));

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const from = prevIndexRef.current;
      const to = index;
      const scene = SCENES[to];
      const isFirstMount = from === to && to === 0;

      const incomingImg = imageRefs.current[to].current;
      const outgoingImg = !isFirstMount ? imageRefs.current[from].current : null;
      const incomingParts = [numRefs.current[to].current, headingRefs.current[to].current, bodyRefs.current[to].current].filter(Boolean);
      const outgoingParts = !isFirstMount
        ? [numRefs.current[from].current, headingRefs.current[from].current, bodyRefs.current[from].current].filter(Boolean)
        : [];

      SCENES.forEach((_, i) => {
        if (i === to || i === from) return;
        if (imageRefs.current[i].current) gsap.set(imageRefs.current[i].current, { opacity: 0 });
        gsap.set(
          [numRefs.current[i].current, headingRefs.current[i].current, bodyRefs.current[i].current].filter(Boolean),
          { opacity: 0 }
        );
      });

      const durationSec = scene.duration / 1000;

      if (reduceMotion) {
        gsap.set(incomingImg, { opacity: 1 });
        if (outgoingImg) gsap.set(outgoingImg, { opacity: 0 });
        gsap.set(incomingParts, { opacity: 1, y: 0 });
        if (outgoingParts.length) gsap.set(outgoingParts, { opacity: 0 });

        gsap.timeline({ onComplete: () => setIndex((i) => (i + 1) % STEPS) }).to({}, { duration: durationSec });
        prevIndexRef.current = to;
        return;
      }

      gsap.set(incomingImg, { opacity: 0 });
      gsap.set(incomingParts, { opacity: 0, y: 12 });
      if (outgoingParts.length) gsap.set(outgoingParts, { opacity: 1, y: 0 });

      const tl = gsap.timeline({ onComplete: () => setIndex((i) => (i + 1) % STEPS) });

      if (outgoingImg) tl.to(outgoingImg, { opacity: 0, duration: FADE, ease: 'sine.inOut' }, 0);
      tl.to(incomingImg, { opacity: 1, duration: FADE, ease: 'sine.inOut' }, 0);

      if (outgoingParts.length) tl.to(outgoingParts, { opacity: 0, duration: FADE * 0.6 }, 0);
      tl.to(incomingParts, { opacity: 1, y: 0, duration: FADE * 0.7, stagger: 0.04 }, FADE * 0.25);

      tl.to({}, { duration: Math.max(durationSec - FADE, 0.4) });

      prevIndexRef.current = to;
    },
    { scope: frameRef, dependencies: [index] }
  );

  return (
    <section className="bg-ivory pt-14 pb-24 lg:pt-16 lg:pb-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-10 mb-8 lg:mb-10 max-w-2xl">
        <span className="block text-[11px] font-medium uppercase tracking-luxe-sm text-gold">The Journey</span>
        <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl text-greendark leading-[1.02] tracking-tight">
          How Our Shilajit Is Made
        </h2>
        <p className="mt-5 text-foreground/60 text-lg leading-relaxed">
          From the mountains to your hands — a carefully considered journey.
        </p>
      </div>

      <div
        ref={frameRef}
        className="relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[21/9] overflow-hidden bg-[#1c150f]"
      >
        {SCENES.map((s, i) => (
          <div key={s.num} ref={imageRefs.current[i]} className="absolute inset-0">
            <img
              src={s.image}
              alt={s.title}
              className="h-full w-full object-cover"
              style={{ filter: 'sepia(0.06) saturate(1.05) contrast(1.03)' }}
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/15 to-black/10 pointer-events-none" />

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-14 z-10">
          <div className="relative max-w-md">
            {SCENES.map((s, i) => (
              <div key={s.num} className={i === index ? 'relative' : 'absolute inset-0 pointer-events-none'}>
                <span ref={numRefs.current[i]} className="font-display text-2xl lg:text-3xl text-gold/85 leading-none">
                  {s.num}
                </span>
                <h3 ref={headingRefs.current[i]} className="mt-2 font-display text-xl sm:text-2xl lg:text-3xl text-ivory leading-tight tracking-tight">
                  {s.title}
                </h3>
                <p ref={bodyRefs.current[i]} className="mt-2 text-ivory/75 text-sm lg:text-base leading-relaxed font-body">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}