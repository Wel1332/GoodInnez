import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelCard from './HotelCard';
import { api } from '../services/api';
import { MapPin } from 'lucide-react';

export default function HotelsSection() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHotels()
      .then(data => {
        const mappedHotels = data.map((hotel, index) => ({
          id: hotel.hotelID,
          name: hotel.name,
          location: hotel.address,
          // --- CRITICAL FIX: Use DB Image First ---
          image: hotel.image ? hotel.image : (index % 2 === 0 ? '/hop-inn-hotel.jpg' : '/seda-ayala-center.jpg'),
          stars: hotel.stars
        }));
        // Show first 4
        setHotels(mappedHotels.slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleShowMap = () => {
    window.open('https://www.google.com/maps/search/hotels+in+Cebu+City', '_blank');
  };

  return (
    <section id="hotels" className="relative py-24 bg-[url('/glitter.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#b4821e] to-[#78500a] opacity-90 z-0"></div>
      
      <div className="relative z-10 max-w-[1200px] mx-auto px-8 mb-16 flex flex-col md:flex-row justify-between items-center bg-white/15 backdrop-blur-md border border-white/25 rounded-full py-6 px-12 shadow-lg">
        <h2 className="text-3xl font-bold text-white text-shadow-sm">
          <span className="border-b-4 border-white pb-2 mr-2">Nearby Hostels</span> in Cebu City
        </h2>
        <button onClick={handleShowMap} className="flex items-center gap-2 text-white font-semibold hover:text-gold transition-colors">
          <MapPin size={18} /> Show On Map
        </button>
      </div>

      <div className="relative z-10 flex flex-wrap justify-center gap-8 max-w-[1400px] mx-auto px-8">
        {loading ? <p className="text-white">Loading...</p> : 
          hotels.map(hotel => (
            <div key={hotel.id} onClick={() => navigate(`/hotel/${hotel.id}`)}>
               <HotelCard hotel={hotel} />
            </div>
          ))
        }
      </div>
    </section>
  );
}