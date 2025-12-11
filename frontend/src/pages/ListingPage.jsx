import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import HotelCard from '../components/HotelCard';
import { HotelCardSkeleton } from '../components/LoadingSkeleton';
import { api } from '../services/api';
import { toastService } from '../lib/toast';

export default function ListingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Get Search Params (Location, Dates, Guests)
  const searchParams = location.state || {}; 
  const initialLocation = searchParams.location || ""; 

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All Rooms");
  const [resultCount, setResultCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState(initialLocation);

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

        // 3. Apply search and category filters together
        const term = (searchTerm || '').trim().toLowerCase();

        const matchesCategory = (hotel, category) => {
          if (!category || category === 'All Rooms') return true;
          const c = category.toLowerCase();
          // Try several common shapes that backend might use
          if (hotel.roomType && typeof hotel.roomType === 'string') {
            if (hotel.roomType.toLowerCase().includes(c)) return true;
          }
          if (Array.isArray(hotel.roomTypes)) {
            if (hotel.roomTypes.some(rt => {
              if (!rt) return false;
              if (typeof rt === 'string') return rt.toLowerCase().includes(c);
              // rt may be object with name/type
              return (rt.name || rt.type || '').toString().toLowerCase().includes(c);
            })) return true;
          }
          if (Array.isArray(hotel.rooms)) {
            if (hotel.rooms.some(r => (r.roomType || r.type || r.name || '').toString().toLowerCase().includes(c))) return true;
          }
          // Fallback: check hotel's categories or tags
          if (Array.isArray(hotel.categories) && hotel.categories.some(cat => cat.toString().toLowerCase().includes(c))) return true;
          // No match found
          return false;
        };

        const filtered = mappedHotels.filter(h => {
          // search term match
          const matchesTerm = term === '' || (
            (h.name && h.name.toLowerCase().includes(term)) ||
            (h.address && h.address.toLowerCase().includes(term))
          );

          // category match
          const matchesCat = matchesCategory(h, activeCategory);

          return matchesTerm && matchesCat;
        });

        setHotels(filtered);
        setResultCount(filtered.length);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading hotels:", error);
        toastService.error('Failed to load hotels');
        setLoading(false);
      });
  }, [searchTerm, activeCategory]); 

  // 4. Handle Click (Pass search params forward!)
  const handleCardClick = (id) => {
    navigate(`/hotel/${id}`, { 
      state: { 
        ...searchParams // Pass checkIn, checkOut, guests, location, type to the next page
      } 
    });
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-8">
        
        {/* Filter Bar */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          <div className="flex-1 flex items-center gap-6">
            <form onSubmit={(e) => { e.preventDefault(); }} className="flex-1">
              <input
                type="search"
                placeholder="Search city, hotel or address"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-black/10 rounded-full p-3 text-black placeholder:text-gray-400 outline-none focus:border-gold transition-colors"
              />
            </form>
            <div className="flex gap-8 overflow-x-auto pb-2">
              {["All Rooms", "Standard", "Deluxe", "Suite"].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    className={`text-gray-500 font-semibold hover:text-black hover:border-b-2 border-gold pb-1 transition-all whitespace-nowrap ${activeCategory === cat ? 'text-black border-b-2 border-gold' : ''}`}
                  >
                    {cat}
                  </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <h2 className="text-3xl font-extrabold mb-2 text-black">
          {searchTerm ? `Stays in "${searchTerm}"` : "All Available Stays"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">{loading ? 'Searching...' : `${resultCount} result${resultCount !== 1 ? 's' : ''}`} · Category: <span className="font-semibold text-gray-700">{activeCategory}</span></p>
        
        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <HotelCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          hotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {hotels.map(hotel => (
                <div key={hotel.id} onClick={() => handleCardClick(hotel.id)} className="cursor-pointer">
                  <HotelCard hotel={hotel} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">No properties found matching "{searchTerm}" for category "{activeCategory}".</p>
              <p className="text-sm text-gray-500 mt-3">Try clearing filters or searching a nearby city.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}