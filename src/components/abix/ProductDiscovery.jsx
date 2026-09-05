import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { discoveryChoices } from '@/data/products';

// "The Essence Navigator" — four large vertical panels.
export default function ProductDiscovery() {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  return (
    <section className="bg-ivory py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-14 lg:mb-20 max-w-2xl">
          <span className="text-[11px] font-medium uppercase tracking-luxe-sm text-gold">The Essence Navigator</span>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl text-greendark leading-[1.02] tracking-tight">
            What are you looking for?
          </h2>
          <p className="mt-5 text-foreground/60 text-lg leading-relaxed">
            No diagnosis. Just a gentle starting point — to help you find what feels right.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
        {discoveryChoices.map((c, i) => (
          <motion.button
            key={c.key}
            onMouseEnter={() => setActive(c.key)}
            onMouseLeave={() => setActive(null)}
            onClick={() => navigate('/shop')}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative h-[260px] sm:h-[340px] lg:h-[440px] overflow-hidden text-left p-6 lg:p-8 flex flex-col justify-between transition-all duration-500 ${
              active === c.key ? 'bg-greendark text-ivory' : 'bg-sand text-greendark'
            }`}
          >
            <span className="font-display text-5xl lg:text-7xl leading-none opacity-30 group-hover:opacity-60 transition-opacity duration-500">
              0{i + 1}
            </span>
            <div>
              <h3 className="font-display text-2xl lg:text-3xl leading-tight">{c.title}</h3>
              <p
                className={`mt-2 text-sm leading-relaxed transition-all duration-500 overflow-hidden ${
                  active === c.key ? 'max-h-32 opacity-80' : 'max-h-0 opacity-0'
                }`}
              >
                {c.line} <span className="block mt-1.5 text-xs opacity-70">{c.note}</span>
              </p>
              <span
                className={`mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-luxe-sm transition-opacity duration-300 ${
                  active === c.key ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Explore <span>→</span>
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}