import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function HotelCard({ hotel }) {
  const fallbackImage = '/luxury-hotel-room.png';
  const imageSrc = hotel.image || fallbackImage;

  return (
    <div className="group relative w-[280px] sm:w-[300px] h-[360px] sm:h-[380px] rounded-2xl overflow-hidden cursor-pointer shadow-2xl hover:-translate-y-2 transition-transform duration-500 bg-gray-900">
      <img 
        src={imageSrc} 
        alt={hotel.name || 'Property image'} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = fallbackImage;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>

      <div className="absolute bottom-0 left-0 p-5 sm:p-6 w-full text-white">
        <h3 className="text-lg sm:text-xl font-bold mb-1 line-clamp-2">{hotel.name}</h3>
        <p className="text-xs sm:text-sm text-gray-300 mb-2 line-clamp-1">{hotel.location}</p>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 text-amber-400 text-sm">
            <Star size={14} fill="#fbbf24" />
            <span className="font-semibold">{(hotel.stars || 5).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}