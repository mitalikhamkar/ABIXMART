import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { storyStages, SOURCING_IMAGE, PURIFICATION_IMAGE } from '@/data/products';

// Scroll-locked cinematic narrative. The stage number and text "descend"
// through the ten stages as the user scrolls.
export default function ProductStory() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const stageCount = storyStages.length;
  const activeIndex = useTransform(scrollYProgress, (v) => {
    const i = Math.min(stageCount - 1, Math.floor(v * stageCount));
    return i;
  });

  // background image cross-fade between two atmospheres
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.4, 0.15]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const purOpacity = useTransform(scrollYProgress, [0.35, 0.6, 1], [0, 0.5, 0.25]);

  return (
    <section id="story" ref={ref} className="relative bg-greendark" style={{ height: `${stageCount * 70}vh` }}>
      {/* Sticky stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden grain">
        {/* Atmosphere backgrounds */}
        <motion.div style={{ opacity: bgOpacity, scale: bgScale }} className="absolute inset-0">
          <img src={SOURCING_IMAGE} alt="Himalayan sourcing" className="h-full w-full object-cover" />
        </motion.div>
        <motion.div style={{ opacity: purOpacity }} className="absolute inset-0">
          <img src={PURIFICATION_IMAGE} alt="Resin purification" className="h-full w-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-greendark/70 via-greendark/55 to-greendark/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-greendark/60 to-transparent" />

        {/* Giant ghost numeral */}
        <StageNumber index={activeIndex} />

        {/* Content */}
        <div className="relative z-10 h-full mx-auto max-w-7xl px-6 lg:px-10 flex items-center">
          <div className="max-w-2xl">
            <span className="text-[11px] font-medium uppercase tracking-luxe-sm text-gold">The Ten Stages</span>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl text-ivory leading-[1.02] tracking-tight"
            >
              From the Himalayas<br />to your hands
            </motion.h2>

            <div className="mt-12 lg:mt-16 min-h-[180px]">
              <StageText index={activeIndex} />
            </div>

            {/* progress rail */}
            <div className="mt-12 flex items-center gap-2">
              {storyStages.map((_, i) => (
                <Rail key={i} i={i} index={activeIndex} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StageNumber({ index }) {
  const num = useTransform(index, (i) => storyStages[i]?.num ?? '01');
  return (
    <div className="absolute right-[-2vw] top-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden h-[40vw] flex items-center">
      <span className="font-display text-[42vw] lg:text-[34vw] leading-none text-ivory/10">
        <StageValue motionValue={num} />
      </span>
    </div>
  );
}

// Renders a MotionValue string into the DOM.
function StageValue({ motionValue }) {
  const [val, setVal] = React.useState(motionValue.get());
  React.useEffect(() => motionValue.on('change', setVal), [motionValue]);
  return <>{val}</>;
}

function StageText({ index }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => index.on('change', setI), [index]);
  const stage = storyStages[i];
  return (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <p className="font-display text-2xl lg:text-3xl text-gold italic">{stage.title}</p>
      <p className="mt-4 text-ivory/80 text-lg lg:text-xl leading-relaxed max-w-xl">{stage.text}</p>
    </motion.div>
  );
}

function Rail({ i, index }) {
  const [active, setActive] = React.useState(false);
  React.useEffect(() => index.on('change', (v) => setActive(v === i)), [index, i]);
  return (
    <div className={`h-px flex-1 transition-all duration-500 ${active ? 'bg-gold' : 'bg-ivory/20'}`} />
  );
}