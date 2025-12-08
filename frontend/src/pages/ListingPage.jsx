import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import HotelCard from '../components/HotelCard';
import { api } from '../services/api';

export default function ListingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Get Search Params (Location, Dates, Guests)
  const searchParams = location.state || {}; 
  const searchLocation = searchParams.location || ""; 

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Rooms");

  useEffect(() => {
    setLoading(true);
    api.getHotels()
      .then(data => {
        // 2. Map Data & Fix Images
        const mappedHotels = data.map((h, i) => ({
          ...h,
          id: h.hotelID,
          // If DB has image, use it. Else use placeholder.
          image: h.image || (i % 2 === 0 ? '/hop-inn-hotel.jpg' : '/seda-ayala-center.jpg') 
        }));

        // 3. Filter by Search Term (Case insensitive)
        const filtered = searchLocation 
          ? mappedHotels.filter(h => 
              (h.name && h.name.toLowerCase().includes(searchLocation.toLowerCase())) ||
              (h.address && h.address.toLowerCase().includes(searchLocation.toLowerCase()))
            )
          : mappedHotels;

        setHotels(filtered);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading hotels:", error);
        setLoading(false);
      });
  }, [searchLocation]); 

  // 4. Handle Click (Pass search params forward!)
  const handleCardClick = (id) => {
    navigate(`/hotel/${id}`, { 
      state: { 
        ...searchParams // Pass checkIn, checkOut, guests to the next page
      } 
    });
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-8">
        
        {/* Filter Bar */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <div className="flex gap-8 overflow-x-auto pb-2">
            {["All Rooms", "Standard", "Deluxe", "Suite"].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveCategory(cat)}
                  className={`text-gray-500 font-semibold hover:text-black hover:border-b-2 border-gold pb-1 transition-all ${activeCategory === cat ? 'text-black border-b-2 border-gold' : ''}`}
                >
                  {cat}
                </button>
            ))}
          </div>
          <button className="flex items-center gap-2 border border-gray-300 px-5 py-2 rounded-full font-semibold hover:border-black transition-colors">
            Filters <SlidersHorizontal size={16}/>
          </button>
        </div>

        {/* Results Header */}
        <h2 className="text-3xl font-extrabold mb-8 text-black">
          {searchLocation ? `Stays in "${searchLocation}"` : "All Available Stays"}
        </h2>
        
        {/* Grid */}
        {loading ? <p className="text-center py-20 text-gray-500">Loading properties...</p> : (
            hotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {hotels.map(hotel => (
                        <div key={hotel.id} onClick={() => handleCardClick(hotel.id)}>
                            <HotelCard hotel={hotel} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No properties found matching "{searchLocation}".</p>
                </div>
            )
        )}
      </div>
    </div>
  );
}