import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, BookOpen, Package, MessageCircle } from 'lucide-react';
import { useShop } from '@/lib/ShopContext';

// ABIXMART Assist — a persistent floating green button that opens a
// full-screen simplified menu. Multi-page aware.
export default function AbixmartAssist() {
  const { assistOpen, openAssist, closeAssist, openCheckout } = useShop();
  const navigate = useNavigate();

  const go = (path) => { closeAssist(); navigate(path); };

  const options = [
    { key: 'buy', label: 'Buy a product', desc: 'A simple, guided purchase.', icon: ShoppingBag, action: () => { closeAssist(); openCheckout(); } },
    { key: 'understand', label: 'Understand a product', desc: 'Know what you are buying.', icon: BookOpen, action: () => go('/shop/shilajit') },
    { key: 'track', label: 'Track my order', desc: 'Where is my order?', icon: Package, action: () => go('/support#tracking') },
    { key: 'talk', label: 'Talk to us', desc: 'WhatsApp support.', icon: MessageCircle, action: () => window.open('https://wa.me/910000000000', '_blank') },
  ];

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 18 }}
        onClick={openAssist}
        className="fixed bottom-5 right-5 lg:bottom-7 lg:right-7 z-40 h-14 lg:h-16 px-5 lg:px-6 inline-flex items-center gap-2.5 bg-greendark text-ivory rounded-full shadow-2xl hover:bg-greendark/90 group"
        aria-label="ABIXMART Assist"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-60 animate-ping" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
        </span>
        <span className="font-grotesk text-[12px] font-semibold tracking-luxe-sm uppercase">Need help?</span>
      </motion.button>

      <AnimatePresence>
        {assistOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-greendark/95 backdrop-blur-md flex items-center justify-center p-6"
            onClick={closeAssist}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="label-meta text-gold-light">ABIXMART Assist</span>
                  <h2 className="mt-2 font-display text-4xl lg:text-5xl text-ivory">How can we help?</h2>
                </div>
                <button onClick={closeAssist} className="h-11 w-11 inline-flex items-center justify-center text-ivory border border-ivory/25 hover:border-gold hover:text-gold transition-colors rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {options.map((o) => (
                  <button
                    key={o.key}
                    onClick={o.action}
                    className="group flex items-start gap-4 p-6 bg-ivory/5 border border-ivory/15 hover:bg-ivory hover:text-greendark transition-colors duration-300 text-left"
                  >
                    <o.icon size={22} className="mt-0.5 text-gold group-hover:text-greendark transition-colors" />
                    <div>
                      <h3 className="font-display text-2xl text-ivory group-hover:text-greendark transition-colors">{o.label}</h3>
                      <p className="mt-1 text-sm text-ivory/60 group-hover:text-greendark/60 transition-colors">{o.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <p className="mt-8 text-center text-xs text-ivory/45">
                Designed to be simple for everyone — no account needed to buy.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}