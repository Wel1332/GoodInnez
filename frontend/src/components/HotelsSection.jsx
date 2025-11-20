// src/components/HotelsSection.jsx
import React from 'react';
import HotelCard from './HotelCard';
import { hotels } from '../data/hotels';
import './HotelsSection.css';

export default function HotelsSection() {
  
  const handleShowMap = () => {
    window.open('https://www.google.com/maps/search/Hostels+in+Cebu+City', '_blank');
  };

  return (
    <section className="hotels-section">
      
      {/* Container for Header */}
      <div className="section-header-glass">
        
        {/* Left: Title */}
        <h2 className="header-title">
          <span className="underline-text">Nearby Hostels</span> in Cebu City
        </h2>

        {/* Right: Button */}
        <button className="map-btn" onClick={handleShowMap}>
          <span className="icon">📍</span> Show On Map
        </button>

      </div>

      <div className="hotels-container">
        {hotels.map(hotel => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </section>
  );
}