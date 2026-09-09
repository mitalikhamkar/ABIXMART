import React from 'react';
import { motion } from 'framer-motion';

export default function AuthShell({ image, imageAlt = '', eyebrow, title, subtitle, footer, children }) {
  return (
    <div className="relative min-h-[100svh] w-full overflow-hidden bg-charcoal">
      <motion.div
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <img src={image} alt={imageAlt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal/75 via-charcoal/45 to-espresso/70" />
        <div className="absolute inset-0 grain" />
      </motion.div>

      <div className="relative z-10 min-h-[100svh] flex items-center justify-center px-6 py-16 lg:py-0">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="w-full max-w-[420px] bg-ivory/90 backdrop-blur-md border border-ivory/20 shadow-2xl px-7 py-9 sm:px-10 sm:py-11"
        >
          <span className="label-meta text-resin">{eyebrow}</span>
          <h1 className="mt-2 font-display text-3xl sm:text-[34px] leading-tight text-charcoal tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-[13px] text-foreground/60 leading-relaxed max-w-[36ch]">{subtitle}</p>
          )}

          <div className="mt-7">{children}</div>

          {footer && (
            <p className="mt-7 text-center text-[13px] text-foreground/55">{footer}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}