import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, CheckCircle, Building2, MapPin, Loader } from 'lucide-react';
import { api } from '../services/api'; 
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast'; 

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  
  // --- STATE ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Data from navigation
  const state = location.state || {};
  const isModifying = state.isModifying || false;
  
  // Local state for the booking details
  const [bookingDetails, setBookingDetails] = useState({
    hotel: state.hotel || null,
    room: state.room || null,
    checkIn: state.checkIn || '',
    checkOut: state.checkOut || '',
    guests: state.guests || 1,
    bookingId: state.bookingId || null,
    // Store price explicitly if passed, otherwise rely on room object
    pricePerNight: state.totalPrice && state.totalNights ? (state.totalPrice / state.totalNights) : null
  });

  // --- EFFECT: Load Data for Modify Mode ---
  useEffect(() => {
    if (isModifying && (!bookingDetails.hotel || !bookingDetails.room)) {
      loadOriginalBookingData();
    }
  }, [isModifying]);

  const loadOriginalBookingData = async () => {
    setIsLoadingData(true);
    try {
      const original = state.originalBooking;
      if (!original) throw new Error("No booking ID provided");

      const roomData = await api.getRoomById(original.roomID); 
      const hotelData = await api.getHotelById(roomData.hotelID);

      setBookingDetails({
        hotel: hotelData,
        room: {
            ...roomData,
            name: roomData.roomType?.name || "Room",
            // Ensure we grab the price correctly from the API response
            pricePerNight: roomData.roomType?.pricePerNight || roomData.price || 0
        },
        checkIn: original.checkinTime.split('T')[0],
        checkOut: original.checkoutTime.split('T')[0],
        guests: 1,
        bookingId: original.bookingID,
        pricePerNight: roomData.roomType?.pricePerNight || 0
      });
      
    } catch (error) {
      console.error("Failed to load original booking:", error);
      toast.error("Could not load booking details. Please try again.");
      navigate('/profile');
    } finally {
      setIsLoadingData(false);
    }
  };

  // --- ROBUST TOTAL CALCULATION ---
  const calculateTotal = () => {
    // 1. Calculate Nights
    if (!bookingDetails.checkIn || !bookingDetails.checkOut) return { nights: 0, total: 0, price: 0 };
    
    const start = new Date(bookingDetails.checkIn);
    const end = new Date(bookingDetails.checkOut);
    const diff = end - start;
    let nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (nights < 1) nights = 1; // Minimum 1 night
    
    // 2. Find the Price (Check everywhere!)
    let price = 0;
    
    if (bookingDetails.pricePerNight) {
        price = bookingDetails.pricePerNight;
    } else if (bookingDetails.room) {
        price = bookingDetails.room.price || 
                bookingDetails.room.price_per_night || 
                bookingDetails.room.pricePerNight ||
                (bookingDetails.room.roomType ? bookingDetails.room.roomType.pricePerNight : 0) ||
                0;
    }
    
    // Force number type
    price = Number(price);

    return {
        nights: nights,
        price: price,
        total: nights * price
    };
  };

  const { nights, total, price } = calculateTotal();

  // --- HANDLER: Submit ---
  const handleConfirmBooking = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const { room, hotel, checkIn, checkOut } = bookingDetails;
      
      const formatDate = (dateStr) => new Date(dateStr).toISOString().split('T')[0];
      const rawId = room.id || room.roomID || room.roomid || room.roomNumber;
      const finalRoomId = Number(rawId);
      const guestIdToSend = user?.id || user?.guestID || user?.guestId || 1;

      const payload = {
        guestId: guestIdToSend, 
        hotelId: Number(hotel.id || hotel.hotelID),
        roomId: finalRoomId,
        room_number: finalRoomId,
        checkInDate: formatDate(checkIn),
        checkOutDate: formatDate(checkOut),
        totalPrice: Number(total),
        paymentStatus: "PENDING",
        paymentMethod: "PAY_AT_HOTEL"
      };

      console.log("🚀 Payload:", payload);

      if (isModifying) {
        await api.updateBooking(bookingDetails.bookingId, payload);
        toast.success("Reservation updated successfully!");
      } else {
        const response = await api.createBooking(payload);
        toast.success("Reservation confirmed!");
      }
      
      navigate('/booking-success', { 
          state: { 
            booking: { ...payload, status: 'Pending', bookingID: bookingDetails.bookingId }, 
            hotel: hotel 
          } 
      });

    } catch (error) {
      console.error("Action Failed:", error);
      const msg = error.response?.data?.message || error.message || "Failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const getGuestName = () => {
    if (!user) return "Guest User";
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.name) return user.name;
    return user.email || "Guest User";
  };

  if (isLoadingData) {
      return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin"/> Loading booking details...</div>;
  }

  if (!bookingDetails.hotel || !bookingDetails.room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
        <h2 className="text-xl font-bold">No Booking Details Found</h2>
        <button onClick={() => navigate('/')} className="text-blue-600 underline">Return Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full transition"><ArrowLeft size={20} /></button>
            <h1 className="text-2xl font-bold text-gray-900">
                {isModifying ? "Modify Reservation" : "Confirm your Booking"}
            </h1>
          </div>

          {/* Date Picker for Modification */}
          {isModifying && (
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Select New Dates</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Check-in</label>
                        <input 
                            type="date" 
                            value={bookingDetails.checkIn}
                            onChange={(e) => setBookingDetails({...bookingDetails, checkIn: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-gold"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Check-out</label>
                        <input 
                            type="date" 
                            value={bookingDetails.checkOut}
                            onChange={(e) => setBookingDetails({...bookingDetails, checkOut: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-gold"
                        />
                    </div>
                </div>
             </div>
          )}

          {/* Guest Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><User size={20} className="text-gold" /> Guest Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="block text-gray-500 text-xs uppercase tracking-wide">Full Name</span>
                <span className="font-medium text-gray-900">{getGuestName()}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="block text-gray-500 text-xs uppercase tracking-wide">Email</span>
                <span className="font-medium text-gray-900">{user?.email || "guest@example.com"}</span>
              </div>
            </div>
          </div>

          {!isModifying && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CheckCircle size={20} className="text-green-600" /> Payment Method</h3>
                <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex gap-4 items-start">
                <div className="bg-green-100 p-2 rounded-full shrink-0"><Building2 size={24} className="text-green-700" /></div>
                <div>
                    <h4 className="font-bold text-green-900 text-lg">No Pre-payment Required</h4>
                    <p className="text-green-800 text-sm mt-1">You will pay <strong>₱{total.toLocaleString()}</strong> at the hotel.</p>
                </div>
                </div>
            </div>
          )}

          <button 
            onClick={handleConfirmBooking}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all shadow-lg ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
          >
            {isProcessing 
                ? 'Processing...' 
                : isModifying ? 'Update Reservation' : 'Confirm & Book Now'
            }
          </button>
        </div>

        {/* RIGHT COLUMN: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg sticky top-28">
            <h3 className="text-gray-500 font-semibold mb-4 uppercase text-xs tracking-wider">
                {isModifying ? "New Summary" : "Reservation Summary"}
            </h3>
            
            <div className="flex gap-4 mb-6 border-b border-gray-100 pb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                <img src={bookingDetails.hotel.image || "/placeholder-hotel.jpg"} alt="Hotel" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 line-clamp-1">{bookingDetails.hotel.name}</h4>
                <p className="text-gray-500 text-sm flex items-center gap-1 mt-1"><MapPin size={12} /> {bookingDetails.hotel.address}</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm"><span className="text-gray-500">Check-in</span><span className="font-semibold text-gray-900">{bookingDetails.checkIn}</span></div>
              <div className="flex justify-between items-center text-sm"><span className="text-gray-500">Check-out</span><span className="font-semibold text-gray-900">{bookingDetails.checkOut}</span></div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                  {/* Display the calculated price per night here to debug */}
                  <span>{bookingDetails.room.name || "Room"} x {nights} nights</span>
                  <span>₱{total.toLocaleString()}</span>
              </div>
              {/* Optional: Show price breakdown */}
              {price > 0 && <div className="text-xs text-right text-gray-400">(₱{price.toLocaleString()} / night)</div>}
              
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg text-black"><span>Total</span><span>₱{total.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}