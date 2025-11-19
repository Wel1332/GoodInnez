import React from 'react';
import './HotelCard.css';

export default function HotelCard({ hotel }) {
  return (
    // The background image is applied here
    <div 
      className="hotel-card" 
      style={{ backgroundImage: `url(${hotel.image})` }}
    >
      <button className="favorite-btn">
        ♡
      </button>
      
      {/* This info div floats at the bottom */}
      <div className="hotel-info">
        <h3 className="hotel-name">{hotel.name}</h3>
        <p className="hotel-location">{hotel.location}</p>
      </div>
    </div>
  );
}