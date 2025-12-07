import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import HostHeader from '../../components/HostHeader';
import { CheckCircle, XCircle } from 'lucide-react';

export default function HostReservations({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming'); 
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (!user) navigate('/'); }, [user, navigate]);

  useEffect(() => {
    fetch('http://localhost:8080/api/bookings')
      .then(res => res.json())
      .then(data => { setReservations(data); setLoading(false); })
      .catch(err => setLoading(false));
  }, []);

  const handleApprove = async (id) => { alert("Booking Approved!"); };

  const handleReject = async (id) => {
    if (window.confirm("Reject this reservation?")) {
      await api.rejectBooking(id);
      setReservations(prev => prev.filter(b => b.bookingID !== id));
    }
  };

  const now = new Date();
  const filteredList = reservations.filter(res => {
    const checkIn = new Date(res.checkinTime);
    if (activeTab === 'upcoming') return checkIn >= now;
    if (activeTab === 'past') return checkIn < now;
    return false; 
  });

  return (
    <div className="bg-white min-h-screen">
      <HostHeader />
      <main className="max-w-[1200px] mx-auto px-5 py-16">
        <h1 className="text-4xl font-extrabold text-black mb-8">Reservations</h1>
        
        <div className="flex gap-8 border-b border-gray-200 mb-10">
          {['Upcoming', 'Past', 'Rejected'].map(tab => (
            <button 
              key={tab}
              className={`pb-4 text-base font-semibold border-b-[3px] transition-colors ${activeTab === tab.toLowerCase() ? 'text-black border-black' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          {loading ? <p className="text-center text-gray-500 py-10">Loading...</p> : filteredList.length > 0 ? (
            filteredList.map(res => (
              <div key={res.bookingID} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                   <img src="/colorful-modern-hotel-room.jpg" alt="Room" className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-black mb-1">Room #{res.roomID}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span className="font-medium text-black">Check In: {new Date(res.checkinTime).toLocaleDateString()}</span>
                    <span className="text-gray-300">•</span>
                    <span>Guest ID: {res.guestID}</span>
                  </div>
                  <p className="text-gold font-bold text-lg">${res.totalPrice}</p>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                  {activeTab === 'upcoming' && (
                    <>
                      <button className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-gold hover:text-black transition-colors" onClick={() => handleApprove(res.bookingID)}>Approve</button>
                      <button className="bg-gray-100 text-gray-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-colors" onClick={() => handleReject(res.bookingID)}>Reject</button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400">
               <p>No {activeTab} reservations found.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}