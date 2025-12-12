import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api'; // Ensure updateBookingStatus is in here
import { toastService } from '../../lib/toast';
import { useAuthStore } from '../../store/authStore';
import HostHeader from '../../components/HostHeader';
import { CheckCircle, XCircle, Clock, Calendar, User, History, Ban } from 'lucide-react';

export default function HostReservations() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  // Tabs: 'requests' (Pending), 'upcoming' (Confirmed), 'past', 'cancelled'
  const [activeTab, setActiveTab] = useState('requests'); 
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data
  useEffect(() => {
    // Check if user is allowed (Adjust 'employee' to 'PARTNER' if matching DB roles)
    if (!user) {
        navigate('/');
        return;
    }

    loadReservations();
  }, [user, navigate]);

  const loadReservations = async () => {
    try {
        const data = await api.getBookings();
        // Sort by newest first
        setReservations(data.reverse()); 
        setLoading(false);
    } catch (err) {
        console.error(err);
        toastService.error("Failed to load reservations");
        setLoading(false);
    }
  };

  // 2. Handle Status Change (Connects to Backend)
  const handleStatusUpdate = async (id, newStatus) => {
    // Confirmation for rejection
    if (newStatus === 'Cancelled' && !window.confirm("Are you sure you want to reject this reservation?")) {
        return;
    }

    try {
        // Optimistic UI Update (Instant feedback)
        setReservations(prev => prev.map(res => 
            res.bookingID === id ? { ...res, status: newStatus } : res
        ));

        // Call the API endpoint we created
        await api.updateBookingStatus(id, newStatus);
        
        toastService.success(newStatus === 'Confirmed' ? "Booking Approved!" : "Booking Rejected");
    } catch (e) {
        console.error(e);
        toastService.error("Failed to update status");
        loadReservations(); // Revert on error
    }
  };

  // 3. Filtering Logic
  const now = new Date();
  
  const filteredList = reservations.filter(res => {
    const checkIn = new Date(res.checkinTime);
    const status = (res.status || 'Pending').toLowerCase();
    
    if (activeTab === 'requests') {
        // Show future bookings that are still Pending
        return status === 'pending' && checkIn >= now;
    }
    if (activeTab === 'upcoming') {
        // Show future bookings that are Confirmed
        return status === 'confirmed' && checkIn >= now;
    }
    if (activeTab === 'past') {
        // Show any booking that has already happened
        return checkIn < now && status !== 'cancelled';
    }
    if (activeTab === 'cancelled') {
        return status === 'cancelled' || status === 'rejected';
    }
    return false;
  });

  // Helper for Badge Colors
  const getStatusColor = (status) => {
    const s = (status || 'Pending').toLowerCase();
    if (s === 'confirmed') return 'bg-green-100 text-green-700';
    if (s === 'cancelled') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  if (!user) return null;

  return (
    <div className="bg-white min-h-screen pb-20">
      <HostHeader />
      
      <main className="max-w-[1200px] mx-auto px-5 py-16">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h1 className="text-4xl font-extrabold text-black mb-2">Reservations</h1>
                <p className="text-gray-500">Manage incoming requests and schedule.</p>
            </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-10 overflow-x-auto">
          {[
            { id: 'requests', label: 'Requests', icon: <Clock size={18}/> },
            { id: 'upcoming', label: 'Upcoming', icon: <Calendar size={18}/> },
            { id: 'past', label: 'Past', icon: <History size={18}/> },
            { id: 'cancelled', label: 'Cancelled', icon: <Ban size={18}/> }
          ].map(tab => (
            <button 
              key={tab.id}
              className={`pb-4 text-base font-semibold border-b-[3px] transition-colors flex items-center gap-2 whitespace-nowrap
                ${activeTab === tab.id ? 'text-black border-black' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
              {/* Counter Badge */}
              {tab.id === 'requests' && (
                  <span className="bg-gold text-black text-xs px-2 py-0.5 rounded-full ml-1">
                    {reservations.filter(r => (r.status || 'Pending').toLowerCase() === 'pending' && new Date(r.checkinTime) >= now).length}
                  </span>
              )}
            </button>
          ))}
        </div>

        {/* List Content */}
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="text-center py-20"><p className="text-gray-500">Loading reservations...</p></div>
          ) : filteredList.length > 0 ? (
            filteredList.map(res => {
              // Calculate nights
              const inDate = new Date(res.checkinTime);
              const outDate = new Date(res.checkoutTime);
              const nights = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24)) || 1;

              return (
                <div key={res.bookingID} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center gap-6">
                  
                  {/* Image */}
                  <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                     <img src="/colorful-modern-hotel-room.jpg" alt="Room" className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 w-full text-left">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="text-lg font-bold text-black">Booking #{res.bookingID}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(res.status)}`}>
                            {res.status || 'Pending'}
                        </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-2">
                        <User size={16} /> Guest ID: {res.guestID || res.guestId}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} /> 
                        {inDate.toLocaleDateString()} — {outDate.toLocaleDateString()}
                      </div>
                      <div>
                        {nights} night{nights !== 1 ? 's' : ''}
                      </div>
                    </div>

                    <p className="text-black font-bold text-lg">₱{(res.totalPrice || 0).toLocaleString()}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 w-full md:w-auto justify-end">
                    {activeTab === 'requests' && (
                      <>
                        <button 
                            className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-green-600 transition-colors flex items-center gap-2" 
                            onClick={() => handleStatusUpdate(res.bookingID, 'Confirmed')}
                        >
                            <CheckCircle size={16} /> Approve
                        </button>
                        <button 
                            className="bg-gray-100 text-gray-600 px-6 py-2 rounded-full font-bold text-sm hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2" 
                            onClick={() => handleStatusUpdate(res.bookingID, 'Cancelled')}
                        >
                            <XCircle size={16} /> Reject
                        </button>
                      </>
                    )}
                    
                    {activeTab === 'upcoming' && (
                        <button 
                            className="text-gray-400 text-sm hover:text-red-500 underline" 
                            onClick={() => handleStatusUpdate(res.bookingID, 'Cancelled')}
                        >
                            Cancel Reservation
                        </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400">
               <p className="text-lg font-medium">No {activeTab} reservations found.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}