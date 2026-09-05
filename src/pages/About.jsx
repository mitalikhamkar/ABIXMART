import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageTransition from '@/components/abix/PageTransition';
import Eyebrow from '@/components/abix/Eyebrow';
import AbixmartCircle from '@/components/abix/AbixmartCircle';
import { storyStages, SOURCING_IMAGE, PURIFICATION_IMAGE, RITUAL_IMAGE, HERO_IMAGE, trustPillars } from '@/data/products';

export default function About() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);

  return (
    <PageTransition>
      {/* Hero — dark */}
      <section className="relative bg-greendark min-h-[80vh] flex items-end overflow-hidden grain">
        <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
          <img src={HERO_IMAGE} alt="The Himalayas" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-greendark/50 via-greendark/40 to-greendark/85" />
        </motion.div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 pb-20 lg:pb-28 pt-32">
          <Eyebrow light>About ABIXMART</Eyebrow>
          <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl text-ivory leading-[0.98] tracking-tight max-w-4xl">
            Rooted in the Himalayas.<br />
            <span className="italic text-ivory/90">Designed for modern life.</span>
          </h1>
          <p className="mt-7 max-w-xl text-ivory/75 text-lg leading-relaxed">
            We are a wellness brand built around a single idea — that ancient origin and modern experience
            belong together. No noise. No invented claims. Just the mountain, the process, and the ritual.
          </p>
        </div>
      </section>

      {/* Philosophy — ivory */}
      <section className="bg-ivory py-24 lg:py-36">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <Eyebrow className="justify-center">Our philosophy</Eyebrow>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl text-greendark leading-[1.05] tracking-tight text-balance">
            We trade in origin, process, and care — not in claims we can't verify.
          </h2>
          <p className="mt-8 text-foreground/65 text-lg leading-relaxed max-w-2xl mx-auto">
            ABIXMART began with a simple question: what if a wellness brand showed you everything, and promised
            only what it could stand behind? The answer is the ten-stage journey you can read openly, and a
            product made in small batches, with intention.
          </p>
        </div>
      </section>

      {/* Origin — sand with image */}
      <section className="bg-sand py-24 lg:py-36 border-t border-greendark/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <img src={SOURCING_IMAGE} alt="Himalayan sourcing" className="h-full w-full object-cover" />
            <div className="absolute inset-0 ring-1 ring-inset ring-greendark/10" />
          </motion.div>
          <div>
            <Eyebrow tone="moss">Natural origin</Eyebrow>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl text-greendark leading-[1.02] tracking-tight">
              From the high Himalayas.
            </h2>
            <p className="mt-6 text-foreground/65 text-lg leading-relaxed">
              Our Shilajit is gathered from high-altitude Himalayan rock, where it forms slowly over centuries.
              We collect in small quantities, with respect for the mountain and its rhythms — never more than
              the land can give.
            </p>
          </div>
        </div>
      </section>

      {/* Process timeline — dark */}
      <section ref={ref} className="relative bg-greendark py-24 lg:py-36 overflow-hidden grain">
        <div className="absolute inset-0 opacity-15">
          <img src={PURIFICATION_IMAGE} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-greendark via-greendark/90 to-greendark" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-10">
          <Eyebrow light>The manufacturing journey</Eyebrow>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.02] tracking-tight">
            Ten stages, nothing hidden.
          </h2>
          <div className="mt-14 space-y-0">
            {storyStages.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-[auto_1fr] gap-6 lg:gap-10 pb-10"
              >
                <span className="font-display text-3xl lg:text-4xl text-gold/80 leading-none pt-1">{s.num}</span>
                <div className="border-l border-ivory/15 pl-6 lg:pl-10 pb-2">
                  <h3 className="font-display text-2xl lg:text-3xl text-ivory">{s.title}</h3>
                  <p className="mt-2 text-ivory/70 leading-relaxed max-w-xl">{s.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality / trust — ivory */}
      <section className="bg-ivory py-24 lg:py-36 border-t border-greendark/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl mb-14">
            <Eyebrow>Quality & transparency</Eyebrow>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl text-greendark leading-[1.02] tracking-tight">
              Know what goes into ABIXMART.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-greendark/10">
            {trustPillars.map((p, i) => (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="bg-ivory p-8 lg:p-10 group hover:bg-sand transition-colors duration-500"
              >
                <span className="text-[10px] uppercase tracking-luxe-sm text-gold">{p.label}</span>
                <h3 className="mt-4 font-display text-2xl text-greendark leading-tight">{p.title}</h3>
                <p className="mt-3 text-sm text-foreground/60 leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision — sand */}
      <section className="bg-sand py-24 lg:py-36 border-t border-greendark/5">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <Eyebrow tone="moss" className="justify-center">Our vision</Eyebrow>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl text-greendark leading-[1.05] tracking-tight text-balance">
            To make ancient wellness feel modern — without losing what made it ancient.
          </h2>
          <p className="mt-8 text-foreground/65 text-lg leading-relaxed max-w-2xl mx-auto">
            We are building ABIXMART slowly, the way the mountain makes Shilajit. More products will come —
            Ashwagandha, Triphala, Amla, Moringa — each with the same patience, the same transparency, the same
            respect for origin.
          </p>
          <Link to="/shop" className="group mt-10 inline-flex items-center h-14 px-9 bg-greendark text-ivory text-[12px] font-semibold tracking-luxe-sm uppercase hover:bg-gold hover:text-greendark transition-colors duration-300">
            Explore the shop
            <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </section>

      <AbixmartCircle />
    </PageTransition>
  );
}