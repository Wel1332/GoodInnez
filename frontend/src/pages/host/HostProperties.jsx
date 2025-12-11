import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import HostHeader from '../../components/HostHeader';
import { Edit2, Trash2 } from 'lucide-react';

export default function HostProperties({ user: propUser }) {
  const navigate = useNavigate();
  
  // 1. FAILSAFE: If 'propUser' is missing, try to load from Local Storage
  const [user, setUser] = useState(() => {
    if (propUser) return propUser;
    const saved = localStorage.getItem('goodinnez_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [myHotels, setMyHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Sync prop updates (if App.jsx updates later)
  useEffect(() => {
    if (propUser) setUser(propUser);
  }, [propUser]);

  useEffect(() => {
    // 3. Security Check
    if (!user) return; // Wait for user to load
    
    if (user.userType !== 'employee') {
      console.error("Access Denied: User is not a partner.", user);
      // Optional: navigate('/'); 
    } else {
      // 4. Fetch Data only if authorized
      api.getHotels()
      .then(data => {
          setMyHotels(data);
          setLoading(false);
      })
      .catch(err => {
          console.error("Failed to fetch hotels:", err);
          setLoading(false);
      });
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this property?")) {
      try {
        await api.deleteHotel(id);
        setMyHotels(prev => prev.filter(h => h.hotelID !== id));
      } catch (error) {
        alert("Failed to delete property.");
      }
    }
  };

  // 5. RENDER ERROR SCREEN (Only if we are SURE user is missing/wrong)
  if (!user || user.userType !== 'employee') {
    return (
      <div className="pt-32 text-center bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
        <p className="text-gray-600 mt-2">
          The system thinks you are: <strong>{user ? user.userType : "Logged Out"}</strong>
        </p>
        <p className="text-gray-500 text-sm mt-4 max-w-md mx-auto">
          Please Logout and Login again as a Partner.<br/>
          (Debug: Check that your 'userType' in database/login is 'employee')
        </p>
        <button 
            onClick={() => navigate('/')}
            className="mt-6 bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition-colors"
        >
            Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <HostHeader />
      
      <main className="max-w-[1200px] mx-auto px-5 py-16">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-extrabold text-black">Listed Properties</h1>
          <button 
            className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-gold hover:text-black transition-colors shadow-lg" 
            onClick={() => navigate('/host/add')}
          >
            + Add New Property
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-20">Loading your properties...</p>
        ) : myHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {myHotels.map(hotel => (
              <div key={hotel.hotelID} className="flex flex-col gap-4 group">
                <div className="w-full h-[250px] bg-gray-200 rounded-xl overflow-hidden relative shadow-sm">
                  <img 
                    src={hotel.image || "/colorful-modern-hotel-room.jpg"} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-black mb-1">{hotel.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{hotel.address}</p>
                </div>
                <div className="flex gap-4 mt-auto pt-4 border-t border-gray-100">
                  <button className="flex-1 py-2 rounded-lg font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center gap-2">
                    <Edit2 size={14} /> Modify
                  </button>
                  <button 
                    className="flex-1 py-2 rounded-lg font-semibold text-sm bg-white border border-gray-200 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2" 
                    onClick={() => handleDelete(hotel.hotelID)}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">You haven't listed any properties yet.</h3>
            <button className="px-8 py-3 bg-gold text-black rounded-full font-bold hover:bg-black hover:text-white transition-all shadow-lg" onClick={() => navigate('/host/add')}>
              List Your First Property
            </button>
          </div>
        )}
      </main>
    </div>
  );
}