import React from 'react';
import Hero from '@/components/abix/Hero';
import ProductDiscovery from '@/components/abix/ProductDiscovery';
import ShilajitStory from '@/components/abix/ShilajitStory';
import FeaturedProduct from '@/components/abix/FeaturedProduct';
import ProductStory from '@/components/abix/ProductStory';
import WhyAbixmart from '@/components/abix/WhyAbixmart';
import OpenProduct from '@/components/abix/OpenProduct';
import RitualOffers from '@/components/abix/RitualOffers';
import WhatsGrowingNext from '@/components/abix/WhatsGrowingNext';
import CustomerExperience from '@/components/abix/CustomerExperience';
import AbixmartCircle from '@/components/abix/AbixmartCircle';
import Faq from '@/components/abix/Faq';
import PageTransition from '@/components/abix/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <ProductDiscovery />
      <ShilajitStory />
      <FeaturedProduct />
      <ProductStory />
      <WhyAbixmart />
      <OpenProduct />
      <RitualOffers />
      <WhatsGrowingNext />
      <CustomerExperience />
      <AbixmartCircle />
      <Faq />
    </PageTransition>
  );
}