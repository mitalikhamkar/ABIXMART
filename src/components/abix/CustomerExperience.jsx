import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

// Transparent placeholder — real reviews will replace this once collected.
// Nothing here is fabricated as a real customer.
export default function CustomerExperience() {
  return (
    <section className="bg-ivory py-24 lg:py-36 border-t border-greendark/5">
      <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
        <span className="text-[11px] font-medium uppercase tracking-luxe-sm text-gold">Customer experience</span>
        <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl text-greendark leading-[1.02] tracking-tight">
          The first voices are still being written.
        </h2>
        <p className="mt-6 text-foreground/60 text-lg leading-relaxed max-w-xl mx-auto">
          ABIXMART is just beginning. We're collecting genuine experiences from our first Circle members —
          and when they're ready, you'll read them here, unedited. No invented testimonials, no bought stars.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 inline-flex items-center gap-4 px-7 py-4 bg-sand"
        >
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={16} className="text-gold/40" />
            ))}
          </div>
          <span className="text-sm text-foreground/55">Reviews open soon</span>
        </motion.div>

        <p className="mt-8 text-xs text-foreground/40 max-w-md mx-auto">
          This section is intentionally a placeholder. We will only show real, verified customer experiences.
        </p>
      </div>
    </section>
  );
}