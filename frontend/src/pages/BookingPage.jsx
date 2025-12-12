import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, CheckCircle, Building2, MapPin } from 'lucide-react';
import { api } from '../services/api'; 
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast'; 

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  
  // 1. Get Data from previous page
  const bookingData = location.state || {};
  const { hotel, room, checkIn, checkOut, guests, totalNights, totalPrice } = bookingData;
  const [isProcessing, setIsProcessing] = useState(false);

  // 2. Safety Check: Redirect if data is missing
  useEffect(() => {
    if (!hotel || !room) {
        console.warn("Missing booking data, redirecting...");
    }
  }, [hotel, room]);

  if (!hotel || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
        <h2 className="text-xl font-bold mb-4">No Booking Details Found</h2>
        <button onClick={() => navigate('/')} className="text-blue-600 underline">Return Home</button>
      </div>
    );
  }

  // 3. The "Shotgun" Submit Handler
  const handleConfirmBooking = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Helper to ensure dates are YYYY-MM-DD
      const formatDate = (dateStr) => new Date(dateStr).toISOString().split('T')[0];

      // A. Extract Room ID (Force it to be a Number)
      // We look for any key that might hold the ID from the previous page
      const rawId = room.id || room.roomID || room.roomid || room.roomNumber || room.roomId;
      const finalRoomId = Number(rawId);

      // B. Validation: Stop here if we don't have an ID
      if (!finalRoomId || isNaN(finalRoomId)) {
         throw new Error("Room ID is missing. Please go back and select a room.");
      }

      // C. Build the Universal Payload
      // We send the ID in every format common Java backends expect.
      const payload = {
        guestId: user?.id || user?.guestID || 1, 
        hotelId: Number(hotel.id),
        
        // --- KEY FIX: Send ID in all possible formats ---
        roomId: finalRoomId,       // CamelCase
        room_id: finalRoomId,      // Snake_case
        roomNumber: finalRoomId,   // Semantic name
        room_number: finalRoomId,  // Database column style

        // --- Nested Object Fix ---
        // If your Java Entity has "private Room room;", it likely expects a nested object
        room: {
            roomid: finalRoomId,
            id: finalRoomId
        },
        
        // Additional Info
        roomTypeId: Number(room.typeId || room.typeID),
        checkInDate: formatDate(checkIn),
        checkOutDate: formatDate(checkOut),
        totalPrice: Number(totalPrice),
        paymentStatus: "PENDING",
        paymentMethod: "PAY_AT_HOTEL"
      };

      console.log("🚀 Sending Universal Payload:", payload);

      const response = await api.createBooking(payload);
      
      toast.success("Reservation confirmed!");
      
      // Pass details to success page
      navigate('/booking-success', { 
          state: { 
            booking: response || payload, 
            hotel: hotel 
          } 
      });

    } catch (error) {
      console.error("Booking Failed:", error);
      const msg = error.response?.data?.message || error.message || "Booking failed.";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: User Info & Payment */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full transition">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Confirm your Booking</h1>
          </div>

          {/* Guest Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User size={20} className="text-gold" /> 
              Guest Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="block text-gray-500 text-xs uppercase tracking-wide">Full Name</span>
                <span className="font-medium text-gray-900">{user?.name || "Guest User"}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="block text-gray-500 text-xs uppercase tracking-wide">Email</span>
                <span className="font-medium text-gray-900">{user?.email || "guest@example.com"}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Card (Pay At Hotel) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600" /> 
              Payment Method
            </h3>
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex gap-4 items-start">
              <div className="bg-green-100 p-2 rounded-full shrink-0">
                <Building2 size={24} className="text-green-700" />
              </div>
              <div>
                <h4 className="font-bold text-green-900 text-lg">No Pre-payment Required</h4>
                <p className="text-green-800 text-sm mt-1">
                  You will pay <strong>₱{totalPrice?.toLocaleString()}</strong> directly at the hotel.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleConfirmBooking}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all shadow-lg 
              ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1'}
            `}
          >
            {isProcessing ? 'Processing Reservation...' : 'Confirm & Book Now'}
          </button>
        </div>

        {/* RIGHT COLUMN: Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg sticky top-28">
            <h3 className="text-gray-500 font-semibold mb-4 uppercase text-xs tracking-wider">Reservation Summary</h3>
            
            <div className="flex gap-4 mb-6 border-b border-gray-100 pb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                <img src={hotel.image || "/placeholder-hotel.jpg"} alt={hotel.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 line-clamp-1">{hotel.name}</h4>
                <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {hotel.address}
                </p>
                <div className="flex gap-1 mt-2">
                    {[...Array(hotel.stars || 5)].map((_, i) => <span key={i} className="text-gold text-xs">★</span>)}
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Check-in</span>
                <span className="font-semibold text-gray-900">{checkIn}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Check-out</span>
                <span className="font-semibold text-gray-900">{checkOut}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Guests</span>
                <span className="font-semibold text-gray-900">{guests} Adults</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{room.name} x {totalNights} nights</span>
                <span>₱{totalPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Taxes & Fees</span>
                <span>₱0</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-black">
                <span>Total</span>
                <span>₱{totalPrice?.toLocaleString()}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}