import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelCard from './HotelCard';
import { api } from '../services/api';
import { MapPin, AlertCircle } from 'lucide-react';

export default function HotelsSection() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getHotels();
        
        if (!data || data.length === 0) {
          setError("No hotels available at the moment");
          setHotels([]);
          return;
        }

        const mappedHotels = data.map((hotel, index) => ({
          id: hotel.hotelID,
          name: hotel.name || 'Unnamed Hotel',
          location: hotel.address || 'Location not specified',
          image: hotel.image ? hotel.image : (index % 2 === 0 ? '/hop-inn-hotel.jpg' : '/seda-ayala-center.jpg'),
          stars: hotel.stars || 5
        }));
        
        setHotels(mappedHotels.slice(0, 4));
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError('Failed to load hotels. Please try again later.');
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleShowMap = () => {
    window.open('https://www.google.com/maps/search/hotels+in+Cebu+City', '_blank');
  };

  const handleViewAll = () => {
    navigate('/listings');
  };

  const LoadingSkeleton = () => (
    <div className="w-[300px] h-[380px] rounded-2xl bg-gray-700 animate-pulse"></div>
  );

  return (
    <section id="hotels" className="relative py-24 bg-[url('/glitter.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#b4821e] to-[#78500a] opacity-90 z-0"></div>
      
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-8 mb-16">
        <div className="flex flex-col gap-4 md:flex-row justify-between items-start md:items-center bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl md:rounded-full py-6 px-6 sm:px-12 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-shadow-sm">
            <span className="border-b-4 border-white pb-2 mr-2">Nearby Hostels</span> in Cebu City
          </h2>
          <button 
            onClick={handleShowMap}
            aria-label="Show hotels on Google Maps"
            className="flex items-center gap-2 text-white font-semibold hover:text-amber-300 transition-colors whitespace-nowrap"
          >
            <MapPin size={18} /> Show On Map
          </button>
        </div>
      </div>

      {error && (
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 mb-8">
          <div className="flex items-center gap-3 bg-red-500/20 border border-red-400 rounded-lg p-4 text-red-200">
            <AlertCircle size={20} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-wrap justify-center gap-6 sm:gap-8 max-w-[1400px] mx-auto px-4 sm:px-8">
        {loading ? (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        ) : hotels.length > 0 ? (
          hotels.map(hotel => (
            <button
              key={hotel.id}
              onClick={() => navigate(`/hotel/${hotel.id}`)}
              className="focus:outline-none focus:ring-2 focus:ring-amber-300 rounded-2xl"
              aria-label={`View details for ${hotel.name}`}
            >
              <HotelCard hotel={hotel} />
            </button>
          ))
        ) : (
          <div className="text-center py-12 col-span-full">
            <p className="text-white text-lg">No hotels available at this time.</p>
            <button
              onClick={handleViewMap}
              className="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-semibold transition-colors"
            >
              Search on Google Maps
            </button>
          </div>
        )}
      </div>

      {hotels.length > 0 && (
        <div className="relative z-10 flex justify-center mt-12">
          <button
            onClick={handleViewAll}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View All Hotels
          </button>
        </div>
      )}
    </section>
  );
}