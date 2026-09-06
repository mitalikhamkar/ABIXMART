import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { discoveryChoices } from '@/data/products';
import energyImg from '@/assets/navigator/Energy & Vitality.png';
import wellnessImg from '@/assets/navigator/Daily Wellness.png';
import focusImg from '@/assets/navigator/Focus & Balance.png';
import exploringImg from '@/assets/navigator/Explore Natural Wellness.png';

// Atmospheric/lifestyle images supplied by Mitali — not product photography.
const IMAGES = {
  energy: energyImg,
  wellness: wellnessImg,
  focus: focusImg,
  exploring: exploringImg,
};

/**
 * "The Essence Navigator" — premium horizontal-scroll category doors.
 *
 * Desktop (>=1024px): the section pins while the vertical scroll is
 * translated into horizontal movement of the card track via a scrubbed
 * ScrollTrigger, until all four cards have passed, then it releases and
 * normal vertical scroll continues. Each image carries a subtle opposing
 * parallax drift as the track moves, for depth.
 *
 * Mobile/tablet (<1024px): no pin/scrub — the track is a native
 * horizontally-scrollable, snap strip. Simpler, no janky scroll hijacking.
 *
 * `prefers-reduced-motion`: everything is shown in its resting state,
 * no scale/opacity/scroll-driven animation.
 */
export default function ProductDiscovery() {
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const trackWrapRef = useRef(null);
  const trackRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const supportRef = useRef(null);

  const count = discoveryChoices.length;
  const cardRefs = useRef(Array.from({ length: count }, () => React.createRef()));
  const imageRefs = useRef(Array.from({ length: count }, () => React.createRef()));
  const contentRefs = useRef(Array.from({ length: count }, () => React.createRef()));

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const cards = cardRefs.current.map((r) => r.current).filter(Boolean);
      const images = imageRefs.current.map((r) => r.current).filter(Boolean);
      const contents = contentRefs.current.map((r) => r.current).filter(Boolean);
      const introEls = [eyebrowRef.current, headingRef.current, supportRef.current].filter(Boolean);

      if (reduceMotion) {
        gsap.set([...introEls, ...cards, ...contents], { opacity: 1, y: 0 });
        gsap.set(images, { scale: 1, xPercent: 0 });
        return;
      }

      gsap.set(introEls, { opacity: 0, y: 24 });
      gsap.set(cards, { opacity: 0, y: 40 });
      gsap.set(images, { scale: 1.15 });
      gsap.set(contents, { opacity: 0, y: 14 });

      // Intro + card reveal — one-time, independent of the horizontal rig below.
      gsap
        .timeline({
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
          defaults: { ease: 'power3.out' },
        })
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0)
        .to(headingRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.1)
        .to(supportRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.25)
        .to(cards, { opacity: 1, y: 0, duration: 0.65, stagger: 0.12 }, 0.4)
        .to(images, { scale: 1, duration: 1.1, stagger: 0.12, ease: 'power2.out' }, 0.4)
        .to(contents, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 }, 0.65);

      // Desktop-only pinned horizontal scroll.
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        const track = trackRef.current;
        if (!track) return;

        const scrollAmount = Math.max(track.scrollWidth - window.innerWidth, 0);
        if (scrollAmount <= 0) return;

        gsap.to(track, {
          x: -scrollAmount,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${scrollAmount}`,
            scrub: 0.6,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        images.forEach((img, i) => {
          gsap.fromTo(
            img,
            { xPercent: 0 },
            {
              xPercent: i % 2 === 0 ? 6 : -6,
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top top',
                end: () => `+=${scrollAmount}`,
                scrub: 0.6,
              },
            }
          );
        });

        return () => ScrollTrigger.refresh();
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative bg-ivory overflow-hidden">
      <div className="pt-24 lg:pt-32 pb-10 lg:pb-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 max-w-2xl">
          <span ref={eyebrowRef} className="block text-[11px] font-medium uppercase tracking-luxe-sm text-gold">
            The Essence Navigator
          </span>
          <h2
            ref={headingRef}
            className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl text-greendark leading-[1.02] tracking-tight"
          >
            What are you looking for?
          </h2>
          <p ref={supportRef} className="mt-5 text-foreground/60 text-lg leading-relaxed">
            No diagnosis. Just a gentle starting point — to help you find what feels right.
          </p>
        </div>
      </div>

      <div
        ref={trackWrapRef}
        className="overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none pb-24 lg:pb-32"
      >
        <div
          ref={trackRef}
          className="flex gap-4 lg:gap-6 px-6 lg:px-10 w-max will-change-transform"
        >
          {discoveryChoices.map((c, i) => (
            <button
              key={c.key}
              ref={cardRefs.current[i]}
              onClick={() => navigate('/shop')}
              className="group relative shrink-0 snap-start h-[420px] w-[78vw] sm:w-[52vw] md:w-[38vw] lg:h-[520px] lg:w-[30vw] overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {/* Image — the dominant visual element */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  ref={imageRefs.current[i]}
                  src={IMAGES[c.key]}
                  alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/25 to-black/10 transition-colors duration-500 group-hover:from-black/85" />
              </div>

              {/* Content overlay */}
              <div ref={contentRefs.current[i]} className="relative h-full flex flex-col justify-between p-6 lg:p-8">
                <span className="font-display text-3xl lg:text-4xl leading-none text-ivory/70">
                  0{i + 1}
                </span>

                <div className="transition-transform duration-500 ease-out group-hover:-translate-y-1">
                  <h3 className="font-display text-2xl lg:text-3xl leading-tight text-ivory">{c.title}</h3>
                  <span className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-luxe-sm text-ivory/65 transition-all duration-500 group-hover:text-gold group-hover:gap-3">
                    Discover
                    <span className="transition-transform duration-500 ease-out group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}