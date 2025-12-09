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
    phone: user ? user.phone : '',
    address: user ? user.address : '',
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  // Validation Functions
  const validateCardNumber = (cardNum) => {
    const cleaned = cardNum.replace(/\s+/g, '');
    // Accept any 13-19 digit card number (no Luhn check for testing)
    return /^\d{13,19}$/.test(cleaned);
  };

  const validateExpiry = (expiryStr) => {
    const [month, year] = expiryStr.split('/');
    if (!month || !year) return false;
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (m < 1 || m > 12) return false;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    const fullYear = y < 50 ? 2000 + y : 1900 + y;
    if (fullYear < new Date().getFullYear()) return false;
    if (fullYear === new Date().getFullYear() && m < currentMonth) return false;
    return true;
  };

  const validateCVV = (cvv) => /^\d{3,4}$/.test(cvv);

  const formatCardNumber = (value) => {
    return value.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if(!user) return alert("Login required");

    // 1. Comprehensive Validation
    if (!formData.fullName.trim()) return alert("Please enter your full name.");
    if (!formData.email.trim()) return alert("Please enter your email address.");
    if (!formData.phone.trim()) return alert("Please enter your phone number.");
    if (!formData.address.trim()) return alert("Please enter your address.");
    
    if (!formData.cardholderName.trim()) return alert("Please enter cardholder name.");
    if (!formData.cardNumber.trim()) return alert("Please enter card number.");
    if (!validateCardNumber(formData.cardNumber)) return alert("Invalid card number. Please check and try again.");
    if (!formData.expiry.trim()) return alert("Please enter expiration date (MM/YY).");
    if (!validateExpiry(formData.expiry)) return alert("Invalid or expired expiration date. Use MM/YY format.");
    if (!formData.cvv.trim()) return alert("Please enter CVV.");
    if (!validateCVV(formData.cvv)) return alert("Invalid CVV. Must be 3-4 digits.");

    const bookingPayload = {
      checkinTime: dates?.checkIn ? `${dates.checkIn}T14:00:00` : null,
      checkoutTime: dates?.checkOut ? `${dates.checkOut}T11:00:00` : null,
      totalPrice: safeRoom.price, 
      guest: { guestID: user.guestID },
      room: { roomID: safeRoom.id } 
    };

    try {
        console.log("Booking payload:", bookingPayload);
        // 2. Create Booking First
        const newBooking = await api.createBooking(bookingPayload);
        console.log("Booking created:", newBooking);
        
        // 3. Create Payment Record (Linked to Booking)
        const paymentPayload = {
            bookingID: newBooking.bookingID,
            guestID: user.guestID,
            roomNumber: safeRoom.id,
            totalPrice: safeRoom.price,
            checkinTime: bookingPayload.checkinTime,
            checkoutTime: bookingPayload.checkoutTime
        };

        console.log("Payment payload:", paymentPayload);
        await api.createPayment(paymentPayload);
        console.log("Payment created successfully");

        // 4. Success!
        navigate('/booking-success', { state: { bookingId: newBooking.bookingID } }); 
    } catch(err) {
        console.error("Transaction Error:", err);
        alert(`Booking Failed: ${err.message}`);
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
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                        <textarea className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors resize-none" rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
                    </div>
                </div>

                {/* Payment Info */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-black">Payment Details</h3>
                        <div className="flex gap-2">
                             <CreditCard size={24} className="text-gray-400"/>
                             <Lock size={24} className="text-gray-400"/>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Cardholder Name</label>
                        <input 
                          type="text" 
                          placeholder="John Doe" 
                          className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors" 
                          value={formData.cardholderName} 
                          onChange={e => setFormData({...formData, cardholderName: e.target.value})} 
                          required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
                        <input 
                          type="text" 
                          placeholder="1234 5678 9012 3456" 
                          className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors" 
                          value={formData.cardNumber} 
                          onChange={e => {
                            const formatted = formatCardNumber(e.target.value);
                            if (formatted.length <= 19) setFormData({...formData, cardNumber: formatted});
                          }} 
                          maxLength="19"
                          required 
                        />
                        {formData.cardNumber && !validateCardNumber(formData.cardNumber) && (
                          <p className="text-red-500 text-xs mt-1">Invalid card number</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Expiration (MM/YY)</label>
                            <input 
                              type="text" 
                              placeholder="12/25" 
                              className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors" 
                              value={formData.expiry} 
                              onChange={e => {
                                let value = e.target.value.replace(/\D/g, '');
                                if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
                                if (value.length <= 5) setFormData({...formData, expiry: value});
                              }} 
                              maxLength="5"
                              required 
                            />
                            {formData.expiry && !validateExpiry(formData.expiry) && (
                              <p className="text-red-500 text-xs mt-1">Invalid or expired</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                            <input 
                              type="text" 
                              placeholder="123" 
                              className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors" 
                              value={formData.cvv} 
                              onChange={e => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 4) setFormData({...formData, cvv: value});
                              }} 
                              maxLength="4"
                              required 
                            />
                            {formData.cvv && !validateCVV(formData.cvv) && (
                              <p className="text-red-500 text-xs mt-1">3-4 digits required</p>
                            )}
                        </div>
                    </div>
                </div>
                
                <button className="w-full bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gold hover:text-black transition-colors shadow-lg">
                    Confirm & Pay ₱{safeRoom.price}
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
                    <span>₱{safeRoom.price}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Service Fee</span>
                    <span>₱0</span>
                </div>
            </div>

            <div className="flex justify-between font-extrabold text-xl text-black pt-6 border-t border-gray-200 mt-6">
                <span>Total</span>
                <span>₱{safeRoom.price}</span>
            </div>
        </div>
      </main>
    </div>
  );
}