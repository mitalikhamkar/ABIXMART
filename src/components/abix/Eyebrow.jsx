import React from 'react';

// Small reusable eyebrow label — the champagne-gold micro-detail.
export default function Eyebrow({ children, className = '', light = false, tone = 'gold' }) {
  const text = light ? 'text-ivory/70' : tone === 'moss' ? 'text-moss' : 'text-gold';
  const line = light ? 'bg-ivory/40' : tone === 'moss' ? 'bg-moss/50' : 'bg-gold/60';
  return (
    <span className={`inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-luxe-sm ${text} ${className}`}>
      <span className={`h-px w-6 ${line}`} />
      {children}
    </span>
  );
}