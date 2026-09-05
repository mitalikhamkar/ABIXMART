import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

/**
 * Cinematic, one-time entrance timeline for the homepage hero, built on an
 * absolute-time GSAP timeline so the sequence is deterministic and visibly
 * staged rather than a set of near-simultaneous fades:
 *
 *   t=0.0s  Environment already present, subtle atmospheric settle.
 *   t=0.3s  Product begins deeper in the scene: small, higher, blurred,
 *           transparent — then moves forward/down toward the viewer,
 *           gaining scale, opacity and focus.
 *   t~1.3s  Product glides rightward onto its final resting spot on the
 *           rock, decelerating into place; grounding shadow fades in.
 *   t~2.4s  Left content reveals in strict order: eyebrow -> headline
 *           line 1 -> headline line 2 -> description -> primary CTA ->
 *           secondary CTA -> scroll/trust cue.
 *   after   A very subtle continuous idle float on the product only.
 *
 * - Respects `prefers-reduced-motion`: everything just appears, no motion.
 * - Mobile: product stays centered above the content (no rightward glide),
 *   still visibly performs the forward/focus arrival before text reveals.
 * - Runs once on mount; independent of scroll position.
 */
export function useHeroIntro(refs) {
  useGSAP(
    () => {
      const {
        background,
        productWrap,
        productImage,
        productShadow,
        eyebrow,
        headlineLine1,
        headlineLine2,
        description,
        primaryCta,
        secondaryCta,
        scrollHint,
      } = refs;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: '(prefers-reduced-motion: reduce)',
          isMobile: '(max-width: 767px)',
        },
        (context) => {
          const { reduceMotion, isMobile } = context.conditions;

          const contentEls = [
            eyebrow.current,
            headlineLine1.current,
            headlineLine2.current,
            description.current,
            primaryCta.current,
            secondaryCta.current,
          ].filter(Boolean);

          const hasProduct = Boolean(productWrap?.current && productImage?.current);

          if (reduceMotion) {
            gsap.set([background.current, ...contentEls, scrollHint.current], { opacity: 1, y: 0, scale: 1 });
            gsap.set([headlineLine1.current, headlineLine2.current], { yPercent: 0 });
            if (hasProduct) {
              gsap.set(productWrap.current, { xPercent: 0, y: 0 });
              gsap.set(productImage.current, { opacity: 1, scale: 1, rotation: 0, filter: 'blur(0px)' });
              if (productShadow?.current) gsap.set(productShadow.current, { opacity: 1, scaleX: 1 });
            }
            return;
          }

          gsap.set(background.current, { scale: isMobile ? 1.05 : 1.1, opacity: 0 });
          gsap.set(contentEls, { opacity: 0, y: isMobile ? 18 : 30 });
          gsap.set([headlineLine1.current, headlineLine2.current], { yPercent: 100 });
          gsap.set(scrollHint.current, { opacity: 0 });

          if (hasProduct) {
            gsap.set(productWrap.current, {
              xPercent: isMobile ? 0 : -46,
              y: isMobile ? -60 : -110,
            });
            gsap.set(productImage.current, {
              opacity: 0,
              scale: isMobile ? 0.62 : 0.5,
              rotation: -6,
              filter: 'blur(20px)',
              transformOrigin: '50% 65%',
            });
            if (productShadow?.current) gsap.set(productShadow.current, { opacity: 0, scaleX: 0.5 });
          }

          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

          // t=0.0 — environment already present, subtle atmospheric settle.
          tl.to(background.current, { scale: 1, opacity: 1, duration: 1.1, ease: 'power2.out' }, 0);

          if (hasProduct) {
            // t=0.3 — PRODUCT ENTERS: forward/down toward viewer, coming into focus.
            tl.to(
              productWrap.current,
              { y: 0, duration: isMobile ? 1.0 : 1.15, ease: 'power2.out' },
              0.3
            ).to(
              productImage.current,
              {
                opacity: 1,
                scale: isMobile ? 0.98 : 0.86,
                rotation: isMobile ? 0 : -2,
                filter: 'blur(3px)',
                duration: isMobile ? 1.0 : 1.15,
                ease: 'power2.out',
              },
              0.3
            );

            if (!isMobile) {
              // ~t=1.3 — PRODUCT MOVES INTO FINAL POSITION: rightward glide onto the rock, decelerating.
              tl.to(productWrap.current, { xPercent: 0, duration: 1.15, ease: 'power3.out' }, 1.3)
                .to(productImage.current, { scale: 1, rotation: 0, filter: 'blur(0px)', duration: 1.0, ease: 'power2.out' }, 1.3)
                .to(productShadow.current, { opacity: 1, scaleX: 1, duration: 0.9, ease: 'power2.out' }, 1.7);
            } else if (productShadow?.current) {
              tl.to(productImage.current, { scale: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' }, 1.2)
                .to(productShadow.current, { opacity: 1, scaleX: 1, duration: 0.6, ease: 'power2.out' }, 1.2);
            }
          }

          const textStart = isMobile ? 1.7 : 2.35;

          // Left content — only after the product has substantially settled.
          tl.to(eyebrow.current, { opacity: 1, y: 0, duration: 0.6 }, textStart)
            .to(headlineLine1.current, { yPercent: 0, duration: 0.8 }, textStart + 0.18)
            .to(headlineLine2.current, { yPercent: 0, duration: 0.8 }, textStart + 0.34)
            .to(description.current, { opacity: 1, y: 0, duration: 0.6 }, textStart + 0.62)
            .to(primaryCta.current, { opacity: 1, y: 0, duration: 0.55 }, textStart + 0.8)
            .to(secondaryCta.current, { opacity: 1, y: 0, duration: 0.55 }, textStart + 0.92)
            .to(scrollHint.current, { opacity: 1, duration: 0.5 }, textStart + 1.15);

          // Idle — extremely subtle continuous float on the product only.
          if (hasProduct) {
            tl.call(() => {
              gsap.to(productImage.current, {
                y: isMobile ? -3 : -6,
                duration: 3.6,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
              });
            });
          }
        }
      );
    },
    { scope: refs.container }
  );
}