import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Calendar, MapPin, DollarSign, Trash2, 
  CheckCircle, XCircle, Edit, Star 
} from 'lucide-react';

export default function MyBookings({ user }) {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      api.getBookings()
        .then(data => {
          const userBookings = data.filter(b => b.guestID === user.guestID);
          setBookings(userBookings);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch bookings:", err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleCancel = async (bookingID) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await api.cancelBooking(bookingID);
        setBookings(prev => prev.filter(b => b.bookingID !== bookingID));
        alert("Booking cancelled successfully.");
      } catch (err) {
        console.error("Cancel error:", err);
        alert("Failed to cancel booking: " + err.message);
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
    alert("Review feature coming soon! Thank you for staying with us.");
  };

  const filteredBookings = bookings.filter(b => {
    const isPast = new Date(b.checkoutTime) < new Date();
    return activeTab === 'upcoming' ? !isPast : isPast;
  });

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-24">
      <div className="max-w-[1120px] mx-auto px-8">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold text-black mb-2">My Bookings</h1>
          <p className="text-gray-500 text-lg">Manage and view all your hotel reservations</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-12 bg-white px-8 py-4 rounded-t-2xl">
          {['upcoming', 'past', 'cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors capitalize flex items-center gap-2 ${
                activeTab === tab 
                  ? 'border-black text-black' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab === 'upcoming' && <Calendar size={16} />}
              {tab === 'past' && <CheckCircle size={16} />}
              {tab === 'cancelled' && <XCircle size={16} />}
              {tab}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-24 bg-white rounded-2xl">
              <p className="text-gray-400 font-medium">Loading your bookings...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => {
              const checkinDate = new Date(booking.checkinTime);
              const checkoutDate = new Date(booking.checkoutTime);
              const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
              const isPast = checkoutDate < new Date();

              return (
                <div key={booking.bookingID} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="flex flex-col lg:flex-row gap-6 p-8">
                    
                    {/* Hotel Image */}
                    <div className="w-full lg:w-48 h-48 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                      <img 
                        src="/colorful-modern-hotel-room.jpg" 
                        className="w-full h-full object-cover" 
                        alt="Hotel"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-extrabold text-black mb-1">
                            Hotel Booking
                          </h3>
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <MapPin size={16} />
                            Premium location
                          </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${
                          isPast 
                            ? 'bg-gray-100 text-gray-600' 
                            : 'bg-green-50 text-green-700'
                        }`}>
                          {isPast ? 'Completed' : 'Confirmed'}
                        </div>
                      </div>

                      {/* Dates and Duration */}
                      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase mb-1">Check-in</p>
                            <p className="text-lg font-bold text-black">{checkinDate.toLocaleDateString()}</p>
                            <p className="text-xs text-gray-500">{checkinDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="text-center">
                              <p className="text-xs text-gray-500 font-medium uppercase mb-1">Duration</p>
                              <p className="text-2xl font-bold text-black">{nights}</p>
                              <p className="text-xs text-gray-500">{nights === 1 ? 'night' : 'nights'}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium uppercase mb-1">Check-out</p>
                            <p className="text-lg font-bold text-black">{checkoutDate.toLocaleDateString()}</p>
                            <p className="text-xs text-gray-500">{checkoutDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                      </div>

                      {/* Room Type and Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="inline-block bg-gold bg-opacity-20 text-black px-3 py-1 rounded-lg text-sm font-bold mb-3">
                            Standard Room
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign size={18} />
                            <span className="text-2xl font-extrabold text-black">₱{booking.totalPrice?.toLocaleString() || '0'}</span>
                            <span className="text-gray-500 text-sm">for {nights} {nights === 1 ? 'night' : 'nights'}</span>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          {!isPast && (
                            <>
                              <button 
                                onClick={() => handleModify(booking)}
                                className="bg-black text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                              >
                                <Edit size={16} /> Modify
                              </button>
                              <button 
                                onClick={() => handleCancel(booking.bookingID)}
                                className="bg-red-50 text-red-600 px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-100 transition-colors flex items-center gap-2 justify-center"
                              >
                                <Trash2 size={16} /> Cancel
                              </button>
                            </>
                          )}
                          {isPast && (
                            <button 
                              onClick={() => handleReview(booking.bookingID)}
                              className="bg-black text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                              <Star size={16} /> Write Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking ID Footer */}
                  <div className="bg-gray-50 px-8 py-3 border-t border-gray-100 text-xs text-gray-500">
                    Booking ID: #{booking.bookingID}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl">
              <div className="mb-6">
                <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              </div>
              <p className="text-gray-400 font-medium text-lg mb-2">No {activeTab} bookings yet</p>
              <p className="text-gray-500 text-sm mb-8">
                {activeTab === 'upcoming' 
                  ? "Start exploring and book your next adventure!" 
                  : "No bookings to show in this category"}
              </p>
              {activeTab === 'upcoming' && (
                <button 
                  onClick={() => navigate('/')}
                  className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors"
                >
                  Explore Hotels
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}