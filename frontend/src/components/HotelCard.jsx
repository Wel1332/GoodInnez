import React from 'react';
import { Heart, Star } from 'lucide-react';

export default function HotelCard({ hotel }) {
  const imageSrc = hotel.image || '/colorful-modern-hotel-room.jpg';

  return (
    <div className="group relative w-[300px] h-[380px] rounded-2xl overflow-hidden cursor-pointer shadow-2xl hover:-translate-y-2 transition-transform duration-500">
      <img src={imageSrc} alt={hotel.name || 'Property image'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
      
      <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-colors">
        <Heart size={20} />
      </button>

      <div className="absolute bottom-0 left-0 p-6 w-full text-white">
        <h3 className="text-xl font-bold mb-1">{hotel.name}</h3>
        <p className="text-sm text-gray-300 mb-2">{hotel.location}</p>
        <div className="flex items-center gap-1 text-gold text-sm"><Star size={14} fill="#CCA43B" /> {hotel.stars || 5}.0</div>
      </div>
    </div>
  );
}