// src/components/LandingPage.jsx
import React from 'react';
import HeroSection from './HeroSection';
import HotelsSection from './HotelsSection';
import ActivitiesSection from './ActivitiesSection';

export default function LandingPage() {
  return (
    <>
      {/* This component wraps your entire Home Page layout */}
      <HeroSection />
      <HotelsSection />
      <ActivitiesSection />
    </>
  );
}