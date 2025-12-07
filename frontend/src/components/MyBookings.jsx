import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function MyBookings({ user }) {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    if (!user) navigate('/');
    else {
        api.getBookings().then(data => {
            setBookings(data.filter(b => b.guestID === user.guestID));
            setLoading(false);
        }).catch(()=>setLoading(false));
    }
  }, [user]);

  const handleCancel = async (id) => {
    if (window.confirm("Cancel reservation?")) {
        await api.cancelBooking(id);
        setBookings(prev => prev.filter(b => b.bookingID !== id));
    }
  };

  const filtered = bookings.filter(b => {
      const isPast = new Date(b.checkoutTime) < new Date();
      return activeTab === 'upcoming' ? !isPast : isPast;
  });

  if (!user) return null;

  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <main className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-extrabold text-black mb-8">My Trips</h1>
        
        <div className="flex gap-8 border-b border-gray-200 mb-8">
            {['upcoming', 'past'].map(tab => (
                <button key={tab} onClick={()=>setActiveTab(tab)} className={`pb-4 text-sm font-bold capitalize border-b-[3px] transition-colors ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>{tab}</button>
            ))}
        </div>

        <div className="space-y-6">
            {loading ? <p>Loading...</p> : filtered.length > 0 ? (
                filtered.map(b => (
                    <div key={b.bookingID} className="flex flex-col md:flex-row gap-6 p-6 border border-gray-200 rounded-2xl hover:shadow-lg transition-shadow bg-white">
                        <div className="w-full md:w-48 h-32 bg-gray-200 rounded-xl overflow-hidden shrink-0"><img src="/colorful-modern-hotel-room.jpg" className="w-full h-full object-cover"/></div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-black mb-1">Luxury Stay #{b.roomID}</h3>
                                    <p className="text-sm text-gray-500 mb-4">Cebu City, Philippines</p>
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Confirmed</span>
                            </div>
                            <div className="flex justify-between items-end mt-4">
                                <div className="text-sm text-gray-600">
                                    <p><span className="font-bold">Check-in:</span> {new Date(b.checkinTime).toLocaleDateString()}</p>
                                    <p><span className="font-bold">Check-out:</span> {new Date(b.checkoutTime).toLocaleDateString()}</p>
                                </div>
                                {activeTab === 'upcoming' && (
                                    <button className="text-red-500 font-bold text-sm hover:underline" onClick={() => handleCancel(b.bookingID)}>Cancel Reservation</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No trips found.</p>
                    <button className="mt-4 text-gold font-bold hover:underline" onClick={()=>navigate('/')}>Start Exploring</button>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}