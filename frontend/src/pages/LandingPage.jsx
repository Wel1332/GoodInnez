import React from 'react';
import HeroSection from '../components/HeroSection';
import HotelsSection from '../components/HotelsSection';
import ActivitiesSection from '../components/ActivitiesSection';

export default function LandingPage() {
  return (
    <div className="bg-white">
      <HeroSection />
      <HotelsSection />
      <ActivitiesSection />
    </div>
  );
}