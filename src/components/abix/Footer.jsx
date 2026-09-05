import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Instagram, MessageCircle } from 'lucide-react';
import { footerLinks } from '@/data/products';

export default function Footer() {
  const [done, setDone] = useState(false);

  return (
    <footer id="footer" className="bg-greendark text-ivory pt-20 lg:pt-28 pb-10 grain">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Circle signup strip */}
        <div className="grid lg:grid-cols-2 gap-10 items-center pb-16 border-b border-ivory/15">
          <div>
            <span className="font-display text-3xl lg:text-4xl">Stay close to the mountain.</span>
            <p className="mt-3 text-ivory/60 max-w-sm">Join the ABIXMART Circle for new launches and wellness stories.</p>
          </div>
          {done ? (
            <div className="flex items-center gap-2 text-gold">
              <Check size={18} /> You're on the list.
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setDone(true); }}
              className="flex items-center gap-3 max-w-md lg:justify-self-end w-full"
            >
              <input
                type="email"
                required
                placeholder="Email address"
                className="flex-1 bg-transparent border-b border-ivory/30 py-3 text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold transition-colors"
              />
              <button className="h-12 px-6 bg-ivory text-greendark text-[11px] font-semibold tracking-luxe-sm uppercase hover:bg-gold transition-colors">
                Join
              </button>
            </form>
          )}
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-10 py-16">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="font-display text-3xl tracking-tight inline-block">
              ABIX<span className="text-gold">MART</span>
            </Link>
            <p className="mt-4 text-sm text-ivory/55 leading-relaxed max-w-xs">
              Himalayan Wellness<br />Ancient origin. Modern experience.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="h-10 w-10 inline-flex items-center justify-center border border-ivory/25 hover:border-gold hover:text-gold transition-colors" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="https://wa.me/910000000000" target="_blank" rel="noreferrer" className="h-10 w-10 inline-flex items-center justify-center border border-ivory/25 hover:border-gold hover:text-gold transition-colors" aria-label="WhatsApp">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          <FooterCol title="Shop" links={footerLinks.shop} />
          <FooterCol title="About" links={footerLinks.about} />
          <FooterCol title="Support" links={footerLinks.help} />
          <FooterCol title="Legal" links={footerLinks.legal} />
        </div>

        {/* base */}
        <div className="pt-8 border-t border-ivory/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/45">
          <span>© {new Date().getFullYear()} ABIXMART. Crafted with intention.</span>
          <span className="tracking-luxe-sm">HIMALAYAN MODERN LUXURY</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <span className="text-[10px] uppercase tracking-luxe-sm text-gold">{title}</span>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-ivory/65 hover:text-ivory transition-colors">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}