import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

// Reusable card for upcoming / "Coming Soon" products with Notify Me.
export default function ComingSoonCard({ product, index = 0 }) {
  const [notified, setNotified] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-b from-sand to-secondary">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-7xl text-greendark/20 transition-transform duration-700 group-hover:scale-110">
            {product.name.charAt(0)}
          </span>
        </div>
        <div className="absolute inset-0 ring-1 ring-inset ring-greendark/10" />
        <span className="absolute top-4 left-4 label-meta text-gold-light bg-greendark/90 px-2 py-1">
          Coming Soon
        </span>
      </div>

      <div className="mt-5 flex-1 flex flex-col">
        <h3 className="font-display text-2xl text-greendark leading-tight">{product.name}</h3>
        <p className="mt-1.5 text-sm text-foreground/60 leading-relaxed">{product.shortDesc || product.note}</p>

        <div className="mt-5">
          {notified ? (
            <div className="inline-flex items-center gap-2 text-sm text-moss">
              <Bell size={15} /> You'll be the first to know.
            </div>
          ) : (
            <button
              onClick={() => setNotified(true)}
              className="w-full h-11 inline-flex items-center justify-center border border-greendark/25 text-greendark text-[11px] font-semibold tracking-luxe-sm uppercase hover:bg-greendark hover:text-ivory transition-colors duration-300"
            >
              Notify Me
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}