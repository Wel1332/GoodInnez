import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Heart, Share2, BedDouble, Bath, Car, PawPrint } from 'lucide-react';

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [hotel, setHotel] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking State
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    Promise.all([
      api.getHotelById(id),
      api.getRoomsByHotel(id),
      api.getRoomTypes()
    ]).then(([hotelData, roomsData, typesData]) => {
      setHotel(hotelData);
      setAvailableRooms(roomsData);
      setRoomTypes(typesData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const getTypeDetails = (typeId) => roomTypes.find(t => t.typeID === typeId) || { name: 'Unknown', pricePerNight: 0, description: '' };
  const uniqueTypesAvailable = [...new Set(availableRooms.map(r => r.typeID))];

  const handleReserve = () => {
    if (!dates.checkIn || !dates.checkOut) return alert("Select dates.");
    if (!selectedRoom) return alert("Select a room.");
    
    const roomToBook = availableRooms.find(r => r.typeID === selectedRoom.typeID && r.status !== 'Occupied');
    if (!roomToBook) return alert("No rooms available.");

    navigate('/booking', { 
      state: { 
        hotel, // Contains the image URL
        dates, 
        guests, 
        room: { id: roomToBook.roomID, name: selectedRoom.name, price: selectedRoom.pricePerNight } 
      } 
    });
  };

  if (loading) return <div className="pt-32 text-center">Loading...</div>;
  if (!hotel) return <div className="pt-32 text-center">Hotel not found.</div>;

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 text-black">
      <div className="max-w-[1200px] mx-auto px-8">
        
        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4 h-[450px] mb-12 rounded-3xl overflow-hidden">
            {/* --- CRITICAL FIX: Use hotel.image --- */}
            <img 
              src={hotel.image || "/colorful-modern-hotel-room.jpg"} 
              alt={hotel.name} 
              className="w-full h-full object-cover" 
            />
            
            <div className="grid grid-rows-2 gap-4">
                <img src="/luxury-hotel-room.png" className="w-full h-full object-cover" />
                <div className="relative">
                    <img src="/colorful-modern-bedroom-green.jpg" className="w-full h-full object-cover" />
                    <button className="absolute inset-0 bg-black/40 text-white font-bold text-xl flex items-center justify-center hover:bg-black/50 transition-colors">+2 Photos</button>
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
                    <div className="flex gap-4"><button className="p-2 hover:bg-gray-100 rounded-full"><Heart /></button><button className="p-2 hover:bg-gray-100 rounded-full"><Share2 /></button></div>
                </div>

                <div className="flex gap-4 mb-10">
                    {[{icon:BedDouble, label:"2 Beds"}, {icon:Bath, label:"2 Baths"}, {icon:Car, label:"Parking"}, {icon:PawPrint, label:"Pets"}].map((f,i)=>(
                        <div key={i} className="flex-1 bg-gray-50 p-4 rounded-xl flex flex-col items-center gap-2 text-sm font-bold text-gray-700"><f.icon size={24} /> {f.label}</div>
                    ))}
                </div>

                <div className="mb-10"><h3 className="text-2xl font-bold mb-4">Select Room</h3><div className="flex flex-col gap-4">
                    {uniqueTypesAvailable.length > 0 ? uniqueTypesAvailable.map(typeId => {
                        const typeDetails = getTypeDetails(typeId);
                        const isSelected = selectedRoom?.typeID === typeId;
                        return (
                          <div key={typeId} onClick={() => setSelectedRoom(typeDetails)} className={`p-6 border rounded-2xl cursor-pointer flex justify-between items-center transition-all ${isSelected ? 'border-gold bg-yellow-50/50' : 'border-gray-200 hover:border-black'}`}>
                            <div><h4 className="text-xl font-bold">{typeDetails.name}</h4><p className="text-gray-500 text-sm">{typeDetails.description}</p></div>
                            <div className="text-right"><p className="text-2xl font-extrabold">${typeDetails.pricePerNight}</p></div>
                          </div>
                        );
                    }) : <p>No rooms available.</p>}
                </div></div>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl h-fit sticky top-28">
                <div className="flex items-baseline gap-2 mb-6"><span className="text-3xl font-bold">${selectedRoom ? selectedRoom.pricePerNight : '---'}</span><span className="text-gray-500">/ night</span></div>
                <div className="border border-gray-300 rounded-xl mb-4 overflow-hidden">
                    <div className="flex border-b border-gray-300">
                        <div className="flex-1 p-3 border-r border-gray-300"><label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wide">Check-In</label><input type="date" className="w-full outline-none text-sm bg-transparent" value={dates.checkIn} onChange={(e) => setDates({...dates, checkIn: e.target.value})} /></div>
                        <div className="flex-1 p-3"><label className="block text-[10px] font-bold text-gray-800 uppercase tracking-wide">Check-Out</label><input type="date" className="w-full outline-none text-sm bg-transparent" value={dates.checkOut} onChange={(e) => setDates({...dates, checkOut: e.target.value})} /></div>
                    </div>
                </div>
                <button className="w-full bg-gold text-black py-4 rounded-xl font-bold text-lg hover:bg-yellow-600 transition-colors" onClick={handleReserve}>{selectedRoom ? `Reserve ${selectedRoom.name}` : "Select a Room"}</button>
            </div>
        </div>
      </div>
    </div>
  );
}