import React from 'react';
import Hero from '@/components/abix/Hero';
import ProductDiscovery from '@/components/abix/ProductDiscovery';
import MountainToRitual from '@/components/abix/MountainToRitual';
import FeaturedProduct from '@/components/abix/FeaturedProduct';
import MeetTheResin from '@/components/abix/MeetTheResin';
import RitualOffers from '@/components/abix/RitualOffers';
import WhatsGrowingNext from '@/components/abix/WhatsGrowingNext';
import AbixmartCircle from '@/components/abix/AbixmartCircle';
import Faq from '@/components/abix/Faq';
import PageTransition from '@/components/abix/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <ProductDiscovery />
      <MountainToRitual />
      <FeaturedProduct />
      <MeetTheResin />
      <RitualOffers />
      <WhatsGrowingNext />
      <AbixmartCircle />
      <Faq />
    </PageTransition>
  );
}