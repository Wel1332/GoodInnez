import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, CreditCard, Lock, Loader } from 'lucide-react';
import { api } from '../services/api';
import { toastService } from '../lib/toast';
import { useAuthStore } from '../store/authStore';

// Validation schema for booking
const bookingFormSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address is required'),
  cardholderName: z.string().min(3, 'Cardholder name is required'),
  cardNumber: z.string().refine((val) => /^\d{13,19}$/.test(val.replace(/\s/g, '')), 'Invalid card number'),
  expiry: z.string().refine((val) => {
    const [month, year] = val.split('/');
    if (!month || !year) return false;
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (m < 1 || m > 12) return false;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    if (y < currentYear) return false;
    if (y === currentYear && m < currentMonth) return false;
    return true;
  }, 'Invalid or expired expiration date (MM/YY)'),
  cvv: z.string().refine((val) => /^\d{3,4}$/.test(val), 'CVV must be 3-4 digits'),
});

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { hotel, dates, room } = location.state || {};
  
  const safeHotel = hotel || { name: "Sample Hotel", address: "Cebu City" };
  const safeRoom = room || { name: "Standard Room", price: 1000, id: 1 };
  const safeDates = dates || { checkIn: '', checkOut: '' };
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      fullName: user ? `${user.firstName} ${user.lastName}` : '',
      email: user ? user.email : '',
      phone: user ? user.phone : '',
      address: user ? user.address : '',
    }
  });

  const formatCardNumber = (value) => {
    return value.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const onSubmit = async (data) => {
    if (!user) {
      toastService.error('Please login to complete your booking');
      navigate('/', { state: { showAuth: true } });
      return;
    }

    setIsSubmitting(true);
    try {
      const bookingPayload = {
        checkinTime: safeDates.checkIn ? `${safeDates.checkIn}T14:00:00` : null,
        checkoutTime: safeDates.checkOut ? `${safeDates.checkOut}T11:00:00` : null,
        totalPrice: safeRoom.price,
        guest: { guestID: user.guestID },
        room: { roomID: safeRoom.id }
      };

      const newBooking = await api.createBooking(bookingPayload);
      
      const paymentPayload = {
        bookingID: newBooking.bookingID,
        guestID: user.guestID,
        roomNumber: safeRoom.id,
        totalPrice: safeRoom.price,
        checkinTime: bookingPayload.checkinTime,
        checkoutTime: bookingPayload.checkoutTime
      };

      await api.createPayment(paymentPayload);
      
      toastService.success('Booking confirmed! Redirecting to confirmation...');
      setTimeout(() => {
        navigate('/booking-success', { state: { bookingId: newBooking.bookingID } });
      }, 1500);
    } catch (err) {
      toastService.error(err.message || 'Failed to complete booking');
      setIsSubmitting(false);
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
          
          <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-black">Your Details</h3>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  className={`w-full p-4 border ${errors.fullName ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors`}
                  {...register('fullName')}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className={`w-full p-4 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors`}
                  {...register('email')}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  className={`w-full p-4 border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors`}
                  {...register('phone')}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
                <textarea 
                  className={`w-full p-4 border ${errors.address ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors resize-none`} 
                  rows="2"
                  {...register('address')}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
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
                  className={`w-full p-4 border ${errors.cardholderName ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors`}
                  {...register('cardholderName')}
                />
                {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
                <input 
                  type="text" 
                  placeholder="1234 5678 9012 3456" 
                  className={`w-full p-4 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors`}
                  {...register('cardNumber', {
                    onChange: (e) => {
                      const formatted = formatCardNumber(e.target.value);
                      if (formatted.length <= 19) e.target.value = formatted;
                    }
                  })}
                  maxLength="19"
                />
                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Expiration (MM/YY)</label>
                  <input 
                    type="text" 
                    placeholder="12/25" 
                    className={`w-full p-4 border ${errors.expiry ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors`}
                    {...register('expiry', {
                      onChange: (e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        if (value.length <= 5) e.target.value = value;
                      }
                    })}
                    maxLength="5"
                  />
                  {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">CVV</label>
                  <input 
                    type="text" 
                    placeholder="123" 
                    className={`w-full p-4 border ${errors.cvv ? 'border-red-500' : 'border-gray-200'} rounded-xl bg-gray-50 outline-none focus:bg-white focus:border-gold transition-colors`}
                    {...register('cvv', {
                      onChange: (e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) e.target.value = value;
                      }
                    })}
                    maxLength="4"
                  />
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv.message}</p>}
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gold hover:text-black transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader size={20} className="animate-spin" />}
              Confirm & Pay ₱{safeRoom.price}
            </button>
          </form>
        </div>

        {/* Right Side: Summary */}
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
              <span className="font-semibold text-black">{safeDates.checkIn || "Not set"}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Check-Out</span>
              <span className="font-semibold text-black">{safeDates.checkOut || "Not set"}</span>
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