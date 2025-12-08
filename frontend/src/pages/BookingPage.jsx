import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { ChevronLeft, CreditCard, Lock } from 'lucide-react';

export default function BookingPage({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { hotel, dates, room } = location.state || {}; 
  
  const safeHotel = hotel || { name: "Sample Hotel", address: "Cebu City" };
  const safeRoom = room || { name: "Standard Room", price: 1000, id: 1 };

  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    email: user ? user.email : '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const handleConfirm = async (e) => {
    e.preventDefault();
    if(!user) return alert("Login required");

    // 1. Basic Validation
    if (!formData.cardNumber || !formData.expiry || !formData.cvv) {
        alert("Please enter payment details.");
        return;
    }

    const bookingPayload = {
      checkinTime: dates?.checkIn ? `${dates.checkIn}T14:00:00` : null,
      checkoutTime: dates?.checkOut ? `${dates.checkOut}T11:00:00` : null,
      totalPrice: safeRoom.price, 
      guest: { guestID: user.guestID },
      room: { roomID: safeRoom.id } 
    };

    try {
        // 2. Create Booking First
        const newBooking = await api.createBooking(bookingPayload);
        
        // 3. Create Payment Record (Linked to Booking)
        const paymentPayload = {
            booking: { bookingID: newBooking.bookingID },
            guest: { guestID: user.guestID },
            room: { roomID: safeRoom.id },
            totalPrice: safeRoom.price,
            checkinTime: bookingPayload.checkinTime,
            checkoutTime: bookingPayload.checkoutTime
        };

        await api.createPayment(paymentPayload);

        // 4. Success!
        navigate('/booking-success', { state: { bookingId: newBooking.bookingID } }); 
    } catch(err) {
        console.error("Transaction Error:", err);
        alert("Booking Failed. Please try again.");
    }
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <main className="max-w-[1200px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Side: Forms */}
        <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-black font-bold hover:underline mb-8">
                <ChevronLeft size={20} /> Back
            </button>
            <h1 className="text-4xl font-extrabold mb-2 text-black">Confirm and pay</h1>
            <p className="text-gray-500 mb-8">Please review your details and complete the reservation.</p>
            
            <form className="space-y-8" onSubmit={handleConfirm}>
                
                {/* Personal Info */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-black">Your Details</h3>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                        <input type="text" className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input type="email" className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-black">Payment</h3>
                        <div className="flex gap-2">
                             <CreditCard size={24} className="text-gray-400"/>
                             <Lock size={24} className="text-gray-400"/>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors" value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Expiration</label>
                            <input type="text" placeholder="MM/YY" className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                            <input type="text" placeholder="123" className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors" value={formData.cvv} onChange={e => setFormData({...formData, cvv: e.target.value})} required />
                        </div>
                    </div>
                </div>
                
                <button className="w-full bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gold hover:text-black transition-colors shadow-lg">
                    Confirm & Pay ${safeRoom.price}
                </button>
            </form>
        </div>

        {/* Right Side: Summary (Unchanged) */}
        <div className="bg-gray-50 p-8 rounded-3xl h-fit border border-gray-100 shadow-sm sticky top-28">
            <div className="flex gap-6 mb-8">
                <div className="w-24 h-24 bg-gray-300 rounded-xl overflow-hidden shrink-0">
                    <img src={safeHotel.image || "/colorful-modern-hotel-room.jpg"} className="w-full h-full object-cover" alt="Hotel"/>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-1">{safeHotel.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{safeHotel.address}</p>
                    <div className="text-xs font-bold text-gold uppercase tracking-wide bg-yellow-50 px-2 py-1 rounded-md w-fit">
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
                <div className="flex justify-between text-gray-600">
                    <span>Service Fee</span>
                    <span>$0</span>
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