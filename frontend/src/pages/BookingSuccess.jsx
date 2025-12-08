import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, CalendarDays } from 'lucide-react';

export default function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = location.state || {}; // Get ID passed from BookingPage

  return (
    <div className="bg-white min-h-screen flex items-center justify-center pt-20 pb-20 px-4">
      <div className="max-w-lg w-full bg-white border border-gray-200 rounded-3xl p-10 text-center shadow-xl animate-in fade-in zoom-in-95 duration-300">
        
        <div className="flex justify-center mb-6">
          <CheckCircle size={64} className="text-green-500" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-black mb-3">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          You are all set! We have sent a confirmation email to your inbox.
        </p>

        {bookingId && (
          <div className="bg-gray-50 py-3 px-6 rounded-xl inline-flex items-center gap-2 mb-8 border border-gray-100">
            <span className="text-gray-500 text-sm">Booking ID:</span>
            <strong className="text-black text-lg">#{bookingId}</strong>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => navigate('/profile', { state: { tab: 'bookings' } })}
            className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gold hover:text-black transition-all flex items-center justify-center gap-2"
          >
            <CalendarDays size={18} /> View My Bookings
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-white border border-gray-200 text-black py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={18} /> Return Home
          </button>
        </div>

      </div>
    </div>
  );
}