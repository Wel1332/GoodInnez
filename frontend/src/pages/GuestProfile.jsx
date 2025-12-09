import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { Check, Edit, MapPin } from 'lucide-react';

export default function GuestProfile({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('profile'); 
  const [bookingTab, setBookingTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', address: '', email: '', phone: ''
  });

  useEffect(() => {
    if (location.state && location.state.tab) setActiveTab(location.state.tab);
  }, [location.state]);

  useEffect(() => {
    if (!user) navigate('/');
    else {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        address: user.address || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      api.getBookings()
        .then(data => {
            setBookings(data.filter(b => b.guestID === user.guestID));
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.updateGuest(user.guestID, formData);
      alert("Profile updated successfully!");
    } catch (error) { alert("Failed to update profile."); }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Cancel this reservation?")) {
        await api.cancelBooking(id);
        setBookings(prev => prev.filter(b => b.bookingID !== id));
    }
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
                {user.firstName.charAt(0).toUpperCase()}
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

            {/* Mini Nav */}
            <div className="mt-8 flex flex-col gap-2">
                 <button className={`text-left text-sm font-bold py-2 hover:text-black transition-colors ${activeTab === 'profile' ? 'text-black underline' : 'text-gray-400'}`} onClick={() => setActiveTab('profile')}>Edit Profile</button>
                 <button className={`text-left text-sm font-bold py-2 hover:text-black transition-colors ${activeTab === 'bookings' ? 'text-black underline' : 'text-gray-400'}`} onClick={() => setActiveTab('bookings')}>Reservations</button>
            </div>
        </div>

        {/* Content */}
        <div>
          {/* Edit Profile */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-start mb-12">
                 <div>
                    <h1 className="text-4xl font-extrabold mb-1">Hello, {user.firstName}</h1>
                    <p className="text-gray-500 text-sm">Joined in 2024</p>
                 </div>
                 <button className="border border-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-50 transition-colors">Edit Profile</button>
               </div>

               <form className="flex flex-col gap-6" onSubmit={handleSaveProfile}>
                  <div className="grid grid-cols-2 gap-6">
                    <div><label className="block text-sm font-bold mb-2">First Name</label><input type="text" className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-black transition-colors" value={formData.firstName} onChange={e=>setFormData({...formData, firstName:e.target.value})} /></div>
                    <div><label className="block text-sm font-bold mb-2">Last Name</label><input type="text" className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-black transition-colors" value={formData.lastName} onChange={e=>setFormData({...formData, lastName:e.target.value})} /></div>
                  </div>
                  <div><label className="block text-sm font-bold mb-2">Location</label><input type="text" className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-black transition-colors" placeholder="Add location" value={formData.address} onChange={e=>setFormData({...formData, address:e.target.value})} /></div>
                  <div><label className="block text-sm font-bold mb-2">About</label><textarea rows="4" className="w-full p-4 border border-gray-300 rounded-xl outline-none focus:border-black transition-colors resize-none" placeholder="Tell us about yourself..."></textarea></div>

                  <div className="flex justify-end gap-6 pt-8 border-t border-gray-100 mt-4">
                     <button type="button" className="font-bold text-sm hover:underline">Cancel</button>
                     <button type="submit" className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm hover:opacity-90">Save Changes</button>
                  </div>
               </form>
            </div>
          )}

          {/* Reservations */}
          {activeTab === 'bookings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-extrabold mb-8">Your Reservations</h1>
              
              <div className="flex gap-6 border-b border-gray-200 mb-8">
                {['upcoming', 'past'].map(tab => (
                    <button key={tab} onClick={() => setBookingTab(tab)} className={`pb-4 text-sm font-bold border-b-2 transition-colors capitalize ${bookingTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>{tab}</button>
                ))}
              </div>

              <div className="flex flex-col gap-6">
                {loading ? <p>Loading...</p> : filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <div key={booking.bookingID} className="flex gap-6 p-6 border border-gray-100 rounded-2xl items-center hover:shadow-md transition-shadow">
                      <div className="w-32 h-24 rounded-xl overflow-hidden bg-gray-200 shrink-0"><img src="/colorful-modern-hotel-room.jpg" className="w-full h-full object-cover" /></div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold mb-1">Luxury Hotel Stay</h4>
                        <div className="flex gap-2 items-center text-sm">
                            <span className="bg-gray-50 px-3 py-1 rounded-lg font-medium">{new Date(booking.checkinTime).toLocaleDateString()}</span>
                            <span className="text-gray-400">→</span>
                            <span className="bg-gray-50 px-3 py-1 rounded-lg font-medium">{new Date(booking.checkoutTime).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-lg font-extrabold mb-2">₱{booking.totalPrice}</p>
                         {bookingTab === 'upcoming' && <button className="bg-white border border-red-200 text-red-500 px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-50" onClick={() => handleCancel(booking.bookingID)}>Cancel</button>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <p className="text-gray-400 font-medium">No {bookingTab} trips found.</p>
                    <button className="mt-4 bg-gold px-6 py-2 rounded-full font-bold text-sm" onClick={() => navigate('/')}>Start Exploring</button>
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