import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/authStore'; // Import Store
import { Home, Calendar, DollarSign, MessageSquare, Bell, User, Send, CheckCircle, XCircle } from 'lucide-react';

export default function HostDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore(); // Get user from store
  
  const [activeTab, setActiveTab] = useState('properties'); 
  const [myHotels, setMyHotels] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic protection (though ProtectedRoute handles this too)
    if (!user || user.userType !== 'employee') {
        navigate('/');
        return;
    }

    setLoading(true);
    const fetchData = async () => {
        try {
            if (activeTab === 'properties') {
                if (user.uniqueID) {
                    const data = await api.getMyHotels(user.uniqueID);
                    setMyHotels(data);
                }
            } else if (activeTab === 'reservations') {
                const data = await api.getBookings(); 
                setReservations(data);
            } else if (activeTab === 'transactions') {
                setTransactions([
                    { id: 1, title: "Payout for Booking #102", date: "12 Mar 2024 at 2:00 PM", amount: 1000 },
                    { id: 2, title: "Payout for Booking #98", date: "10 Mar 2024 at 9:00 AM", amount: 2500 },
                ]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [activeTab, user, navigate]);

  const handleDeleteProperty = async (id) => {
    if (window.confirm("Delete this property?")) {
      await api.deleteHotel(id);
      setMyHotels(prev => prev.filter(h => h.hotelID !== id));
    }
  };

  const handleApprove = (id) => alert(`Booking ${id} Approved!`);
  const handleReject = (id) => alert(`Booking ${id} Rejected.`);

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-16 text-gray-900">
      <div className="max-w-[1200px] mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12 items-start">
        
        {/* --- SIDEBAR --- */}
        <div className="flex flex-col gap-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-black text-white rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                {user?.firstName?.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-lg font-bold">{user?.firstName} {user?.lastName}</h3>
            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-extrabold px-3 py-1 rounded-full tracking-wider mt-2">SUPERHOST</span>
          </div>
          
          <div className="flex flex-col gap-2">
            {[
                { id: 'properties', icon: Home, label: 'My Properties' },
                { id: 'reservations', icon: Calendar, label: 'Reservations' },
                { id: 'transactions', icon: DollarSign, label: 'Transactions' },
            ].map((item) => (
                <button 
                    key={item.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-semibold transition-all ${activeTab === item.id ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-black'}`}
                    onClick={() => setActiveTab(item.id)}
                >
                    <item.icon size={18} /> {item.label}
                </button>
            ))}
            
            <div className="h-px bg-gray-200 my-2"></div>
            
            {[
                { id: 'messages', icon: MessageSquare, label: 'Messages' },
                { id: 'notifications', icon: Bell, label: 'Notifications' },
                { id: 'profile', icon: User, label: 'Account' },
            ].map((item) => (
                <button 
                    key={item.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-semibold transition-all ${activeTab === item.id ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-black'}`}
                    onClick={() => setActiveTab(item.id)}
                >
                    <item.icon size={18} /> {item.label}
                </button>
            ))}
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div>
          
          {/* 1. PROPERTIES */}
          {activeTab === 'properties' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold">Listed Properties</h1>
                <button className="bg-black text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-gold transition-colors" onClick={() => navigate('/host/add')}>+ Add New</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myHotels.map(hotel => (
                  <div key={hotel.hotelID} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-full h-48 bg-gray-300">
                        <img src={hotel.image || "/colorful-modern-hotel-room.jpg"} alt="Hotel" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-bold mb-1">{hotel.name}</h4>
                      <p className="text-sm text-gray-500">{hotel.address}</p>
                    </div>
                    <div className="p-4 border-t border-gray-100 flex gap-3">
                      <button className="flex-1 py-2 bg-gray-50 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-100">Modify</button>
                      <button className="flex-1 py-2 bg-white border border-gray-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50" onClick={() => handleDeleteProperty(hotel.hotelID)}>Remove</button>
                    </div>
                  </div>
                ))}
                {myHotels.length === 0 && !loading && <p className="text-gray-400 italic">No properties listed yet.</p>}
              </div>
            </div>
          )}

          {/* 2. RESERVATIONS */}
          {activeTab === 'reservations' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h1 className="text-3xl font-extrabold mb-8">Reservations</h1>
               <div className="flex flex-col gap-4">
                 {reservations.map(res => (
                   <div key={res.bookingID} className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-black mb-1">{res.roomID ? `Room #${res.roomID}` : "Luxury Apartment"}</h4>
                        <p className="text-sm text-gray-500">Guest ID: {res.guestID}</p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-sm text-gray-600 mb-1">Check-in: {new Date(res.checkinTime).toLocaleDateString()}</span>
                        <span className="text-lg font-bold text-gold">₱{res.totalPrice}</span>
                      </div>
                      <div className="flex gap-3 pl-4 border-l border-gray-100">
                        <button className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-gold hover:text-black transition-colors" onClick={() => handleApprove(res.bookingID)}>Approve</button>
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-colors" onClick={() => handleReject(res.bookingID)}>Reject</button>
                      </div>
                   </div>
                 ))}
                 {reservations.length === 0 && !loading && <p className="text-gray-400 italic">No reservations found.</p>}
               </div>
            </div>
          )}

          {/* 3. TRANSACTIONS */}
          {activeTab === 'transactions' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-center mb-8">
                 <h1 className="text-3xl font-extrabold">Transaction History</h1>
                 <button className="text-sm font-bold text-gray-500 hover:text-black underline">Download CSV</button>
               </div>

               <div className="flex flex-col gap-4">
                  {transactions.map(trans => (
                    <div key={trans.id} className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200">
                       <div>
                          <h4 className="font-bold text-black mb-1">{trans.title}</h4>
                          <span className="text-sm text-gray-500">{trans.date}</span>
                       </div>
                       <div className="text-xl font-extrabold text-black">
                          ₱{trans.amount}
                       </div>
                    </div>
                  ))}
               </div>
             </div>
          )}

          {/* 4. MESSAGES */}
          {activeTab === 'messages' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[600px]">
                <div className="grid grid-cols-[300px_1fr] border border-gray-200 rounded-2xl h-full bg-white overflow-hidden shadow-sm">
                    <div className="border-r border-gray-200 bg-gray-50 flex flex-col">
                        <h2 className="p-6 text-lg font-bold border-b border-gray-200 bg-white m-0">All Messages</h2>
                        <div className="overflow-y-auto flex-1">
                            <div className="flex gap-3 p-4 cursor-pointer bg-white border-l-4 border-black">
                                <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm">JD</div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between mb-1"><strong className="text-sm text-black">John Doberman</strong><span className="text-xs text-gray-400">10:30 AM</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col relative bg-white">
                         <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                             <h3 className="text-gray-600 text-xl font-bold mb-2">Message Body</h3>
                             <p className="text-sm">Select a conversation to start messaging</p>
                         </div>
                         <div className="p-6 border-t border-gray-200 flex gap-3 bg-white">
                             <input type="text" placeholder="Type your message..." className="flex-1 px-6 py-3 border border-gray-200 rounded-full outline-none bg-gray-50 focus:bg-white focus:border-black transition-colors" />
                             <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 transition-transform"><Send size={18} /></button>
                         </div>
                    </div>
                </div>
            </div>
          )}

          {/* 5. NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-3xl font-extrabold mb-8">All Notifications</h1>
                <div className="flex flex-col gap-4 max-w-3xl">
                    {[{title:"New Reservation", msg:"Alice booked for Dec 24", time:"Just now"}, {title:"Cancelled", msg:"John cancelled.", time:"2 hrs ago"}].map((n, i) => (
                        <div key={i} className="flex justify-between items-center p-6 border-b border-gray-100 bg-white rounded-xl shadow-sm first:border-l-4 first:border-l-gold">
                            <div>
                                <strong className="block text-black mb-1">{n.title}</strong>
                                <span className="text-sm text-gray-500">{n.msg}</span>
                            </div>
                            <button className="text-gray-300 hover:text-black"><XCircle size={20}/></button>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* 6. ACCOUNT PROFILE */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-start mb-10">
                  <div>
                    <h1 className="text-4xl font-extrabold mb-2">Hello, {user?.firstName}</h1>
                    <button className="bg-white border border-black rounded-full px-5 py-2 font-bold text-sm hover:bg-gray-50 transition-colors">Edit Profile</button>
                  </div>
               </div>
               <div className="max-w-md border border-gray-200 rounded-2xl p-8 text-center bg-white">
                  <div className="w-24 h-24 bg-black text-white rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold">{user?.firstName.charAt(0)}</div>
                  <button className="text-black underline font-bold text-sm mb-8">Upload a Photo</button>
                  
                  <h3 className="text-lg font-bold mb-2 text-left">Identity Verification</h3>
                  <p className="text-sm text-gray-500 text-left mb-6 leading-relaxed">Show others you're really you with the identity verification badge.</p>
                  
                  <div className="flex flex-col gap-3 text-left">
                    <div className="flex items-center gap-3 text-sm text-gray-700 font-medium"><CheckCircle size={16} /> Email Confirmed</div>
                    <div className="flex items-center gap-3 text-sm text-gray-700 font-medium"><CheckCircle size={16} /> Mobile Confirmed</div>
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}