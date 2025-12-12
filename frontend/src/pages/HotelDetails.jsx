import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { toastService } from '../lib/toast';
import { useAuthStore } from '../store/authStore';
import { HotelDetailsSkeleton } from '../components/LoadingSkeleton';
import { Heart, Share2, BedDouble, Bath, Car, PawPrint, Loader } from 'lucide-react';

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  
  const [hotel, setHotel] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReserving, setIsReserving] = useState(false);

  // Initialize dates
  const [dates, setDates] = useState({ 
    checkIn: location.state?.checkIn || '', 
    checkOut: location.state?.checkOut || '' 
  });
  const [guests, setGuests] = useState(location.state?.guests || 1);

  useEffect(() => {
    Promise.all([
      api.getHotelById(id),
      api.getRoomsByHotel(id),
      api.getRoomTypes()
    ]).then(([hotelData, roomsData, typesData]) => {
      setHotel(hotelData);
      setAvailableRooms(roomsData || []);
      setRoomTypes(typesData || []);
      
      // Auto-select first type
      if (roomsData && roomsData.length > 0 && typesData && typesData.length > 0) {
        const firstTypeId = roomsData[0].typeID || roomsData[0].typeId;
        const firstType = typesData.find(t => (t.typeID || t.typeId) === firstTypeId);
        if (firstType) setSelectedRoom(firstType);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      toastService.error('Failed to load hotel details');
      setLoading(false);
    });
  }, [id]);

  const getTypeDetails = (typeId) => roomTypes.find(t => (t.typeID || t.typeId) === typeId) || { name: 'Unknown', pricePerNight: 0, description: '' };
  
  // Helper to safely get Type ID
  const getTypeId = (obj) => obj.typeID || obj.typeId || obj.type_id;

  const uniqueTypesAvailable = [...new Set(availableRooms.map(r => getTypeId(r)))];

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => toastService.success('Link copied!'));
  };

  const handleReserve = () => {
    // 1. Validation
    if (!user) {
      toastService.error('Please log in to make a booking');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (!dates.checkIn || !dates.checkOut) {
      toastService.error('Please select valid check-in and check-out dates');
      return;
    }
    if (!selectedRoom) {
      toastService.error('Please select a room type');
      return;
    }

    // 2. DEBUGGING: Log available rooms to see what the data looks like
    console.log("Searching for room type:", getTypeId(selectedRoom));
    console.log("Available rooms:", availableRooms);

    // 3. ROBUST ROOM FINDER
    // Check for typeID, typeId, or type_id
    const targetTypeId = getTypeId(selectedRoom);
    
    const roomToBook = availableRooms.find(r => {
      const rTypeId = getTypeId(r);
      const isTypeMatch = rTypeId === targetTypeId;
      const isAvailable = r.status === 'Available' || r.status !== 'Occupied';
      return isTypeMatch && isAvailable;
    });

    if (!roomToBook) {
      toastService.error(`Sorry, no ${selectedRoom.name} rooms are available for these dates.`);
      return;
    }

    // 4. ROBUST ID GETTER (The Fix)
    // Check all possible casing variations
    const finalRoomId = roomToBook.roomID || roomToBook.roomid || roomToBook.id || roomToBook.roomId;

    if (!finalRoomId) {
      console.error("CRITICAL ERROR: Found a room object, but it has no ID field!", roomToBook);
      toastService.error("System Error: Room data is incomplete.");
      return;
    }

    console.log("Selected Room ID:", finalRoomId);

    setIsReserving(true);

    const start = new Date(dates.checkIn);
    const end = new Date(dates.checkOut);
    const diffTime = Math.abs(end - start);
    const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = (selectedRoom.pricePerNight || 0) * totalNights;

    setTimeout(() => {
      navigate('/booking', { 
        state: { 
          hotel: hotel,
          room: { 
            ...selectedRoom, 
            typeId: targetTypeId,
            id: finalRoomId,       // <--- We use the safely extracted ID
            roomNumber: finalRoomId 
          },
          checkIn: dates.checkIn,
          checkOut: dates.checkOut,
          guests: guests,
          totalNights: totalNights,
          totalPrice: totalPrice
        } 
      });
      setIsReserving(false);
    }, 500);
  };

  if (loading) return <div className="pt-32 text-center"><HotelDetailsSkeleton /></div>;
  if (!hotel) return <div className="pt-32 text-center text-gray-500">Hotel not found.</div>;

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 text-black">
      <div className="max-w-[1200px] mx-auto px-8">
        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4 h-[450px] mb-12 rounded-3xl overflow-hidden">
            <img src={hotel.image || "/colorful-modern-hotel-room.jpg"} alt={hotel.name} className="w-full h-full object-cover" />
            <div className="grid grid-rows-2 gap-4">
                <img src="/luxury-hotel-room.png" className="w-full h-full object-cover" alt="Detail" />
                <div className="relative">
                    <img src="/colorful-modern-bedroom-green.jpg" className="w-full h-full object-cover" alt="Detail" />
                    <button className="absolute inset-0 bg-black/40 text-white font-bold text-xl flex items-center justify-center">+2 Photos</button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16">
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-extrabold mb-2">{hotel.name}</h1>
                        <p className="text-gray-500 text-lg">📍 {hotel.address}</p>
                    </div>
                    <div className="flex gap-4">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition"><Heart /></button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition" onClick={handleShare}><Share2 /></button>
                    </div>
                </div>

                <div className="mb-10">
                  <h3 className="text-2xl font-bold mb-4">Select Room</h3>
                  <div className="flex flex-col gap-4">
                    {uniqueTypesAvailable.length > 0 ? uniqueTypesAvailable.map(typeId => {
                        const typeDetails = getTypeDetails(typeId);
                        const currentTypeId = getTypeId(typeDetails);
                        const isSelected = getTypeId(selectedRoom) === currentTypeId;
                        
                        return (
                          <div key={typeId} onClick={() => setSelectedRoom(typeDetails)} className={`p-6 border rounded-2xl cursor-pointer flex justify-between items-center transition-all ${isSelected ? 'border-gold bg-yellow-50/50' : 'border-gray-200 hover:border-black'}`}>
                            <div><h4 className="text-xl font-bold">{typeDetails.name}</h4><p className="text-gray-500 text-sm">{typeDetails.description}</p></div>
                            <div className="text-right"><p className="text-2xl font-extrabold">₱{typeDetails.pricePerNight}</p></div>
                          </div>
                        );
                    }) : <p className="text-gray-500">No rooms available.</p>}
                  </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl h-fit sticky top-28">
                <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-3xl font-bold">₱{selectedRoom ? selectedRoom.pricePerNight : '---'}</span>
                    <span className="text-gray-500">/ night</span>
                </div>
                
                <div className="border border-gray-300 rounded-xl mb-4 overflow-hidden">
                    <div className="flex border-b border-gray-300">
                        <div className="flex-1 p-3 border-r border-gray-300">
                          <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wide">Check-In</label>
                          <input type="date" className="w-full outline-none text-sm bg-transparent" value={dates.checkIn} onChange={(e) => setDates({...dates, checkIn: e.target.value})} />
                        </div>
                        <div className="flex-1 p-3">
                          <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wide">Check-Out</label>
                          <input type="date" className="w-full outline-none text-sm bg-transparent" value={dates.checkOut} onChange={(e) => setDates({...dates, checkOut: e.target.value})} />
                        </div>
                    </div>
                </div>
                
                <button 
                  disabled={isReserving}
                  onClick={handleReserve}
                  className="w-full bg-gold text-black py-4 rounded-xl font-bold text-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isReserving && <Loader size={20} className="animate-spin" />}
                  {selectedRoom ? `Reserve ${selectedRoom.name}` : "Select a Room"}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}