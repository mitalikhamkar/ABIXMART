import React from 'react';
import Hero from '@/components/abix/Hero';
import MountainToRitual from '@/components/abix/MountainToRitual';
import DailyRitual from '@/components/abix/DailyRitual';
import FeaturedProduct from '@/components/abix/FeaturedProduct';
import RitualOffers from '@/components/abix/RitualOffers';
import WhatsGrowingNext from '@/components/abix/WhatsGrowingNext';
import AbixmartCircle from '@/components/abix/AbixmartCircle';
import PageTransition from '@/components/abix/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <MountainToRitual />
      <DailyRitual />
      <FeaturedProduct />
      <RitualOffers />
      <WhatsGrowingNext />
      <AbixmartCircle />
    </PageTransition>
  );
}