import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import HotelCard from '../components/HotelCard';
import { api } from '../services/api';

export default function ListingPage() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHotels().then(data => {
        setHotels(data.map((h, i) => ({ ...h, id: h.hotelID, image: i % 2 === 0 ? '/hop-inn-hotel.jpg' : '/seda-ayala-center.jpg' })));
        setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <div className="flex gap-8 overflow-x-auto pb-2">
            {["All Rooms", "Standard", "Deluxe", "Suite"].map(cat => (
                <button key={cat} className="text-gray-500 font-semibold hover:text-black hover:border-b-2 border-gold pb-1 transition-all">{cat}</button>
            ))}
          </div>
          <button className="flex items-center gap-2 border border-gray-300 px-5 py-2 rounded-full font-semibold hover:border-black transition-colors">
            Filters <SlidersHorizontal size={16}/>
          </button>
        </div>

        <h2 className="text-3xl font-extrabold mb-8 text-black">All Available Stays</h2>
        {loading ? <p>Loading...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {hotels.map(hotel => (<div key={hotel.id} onClick={() => navigate(`/hotel/${hotel.id}`)}><HotelCard hotel={hotel} /></div>))}
            </div>
        )}
      </div>
    </div>
  );
}