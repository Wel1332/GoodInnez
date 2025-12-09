import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';

export default function HotelCard({ hotel }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const imageSrc = hotel.image || '/colorful-modern-hotel-room.jpg';

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="group relative w-[280px] sm:w-[300px] h-[360px] sm:h-[380px] rounded-2xl overflow-hidden cursor-pointer shadow-2xl hover:-translate-y-2 transition-transform duration-500 bg-gray-900">
      <img 
        src={imageSrc} 
        alt={hotel.name || 'Property image'} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        onError={(e) => e.target.src = '/colorful-modern-hotel-room.jpg'}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
      
      <button 
        onClick={handleFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
      >
        <Heart size={20} fill={isFavorite ? "#ef4444" : "none"} color={isFavorite ? "#ef4444" : "white"} />
      </button>

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