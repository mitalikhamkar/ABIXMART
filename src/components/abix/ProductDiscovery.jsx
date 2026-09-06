// src/components/abix/ProductDiscovery.jsx
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
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

// Per-category object-position so the actual subject (mountain, glass/
// ritual, landscape, botanical composition) isn't cropped by object-cover.
const IMAGE_POSITION = {
  energy: 'center 25%',
  wellness: 'center 45%',
  focus: 'center 35%',
  exploring: 'center 40%',
};

// Distinct mineral/earth tone per card so the four cards read as one
// system with tonal variation, not four identical white boxes.
const PANEL_THEME = {
  energy: { panel: 'bg-charcoal', text: 'text-ivory', sub: 'text-ivory/55', arrow: 'text-gold-light' },
  wellness: { panel: 'bg-stone-dark', text: 'text-ivory', sub: 'text-ivory/60', arrow: 'text-gold-light' },
  focus: { panel: 'bg-moss', text: 'text-ivory', sub: 'text-ivory/65', arrow: 'text-ivory' },
  exploring: { panel: 'bg-greendark', text: 'text-ivory', sub: 'text-ivory/55', arrow: 'text-gold-light' },
};

/**
 * "The Essence Navigator" — a normal, static discovery section.
 *
 * Each card is `flex flex-col`: the image is `shrink-0` (a fixed size that
 * can never be squeezed), and the info panel is `flex-1` (it absorbs any
 * extra height a longer title needs). Because the grid stretches every
 * card in the row to match the tallest one, and only the panel — never
 * the image — flexes to take up that extra space, all four images stay
 * visually identical regardless of how many lines a title wraps to.
 *
 * The numeral and arrow live on their own fixed top row inside the panel,
 * with the title on its own line below — so a two-line title can never
 * shift or overlap the arrow.
 */
export default function ProductDiscovery() {
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const supportRef = useRef(null);

  const count = discoveryChoices.length;
  const cardRefs = useRef(Array.from({ length: count }, () => React.createRef()));
  const imageRefs = useRef(Array.from({ length: count }, () => React.createRef()));

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const cards = cardRefs.current.map((r) => r.current).filter(Boolean);
      const images = imageRefs.current.map((r) => r.current).filter(Boolean);
      const introEls = [eyebrowRef.current, headingRef.current, supportRef.current].filter(Boolean);

      if (reduceMotion) {
        gsap.set([...introEls, ...cards], { opacity: 1, y: 0 });
        gsap.set(images, { scale: 1 });
        return;
      }

      gsap.set(introEls, { opacity: 0, y: 20 });
      gsap.set(cards, { opacity: 0, y: 32 });
      gsap.set(images, { scale: 1.03 });

      // One-time entrance reveal. No scrub, no pin — plays once and stops.
      gsap
        .timeline({
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
          defaults: { ease: 'power3.out' },
        })
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0)
        .to(headingRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.1)
        .to(supportRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.2)
        .to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0.35)
        .to(images, { scale: 1, duration: 0.9, stagger: 0.1, ease: 'power2.out' }, 0.35);
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28">
        {/* Editorial header: heading on one side, orienting sentence on the other */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10 mb-14 lg:mb-16">
          <div className="max-w-xl">
            <span
              ref={eyebrowRef}
              className="block font-grotesk text-[11px] font-medium uppercase tracking-luxe-sm text-resin"
            >
              The Essence Navigator
            </span>
            <h2
              ref={headingRef}
              className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl text-greendark leading-[1.02] tracking-tight"
            >
              What are you looking for?
            </h2>
          </div>
          <p
            ref={supportRef}
            className="max-w-xs md:text-right text-foreground/60 text-base lg:text-lg leading-relaxed"
          >
            No diagnosis needed. Start with what you're looking for — we'll meet you there.
          </p>
        </div>

        {/* Static card row/grid — always fully visible, no scroll interaction */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {discoveryChoices.map((c, i) => {
            const theme = PANEL_THEME[c.key] ?? PANEL_THEME.energy;
            return (
              <button
                key={c.key}
                ref={cardRefs.current[i]}
                onClick={() => navigate('/shop')}
                className="group flex flex-col h-full text-left overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-transform duration-300"
              >
                {/* Image — fixed size, never squeezed by panel content */}
                <div className="relative shrink-0 h-72 sm:h-80 lg:h-[26rem] overflow-hidden bg-stone/20">
                  <img
                    ref={imageRefs.current[i]}
                    src={IMAGES[c.key]}
                    alt={c.title}
                    style={{ objectPosition: IMAGE_POSITION[c.key] ?? 'center' }}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/5" />
                </div>

                {/* Info panel — flex-1 absorbs any extra height a longer title
                    needs, so every card in the row ends up the same total
                    height without ever touching the image size above. */}
                <div
                  className={`flex-1 flex flex-col justify-center gap-3 p-5 lg:p-6 ${theme.panel} transition-[filter] duration-300 group-hover:brightness-110`}
                >
                  {/* Numeral + arrow share a fixed top row — a two-line
                      title below can never shift or overlap the arrow. */}
                  <div className="flex items-center justify-between transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
                    <span className={`font-grotesk text-xs ${theme.sub}`}>0{i + 1}</span>
                    <span
                      className={`font-grotesk text-sm ${theme.arrow} shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-1`}
                    >
                      →
                    </span>
                  </div>
                  <h3 className={`font-display text-xl lg:text-2xl leading-tight ${theme.text}`}>
                    {c.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}