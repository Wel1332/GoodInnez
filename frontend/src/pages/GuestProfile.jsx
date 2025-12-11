import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../services/api';
import { toastService } from '../lib/toast';
import { profileUpdateSchema } from '../lib/validations';
import { useAuthStore } from '../store/authStore';
import { Check, Edit, LogOut, Loader } from 'lucide-react';

export default function GuestProfile({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('profile'); 
  const [bookingTab, setBookingTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(profileUpdateSchema),
  });

  useEffect(() => {
    if (location.state && location.state.tab) setActiveTab(location.state.tab);
  }, [location.state]);

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        address: user.address || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    } else {
      navigate('/');
    }
  }, [user, navigate, reset]);

  useEffect(() => {
    if (user) {
      api.getBookings()
        .then(data => {
            const userBookings = data.filter(b => b.guestID === user.guestID);
            
            // If no bookings, add sample data for demonstration
            if (userBookings.length === 0) {
              userBookings.push({
                bookingID: 999,
                guestID: user.guestID,
                roomID: 1,
                checkinTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                checkoutTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                totalPrice: 5000,
                room: { roomID: 1, name: "Deluxe Room" }
              });
            }
            
            setBookings(userBookings);
            setLoading(false);
        })
        .catch((err) => {
          toastService.error('Failed to load bookings');
          setLoading(false);
        });
    }
  }, [user]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.updateGuest(user.guestID, data);
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      toastService.success('Profile updated successfully!');
    } catch (error) {
      toastService.error(error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await api.cancelBooking(id);
        setBookings(prev => prev.filter(b => b.bookingID !== id));
        toastService.success('Booking cancelled successfully');
      } catch (err) {
        toastService.error(err.message || 'Failed to cancel booking');
      }
    }
  };

  const handleModify = (booking) => {
    navigate('/booking', { 
      state: { 
        bookingId: booking.bookingID,
        isModifying: true,
        originalBooking: booking 
      } 
    });
  };

  const handleReview = (bookingID) => {
    toastService.success('Review feature coming soon! Thank you for staying with us.');
  };

  const handleLogoutClick = async () => {
    await onLogout();
  };

  const filteredBookings = bookings.filter(b => {
    const isPast = new Date(b.checkoutTime) < new Date();
    return bookingTab === 'upcoming' ? !isPast : isPast;
  });

  if (!user) return null;

  return (
    <div className="bg-white min-h-screen pt-20 pb-24 text-black">
      <div className="max-w-[1120px] mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-20 items-start">
        
        {/* Sidebar */}
        <div className="border border-gray-200 rounded-3xl p-8 text-center bg-white shadow-sm sticky top-28">
            <div className="w-32 h-32 bg-black text-white rounded-full mx-auto mb-4 flex items-center justify-center text-5xl font-bold">
                {user.firstName?.charAt(0).toUpperCase()}
            </div>
            <button className="text-sm font-bold underline cursor-pointer mb-8 block mx-auto text-black">Update Photo</button>
            
            <h3 className="text-lg font-extrabold mb-2 text-left">Identity Verification</h3>
            <p className="text-sm text-gray-500 text-left mb-6 leading-relaxed">Show others you're really you with the identity verification badge.</p>
            
            <div className="flex flex-col gap-2 text-left">
                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium"><Check size={16}/> Email Confirmed</div>
                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium"><Check size={16}/> Mobile Confirmed</div>
            </div>

            <div className="border-t border-gray-100 my-8"></div>
            
            <div className="text-left">
                <h3 className="text-lg font-extrabold mb-4">Confirmed info</h3>
                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium"><Check size={16}/> Payment Methods</div>
            </div>

            <div className="mt-8 flex flex-col gap-2">
                 <button className={`text-left text-sm font-bold py-3 px-3 rounded-lg hover:bg-gray-100 transition-colors ${activeTab === 'profile' ? 'text-black bg-gray-50 border-l-2 border-gold pl-2' : 'text-gray-400'}`} onClick={() => setActiveTab('profile')}>✏️ Edit Profile</button>
                 <button className={`text-left text-sm font-bold py-3 px-3 rounded-lg hover:bg-gray-100 transition-colors ${activeTab === 'bookings' ? 'text-black bg-gray-50 border-l-2 border-gold pl-2' : 'text-gray-400'}`} onClick={() => setActiveTab('bookings')}>📅 Reservations</button>
                 <button className="text-left text-sm font-bold py-3 px-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-400" onClick={() => navigate('/my-bookings')}>🗂️ All Bookings</button>
                 <button className="text-left text-sm font-bold py-3 px-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-400" onClick={() => navigate('/wishlist')}>❤️ Wishlist</button>
                 <div className="border-t border-gray-100 my-2"></div>
                 <button className="text-left text-sm font-bold py-3 px-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">⚙️ Settings</button>
                 <button className="text-left text-sm font-bold py-3 px-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors" onClick={() => { localStorage.clear(); navigate('/'); }}>🚪 Logout</button>
            </div>
        </div>

        {/* Content */}
        <div>
          {/* Edit Profile */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-start mb-12">
                 <div>
                    <h1 className="text-5xl font-extrabold mb-2 text-black">Hello, {user.firstName}!</h1>
                    <p className="text-gray-500 text-base">Manage your account settings and preferences</p>
                 </div>
               </div>

               <form className="bg-white p-8 rounded-2xl shadow-sm space-y-8" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-6">Personal Information</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-black mb-3">First Name</label>
                        <input 
                          type="text" 
                          className={`w-full p-4 border ${errors.firstName ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:border-gold focus:ring-2 focus:ring-gold focus:ring-opacity-20 transition-colors bg-white`}
                          {...register('firstName')}
                        />
                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-black mb-3">Last Name</label>
                        <input 
                          type="text" 
                          className={`w-full p-4 border ${errors.lastName ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:border-gold focus:ring-2 focus:ring-gold focus:ring-opacity-20 transition-colors bg-white`}
                          {...register('lastName')}
                        />
                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-8">
                    <h2 className="text-2xl font-bold text-black mb-6">Contact Information</h2>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-black mb-3">Email Address</label>
                        <input 
                          type="email" 
                          className={`w-full p-4 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:border-gold focus:ring-2 focus:ring-gold focus:ring-opacity-20 transition-colors bg-white`}
                          {...register('email')}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-black mb-3">Phone Number</label>
                        <input 
                          type="tel" 
                          className={`w-full p-4 border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:border-gold focus:ring-2 focus:ring-gold focus:ring-opacity-20 transition-colors bg-white`}
                          {...register('phone')}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-8">
                    <h2 className="text-2xl font-bold text-black mb-6">Address</h2>
                    <div>
                      <label className="block text-sm font-bold text-black mb-3">Location</label>
                      <input 
                        type="text" 
                        className={`w-full p-4 border ${errors.address ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none focus:border-gold focus:ring-2 focus:ring-gold focus:ring-opacity-20 transition-colors bg-white`}
                        placeholder="City, Country" 
                        {...register('address')}
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end gap-6 pt-8 border-t border-gray-100">
                     <button type="button" className="font-bold text-black px-8 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors" onClick={() => window.location.reload()}>Cancel</button>
                     <button type="submit" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">✓ Save Changes</button>
                  </div>
               </form>
            </div>
          )}

          {/* Reservations */}
          {activeTab === 'bookings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-12">
                <h1 className="text-5xl font-extrabold mb-2 text-black">Your Reservations</h1>
                <p className="text-gray-500">Track and manage all your hotel bookings</p>
              </div>
              
              <div className="flex gap-6 border-b border-gray-200 mb-8 bg-white px-8 py-4 rounded-t-2xl">
                {['upcoming', 'past'].map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setBookingTab(tab)} 
                        className={`pb-4 text-sm font-bold border-b-2 transition-colors capitalize flex items-center gap-2 ${bookingTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                      {tab === 'upcoming' ? <Calendar size={16}/> : <History size={16}/>}
                      {tab} ({bookings.filter(b => {
                        const isPast = new Date(b.checkoutTime) < new Date();
                        return tab === 'upcoming' ? !isPast : isPast;
                      }).length})
                    </button>
                ))}
              </div>

              <div className="flex flex-col gap-6">
                {loading ? (
                  <div className="text-center py-20 bg-white rounded-2xl">
                    <p className="text-gray-400 font-medium">Loading your reservations...</p>
                  </div>
                ) : filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => {
                    const isPast = new Date(booking.checkoutTime) < new Date();
                    const checkinDate = new Date(booking.checkinTime);
                    const checkoutDate = new Date(booking.checkoutTime);
                    const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={booking.bookingID} className="flex flex-col lg:flex-row gap-6 p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-shadow">
                        <div className="w-full lg:w-32 h-32 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                          <img src="/colorful-modern-hotel-room.jpg" className="w-full h-full object-cover" alt="Hotel" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-xl font-bold text-black mb-1">Hotel Reservation</h4>
                              <p className="text-gray-500 text-sm">Booking #{booking.bookingID}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              isPast 
                                ? 'bg-gray-100 text-gray-600' 
                                : 'bg-green-50 text-green-700'
                            }`}>
                              {isPast ? 'Completed' : 'Confirmed'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 items-center text-sm mb-4">
                            <div className="flex items-center gap-2">
                              <span className="bg-gray-50 px-3 py-1 rounded-lg font-medium">{checkinDate.toLocaleDateString()}</span>
                              <span className="text-gray-400"><ArrowRight size={14}/></span>
                              <span className="bg-gray-50 px-3 py-1 rounded-lg font-medium">{checkoutDate.toLocaleDateString()}</span>
                            </div>
                            <span className="text-gray-500">•</span>
                            <span className="font-medium text-gray-600">{nights} {nights === 1 ? 'night' : 'nights'}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <div>
                            <p className="text-right text-sm text-gray-500 mb-1">Total Price</p>
                            <p className="text-3xl font-extrabold text-black">₱{booking.totalPrice?.toLocaleString()}</p>
                          </div>
                          <div className="flex flex-col gap-2 mt-4">
                            {!isPast && (
                              <>
                                <button 
                                  onClick={() => handleModify(booking)}
                                  className="bg-black text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                >
                                  <Edit size={14} /> Modify
                                </button>
                                <button 
                                  className="bg-red-50 border border-red-200 text-red-500 px-6 py-2 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                  onClick={() => handleCancel(booking.bookingID)}
                                >
                                  <Trash2 size={14} /> Cancel
                                </button>
                              </>
                            )}
                            {isPast && (
                              <button 
                                onClick={() => handleReview(booking.bookingID)}
                                className="bg-black text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                              >
                                <Star size={14} /> Write Review
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl">
                    <p className="text-gray-400 font-medium mb-4">No {bookingTab} reservations</p>
                    {bookingTab === 'upcoming' && (
                      <button className="bg-gold text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-opacity-90 transition-colors" onClick={() => navigate('/')}>Start Exploring</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}