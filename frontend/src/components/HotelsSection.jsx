// src/components/HotelsSection.jsx
import React, { useState } from 'react';
import HotelCard from './HotelCard';
import { hotels } from '../data/hotels';
import './HotelsSection.css';

export default function HotelsSection() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHotels = hotels.filter((hotel) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      hotel.name.toLowerCase().includes(lowerSearch) ||
      hotel.location.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <section className="hotels-section">
      
      {/* --- SINGLE ROW LAYOUT --- */}
      <div className="section-header-glass">
        
        {/* Item 1: Title (Left) */}
        <h2>Nearby Hostels</h2>
        
        {/* Item 2: Search Bar (Center) */}
        <div className="search-wrapper">
          <input 
            type="text" 
            className="gold-search-input"
            placeholder="Search by hotel name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Item 3: Map Button (Right) */}
        <button className="map-btn">
          📍 Show On Map
        </button>
      </div>

      <div className="hotels-container">
        {filteredHotels.length > 0 ? (
          filteredHotels.map(hotel => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))
        ) : (
          <div className="no-results">
            <p>No hotels found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </section>
  );
}