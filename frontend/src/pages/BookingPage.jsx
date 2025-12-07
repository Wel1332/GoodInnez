import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { ChevronLeft } from 'lucide-react';

export default function BookingPage({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { hotel, dates, room } = location.state || {}; 
  
  const safeHotel = hotel || { name: "Sample Hotel", address: "Cebu City" };
  const safeRoom = room || { name: "Standard Room", price: 1000, id: 1 };

  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    email: user ? user.email : '',
  });

  const handleConfirm = async (e) => {
    e.preventDefault();
    if(!user) return alert("Login required");

    const bookingPayload = {
      checkinTime: dates?.checkIn ? `${dates.checkIn}T14:00:00` : null,
      checkoutTime: dates?.checkOut ? `${dates.checkOut}T11:00:00` : null,
      totalPrice: safeRoom.price, 
      guest: { guestID: user.guestID },
      room: { roomID: safeRoom.id } 
    };

    try {
        await api.createBooking(bookingPayload);
        navigate('/booking-success', { state: { bookingId: "NEW" } }); 
    } catch(err) {
        alert("Booking Failed");
    }
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <main className="max-w-[1200px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Side: Form */}
        <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-black font-bold hover:underline mb-8">
                <ChevronLeft size={20} /> Back
            </button>
            <h1 className="text-4xl font-extrabold mb-2 text-gray-300">Confirm and pay</h1>
            <p className="text-gray-500 mb-8">Please review your details and complete the reservation.</p>
            
            <form className="space-y-6" onSubmit={handleConfirm}>
                <div>
                    <label className="block text-sm font-bold text-black mb-2">Full Name</label>
                    <input 
                        type="text" 
                        className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors" 
                        value={formData.fullName} 
                        onChange={e => setFormData({...formData, fullName: e.target.value})} 
                        required 
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-black mb-2">Email Address</label>
                    <input 
                        type="email" 
                        className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        required 
                    />
                </div>
                
                <button className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-gold hover:text-black transition-colors mt-4 w-fit">
                    Confirm Booking
                </button>
            </form>
        </div>

        {/* Right Side: Summary */}
        <div className="bg-gray-50 p-8 rounded-3xl h-fit">
            <div className="flex gap-6 mb-8">
                <div className="w-24 h-24 bg-gray-300 rounded-xl overflow-hidden shrink-0">
                    <img src="/colorful-modern-hotel-room.jpg" className="w-full h-full object-cover" alt="Hotel"/>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-1">{safeHotel.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{safeHotel.address}</p>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        {safeRoom.name}
                    </div>
                </div>
            </div>
            
            <div className="border-t border-gray-200 my-8"></div>

            <div className="space-y-4 text-sm">
                <div className="flex justify-between text-gray-600">
                    <span>Check-In</span>
                    <span className="font-semibold text-black">{dates?.checkIn || "Not set"}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Check-Out</span>
                    <span className="font-semibold text-black">{dates?.checkOut || "Not set"}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Room Price</span>
                    <span>${safeRoom.price}</span>
                </div>
            </div>

            <div className="flex justify-between font-extrabold text-xl text-black pt-6 border-t border-gray-200 mt-6">
                <span>Total</span>
                <span>${safeRoom.price}</span>
            </div>
        </div>
      </main>
    </div>
  );
}