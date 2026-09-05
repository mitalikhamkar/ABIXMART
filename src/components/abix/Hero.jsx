import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Eyebrow from './Eyebrow';
import { HERO_IMAGE } from '@/data/products';

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] w-full overflow-hidden bg-greendark grain">
      {/* Background image with parallax */}
      <motion.div
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <img
          src={HERO_IMAGE}
          alt="Himalayan stone at dawn with a premium Shilajit jar"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-greendark/40 via-greendark/20 to-greendark/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-greendark/55 via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 min-h-[100svh] flex flex-col justify-end pb-24 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Eyebrow light className="mb-7">Himalayan Modern Luxury</Eyebrow>
        </motion.div>

        <h1 className="font-display text-ivory leading-[0.95] tracking-tight text-balance">
          <motion.span
            className="block text-[15vw] sm:text-[12vw] lg:text-[8.5vw] xl:text-[120px]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            From the Himalayas.
          </motion.span>
          <motion.span
            className="block text-[15vw] sm:text-[12vw] lg:text-[8.5vw] xl:text-[120px] italic text-ivory/90"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            To your daily ritual.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.05 }}
          className="mt-8 max-w-xl text-ivory/75 text-base lg:text-lg leading-relaxed font-body"
        >
          Premium Himalayan Shilajit Pure Resin — sourced from the high mountains,
          purified by tradition, crafted for the modern ritual.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/shop"
            className="group inline-flex items-center justify-center h-14 px-9 bg-ivory text-greendark text-[12px] font-semibold tracking-luxe-sm uppercase rounded-none hover:bg-gold hover:text-greendark transition-colors duration-300"
          >
            Explore Products
            <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center justify-center h-14 px-9 border border-ivory/40 text-ivory text-[12px] font-semibold tracking-luxe-sm uppercase rounded-none hover:bg-ivory/10 transition-colors duration-300"
          >
            Discover Our Story
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-ivory/60">
        <span className="text-[10px] uppercase tracking-luxe-sm">Scroll</span>
        <ArrowDown size={14} className="scroll-hint" />
      </div>
    </section>
  );
}