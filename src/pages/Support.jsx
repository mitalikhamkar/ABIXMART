import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, BookOpen, Package, Truck, HelpCircle, MessageCircle, Check } from 'lucide-react';
import PageTransition from '@/components/abix/PageTransition';
import Eyebrow from '@/components/abix/Eyebrow';
import FAQAccordion from '@/components/abix/FAQAccordion';
import { supportOptions, faqs, orderSteps } from '@/data/products';

const iconMap = { ShoppingBag, BookOpen, Package, Truck, HelpCircle, MessageCircle };

export default function Support() {
  const [orderId, setOrderId] = useState('');
  const [tracked, setTracked] = useState(false);

  // Mock tracking — demo state only.
  const demoStage = 3; // "Out for Delivery"

  const handleTrack = (e) => {
    e.preventDefault();
    setTracked(true);
  };

  return (
    <PageTransition>
      {/* Hero — sand */}
      <section className="bg-sand pt-28 lg:pt-36 pb-16 lg:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Eyebrow tone="moss">ABIXMART Support</Eyebrow>
          <h1 className="mt-5 font-display text-5xl sm:text-6xl lg:text-7xl text-greendark leading-[1] tracking-tight">
            How can we help?
          </h1>
          <p className="mt-6 max-w-xl text-foreground/65 text-lg leading-relaxed">
            We designed this to be simple — for everyone. Choose what you need below, or reach us directly.
          </p>
        </div>
      </section>

      {/* Help options — ivory */}
      <section className="bg-ivory py-16 lg:py-24 border-t border-greendark/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {supportOptions.map((o, i) => {
              const Icon = iconMap[o.icon] || HelpCircle;
              return (
                <motion.div
                  key={o.key}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
                >
                  <Link
                    to={o.to}
                    className="group h-full flex items-start gap-5 p-7 border border-greendark/12 hover:border-greendark hover:bg-sand transition-colors duration-300"
                  >
                    <span className="h-12 w-12 shrink-0 inline-flex items-center justify-center bg-greendark text-ivory group-hover:bg-gold group-hover:text-greendark transition-colors">
                      <Icon size={20} />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl text-greendark group-hover:text-gold transition-colors">{o.label}</h3>
                      <p className="mt-1 text-sm text-foreground/60 leading-relaxed">{o.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Order tracking — sand */}
      <section id="tracking" className="bg-sand py-16 lg:py-24 border-t border-greendark/5 scroll-mt-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Eyebrow tone="moss">Order tracking</Eyebrow>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl text-greendark leading-[1.02] tracking-tight">
            Where is my order?
          </h2>
          <p className="mt-4 text-foreground/60 leading-relaxed">
            Enter your order ID to see its journey. This is a demo — real tracking arrives with the full store.
          </p>

          <form onSubmit={handleTrack} className="mt-7 flex flex-col sm:flex-row gap-3">
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ABX-2026-001"
              className="flex-1 h-14 px-5 bg-ivory border border-greendark/20 text-greendark placeholder:text-foreground/40 focus:outline-none focus:border-gold transition-colors"
            />
            <button className="h-14 px-8 bg-greendark text-ivory text-[12px] font-semibold tracking-luxe-sm uppercase hover:bg-gold hover:text-greendark transition-colors duration-300">
              Track order
            </button>
          </form>

          {tracked && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 bg-ivory border border-greendark/10 p-7"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-display text-2xl text-greendark">Order {orderId || 'ABX-2026-001'}</span>
                <span className="text-xs uppercase tracking-luxe-sm text-gold">{orderSteps[demoStage].label}</span>
              </div>
              <div className="space-y-0">
                {orderSteps.map((s, i) => {
                  const done = i <= demoStage;
                  return (
                    <div key={s.key} className="grid grid-cols-[auto_1fr] gap-4">
                      <div className="flex flex-col items-center">
                        <span className={`h-7 w-7 rounded-full inline-flex items-center justify-center text-[11px] ${done ? 'bg-greendark text-ivory' : 'bg-sand text-foreground/40 border border-greendark/15'}`}>
                          {done ? <Check size={14} /> : i + 1}
                        </span>
                        {i < orderSteps.length - 1 && <span className={`w-px flex-1 my-1 ${done ? 'bg-greendark/40' : 'bg-greendark/15'}`} />}
                      </div>
                      <div className="pb-6">
                        <h4 className={`font-display text-lg ${done ? 'text-greendark' : 'text-foreground/45'}`}>{s.label}</h4>
                        <p className={`text-sm ${done ? 'text-foreground/60' : 'text-foreground/40'}`}>{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-foreground/40">Demo tracking data — not a real shipment.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* FAQ — ivory */}
      <section id="faq" className="bg-ivory py-16 lg:py-24 border-t border-greendark/5 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl text-greendark leading-[1.02] tracking-tight">
              Honest answers.
            </h2>
            <p className="mt-6 text-foreground/60 leading-relaxed">
              If something isn't covered here, the ABIXMART Assist is always one tap away.
            </p>
          </div>
          <div className="lg:col-span-8">
            <FAQAccordion items={faqs} />
            <p className="mt-8 text-xs text-foreground/45 leading-relaxed max-w-2xl">
              Disclaimer: ABIXMART Shilajit is a traditional wellness product, not a medicine. Statements have not been
              evaluated by any medical authority. Consult a qualified healthcare professional before use, especially if
              pregnant, nursing, or managing a health condition.
            </p>
          </div>
        </div>
      </section>

      {/* Contact — sand */}
      <section id="contact" className="bg-sand py-16 lg:py-24 border-t border-greendark/5 scroll-mt-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center">
          <Eyebrow tone="moss" className="justify-center">Talk to ABIXMART</Eyebrow>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl text-greendark leading-[1.02] tracking-tight">
            We're here, the human way.
          </h2>
          <p className="mt-5 text-foreground/60 leading-relaxed max-w-xl mx-auto">
            Reach us on WhatsApp for a quick reply, or send us an email. No bots, no runaround.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/910000000000" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center h-14 px-8 bg-greendark text-ivory text-[12px] font-semibold tracking-luxe-sm uppercase hover:bg-gold hover:text-greendark transition-colors duration-300">
              <MessageCircle size={18} className="mr-3" /> WhatsApp us
            </a>
            <a href="mailto:care@abixmart.com" className="inline-flex items-center justify-center h-14 px-8 border border-greendark text-greendark text-[12px] font-semibold tracking-luxe-sm uppercase hover:bg-greendark hover:text-ivory transition-colors duration-300">
              Email care@abixmart.com
            </a>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}