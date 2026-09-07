import React, { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

import heroFrame from '@/assets/HowToUse/Hero ritual frame.png';
import resinIntoWaterImg from '@/assets/HowToUse/Resin into warm water.png';
import stirDrinkImg from '@/assets/HowToUse/STIR & DRINK.png';
import morningToNightImg from '@/assets/HowToUse/Morning to night.png';

/**
 * "How to Take Shilajit" — a vertical, scroll-driven editorial story.
 * Not a boxed video-like carousel, not a card grid.
 *
 * ONLY FOUR IMAGES ARE IMPORTED ABOVE. There is no fifth "spoon" asset
 * anywhere in this file, in this component's imports, or in any inline
 * style/background-image in this file — grep this file for "Spoon" and
 * you will get zero matches. If a spoon image is still appearing on the
 * live site, its source is not here; see the note at the bottom of this
 * message for exactly where to look in the real project.
 *
 * Images are never force-cropped: no fixed-aspect + object-cover box.
 * Each image renders at its natural aspect ratio (w-full, h-auto), so
 * nothing important is cut off by a container. `OBJECT_POSITION` below is
 * a single, obvious place to nudge framing per-image if a specific photo
 * needs it (e.g. a tall shot where the important detail sits low) — every
 * entry defaults to 'center' since the actual photos aren't inspectable
 * from here; adjust the specific key if one image needs it once you see
 * this live against the real files.
 *
 * The section's background is one continuous warm-dark gradient — it
 * never brightens to ivory. It starts matching MountainToRitual's
 * charcoal, peaks at a warm clay tone in the middle (the "warm earth /
 * resin" beat), and settles back to the same espresso tone FeaturedProduct
 * now uses, so the handoff into the next section has no visible seam.
 *
 * Mobile has its own explicit order (number -> image -> action text),
 * not the desktop split reflowed.
 */
const NARRATION_SRC = null; // TODO: set to the real narration audio file path once available.

const OBJECT_POSITION = {
  take: 'center',
  dissolve: 'center',
  stir: 'center',
  consistency: 'center',
};

const CHAPTERS = [
  { key: 'take', num: '01', label: 'TAKE', heading: 'Take', line1: 'Start with a pea-sized amount.', line2: '300–500 mg', image: heroFrame, reveal: 'left' },
  { key: 'dissolve', num: '02', label: 'DISSOLVE', heading: 'Dissolve', line1: 'Dissolve in warm water or milk.', line2: '100–150 ml', image: resinIntoWaterImg, reveal: 'bottom' },
  { key: 'stir', num: '03', label: 'STIR & DRINK', heading: 'Stir & Drink', line1: 'Stir well and drink.', line2: 'Once or twice daily', image: stirDrinkImg, reveal: 'right' },
  { key: 'consistency', num: '04', label: 'CONSISTENCY', heading: 'Make it part of your routine', line1: 'Morning or night.', line2: 'Stay consistent for 8–12 weeks.', image: morningToNightImg, reveal: 'left' },
];

const CLIP_FROM = {
  left: 'inset(0 0 0 100%)',
  right: 'inset(0 100% 0 0)',
  bottom: 'inset(100% 0 0 0)',
};

export default function DailyRitual() {
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef(null);

  const storyRef = useRef(null);
  const railFillRef = useRef(null);
  const railGlowRef = useRef(null);
  const railDotRefs = useRef(CHAPTERS.map(() => React.createRef()));
  const railLabelRefs = useRef(CHAPTERS.map(() => React.createRef()));

  const chapterRefs = useRef(CHAPTERS.map(() => React.createRef()));
  const imageRefs = useRef(CHAPTERS.map(() => React.createRef()));
  const numRefs = useRef(CHAPTERS.map(() => React.createRef()));
  const headingRefs = useRef(CHAPTERS.map(() => React.createRef()));
  const line1Refs = useRef(CHAPTERS.map(() => React.createRef()));
  const line2Refs = useRef(CHAPTERS.map(() => React.createRef()));

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduceMotion) {
        gsap.set(
          [
            ...imageRefs.current.map((r) => r.current),
            ...numRefs.current.map((r) => r.current),
            ...headingRefs.current.map((r) => r.current),
            ...line1Refs.current.map((r) => r.current),
            ...line2Refs.current.map((r) => r.current),
          ].filter(Boolean),
          { opacity: 1, x: 0, y: 0, scale: 1, clipPath: 'inset(0 0 0 0)' }
        );
        railDotRefs.current.forEach((r) => r.current && gsap.set(r.current, { opacity: 1 }));
        railLabelRefs.current.forEach((r) => r.current && gsap.set(r.current, { opacity: 0.85 }));
        if (railFillRef.current) gsap.set(railFillRef.current, { height: '100%' });
        if (railGlowRef.current) gsap.set(railGlowRef.current, { opacity: 0 });
        return;
      }

      // ---- overall scroll-scrubbed "ritual thread" (no pin — purely observational) ----
      if (railFillRef.current) {
        gsap.set(railFillRef.current, { height: '0%' });
        gsap.set(railGlowRef.current, { top: '0%' });
        gsap.timeline({
          scrollTrigger: {
            trigger: storyRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: true,
          },
        })
          .to(railFillRef.current, { height: '100%', ease: 'none' }, 0)
          .to(railGlowRef.current, { top: '100%', ease: 'none' }, 0);
      }

      // ---- per-chapter entrance, each independent, none pinned ----
      CHAPTERS.forEach((chapter, i) => {
        const chapterEl = chapterRefs.current[i].current;
        const img = imageRefs.current[i].current;
        const num = numRefs.current[i].current;
        const heading = headingRefs.current[i].current;
        const line1 = line1Refs.current[i].current;
        const line2 = line2Refs.current[i].current;
        const dot = railDotRefs.current[i].current;
        const label = railLabelRefs.current[i].current;

        gsap.set(img, { clipPath: CLIP_FROM[chapter.reveal], scale: 1.1 });
        gsap.set(num, { opacity: 0, y: 14 });
        gsap.set(heading, { opacity: 0, x: chapter.reveal === 'right' ? 24 : -24 });
        gsap.set([line1, line2], { opacity: 0, y: 16 });
        if (dot) gsap.set(dot, { opacity: 0.3, scale: 1 });
        if (label) gsap.set(label, { opacity: 0.4 });

        // Image reveal — a real, clearly visible animated reveal (fixed
        // duration, plays once) rather than tied 1:1 to scroll position.
        gsap.timeline({ scrollTrigger: { trigger: chapterEl, start: 'top 85%', once: true } }).to(img, {
          clipPath: 'inset(0 0 0 0)',
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
        });

        // Very subtle continuous parallax drift while the chapter is in view.
        gsap.fromTo(
          img,
          { yPercent: chapter.reveal === 'bottom' ? 3 : -2 },
          {
            yPercent: chapter.reveal === 'bottom' ? -2 : 3,
            ease: 'none',
            scrollTrigger: { trigger: chapterEl, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
          }
        );

        // Typography — number, heading and lines move independently, not
        // one flat block; small stagger, one-time as the chapter enters.
        gsap
          .timeline({ scrollTrigger: { trigger: chapterEl, start: 'top 78%', once: true } })
          .to(num, { opacity: 1, y: 0, duration: 0.5 }, 0)
          .to(heading, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, 0.1)
          .to(line1, { opacity: 1, y: 0, duration: 0.5 }, 0.28)
          .to(line2, { opacity: 1, y: 0, duration: 0.5 }, 0.4);

        // Rail marker: emphasis + a small scale-pulse on the number itself
        // as its chapter becomes active — the "thread" responding to scroll.
        ScrollTrigger.create({
          trigger: chapterEl,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => {
            if (dot) gsap.to(dot, { opacity: 1, scale: 1.7, duration: 0.4 });
            if (label) gsap.to(label, { opacity: 1, duration: 0.4 });
            gsap.fromTo(num, { scale: 1 }, { scale: 1.12, duration: 0.25, yoyo: true, repeat: 1, ease: 'sine.inOut' });
          },
          onLeave: () => {
            if (dot) gsap.to(dot, { opacity: 0.3, scale: 1, duration: 0.4 });
            if (label) gsap.to(label, { opacity: 0.4, duration: 0.4 });
          },
          onEnterBack: () => {
            if (dot) gsap.to(dot, { opacity: 1, scale: 1.7, duration: 0.4 });
            if (label) gsap.to(label, { opacity: 1, duration: 0.4 });
          },
          onLeaveBack: () => {
            if (dot) gsap.to(dot, { opacity: 0.3, scale: 1, duration: 0.4 });
            if (label) gsap.to(label, { opacity: 0.4, duration: 0.4 });
          },
        });
      });
    },
    { scope: storyRef }
  );

  const toggleAudio = () => {
    setAudioOn((on) => {
      const next = !on;
      const el = audioRef.current;
      if (el && NARRATION_SRC) {
        if (next) {
          el.currentTime = 0;
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      }
      return next;
    });
  };

  return (
    <section
      className="pt-24 pb-24 lg:pt-32 lg:pb-40"
      style={{
        // Charcoal (matches MountainToRitual) -> espresso -> clay (the warm
        // "earth/resin" peak) -> back to espresso (matches FeaturedProduct's
        // new background) — never brightens to ivory/white at any point.
        background:
          'linear-gradient(180deg, #17140F 0%, #2E2015 28%, #5A4632 55%, #2E2015 100%)',
      }}
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* Intro */}
        <div className="max-w-2xl mb-20 lg:mb-28">
          <span className="block font-grotesk text-[11px] font-medium uppercase tracking-luxe-sm text-gold-light">How To Use</span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.02] tracking-tight">
            How to Take Shilajit
          </h2>
          <p className="mt-5 text-ivory/65 text-lg leading-relaxed">A simple ritual, step by step.</p>

          <audio ref={audioRef} src={NARRATION_SRC || undefined} preload="none" />
          <button
            onClick={toggleAudio}
            className="mt-6 inline-flex items-center gap-2 font-grotesk text-[11px] uppercase tracking-luxe-sm text-ivory/50 hover:text-ivory transition-colors duration-300"
          >
            {audioOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            Listen to the guide
          </button>
        </div>

        {/* Story */}
        <div ref={storyRef} className="relative">
          {/* Ritual thread — desktop only */}
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-ivory/15">
            <div ref={railFillRef} className="absolute top-0 left-0 w-full bg-gold-light origin-top" />
            <div
              ref={railGlowRef}
              className="absolute left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-light blur-[6px]"
            />
          </div>
          <div className="hidden lg:flex flex-col absolute left-0 top-0 bottom-0 justify-between -translate-x-1/2 pointer-events-none">
            {CHAPTERS.map((c, i) => (
              <div key={c.num} className="flex items-center gap-3">
                <span ref={railDotRefs.current[i]} className="w-1.5 h-1.5 rounded-full bg-gold-light shrink-0" />
                <span
                  ref={railLabelRefs.current[i]}
                  className="font-grotesk text-[10px] uppercase tracking-luxe-sm text-ivory/60 whitespace-nowrap"
                >
                  {c.num} · {c.label}
                </span>
              </div>
            ))}
          </div>

          <div className="lg:pl-40 space-y-24 lg:space-y-36">
            {CHAPTERS.map((chapter, i) => {
              const imageFirstDesktop = i % 2 === 1; // alternating editorial rhythm on desktop

              return (
                <div key={chapter.num} ref={chapterRefs.current[i]} className="relative">
                  {/* Mobile-only number, sits above the image */}
                  <span className="lg:hidden block font-display text-2xl mb-3 text-gold-light">{chapter.num}</span>

                  <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                    <div
                      className={`order-2 ${imageFirstDesktop ? 'lg:order-2' : 'lg:order-1'} lg:col-span-5`}
                    >
                      <span ref={numRefs.current[i]} className="hidden lg:block font-display text-3xl leading-none text-gold-light">
                        {chapter.num}
                      </span>
                      <h3
                        ref={headingRefs.current[i]}
                        className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-ivory"
                      >
                        {chapter.heading}
                      </h3>
                      <p ref={line1Refs.current[i]} className="mt-4 text-lg leading-relaxed font-body text-ivory/80">
                        {chapter.line1}
                      </p>
                      <p ref={line2Refs.current[i]} className="mt-1 text-base font-body text-ivory/55">
                        {chapter.line2}
                      </p>
                    </div>

                    {/* No negative-margin bleed here — a previous version
                        pulled this column outside its grid track with
                        -mr-8/-ml-8, which combined with any ancestor
                        overflow-hidden could clip the image's edge. This
                        column now stays fully inside its own grid track. */}
                    <div className={`order-1 ${imageFirstDesktop ? 'lg:order-1' : 'lg:order-2'} lg:col-span-7`}>
                      <div ref={imageRefs.current[i]} className="overflow-hidden">
                        <img
                          src={chapter.image}
                          alt={chapter.heading}
                          className="w-full h-auto"
                          style={{
                            objectFit: 'cover',
                            objectPosition: OBJECT_POSITION[chapter.key],
                            filter: 'sepia(0.04) saturate(1.05) contrast(1.02)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}