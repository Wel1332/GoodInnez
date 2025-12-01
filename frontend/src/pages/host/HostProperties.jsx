import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import HostHeader from '../../components/HostHeader';
import './HostProperties.css';

export default function HostProperties({ user }) {
  const navigate = useNavigate();
  const [myHotels, setMyHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    api.getHotels()
      .then(data => {
        setMyHotels(data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

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

  return (
    <div className="host-page">
      <HostHeader />
      
      <main className="host-container">
        <div className="host-header-row">
          <h1>Listed Properties</h1>
        </div>

        {loading ? (
          <p>Loading your properties...</p>
        ) : myHotels.length > 0 ? (
          <div className="host-grid">
            {myHotels.map(hotel => (
              <div key={hotel.hotelID} className="host-property-card">
                <div className="prop-image-box">
                  <img src="/colorful-modern-hotel-room.jpg" alt={hotel.name} />
                </div>
                
                <div className="prop-info">
                  <h3>{hotel.name}</h3>
                  <p className="prop-address">{hotel.address}</p>
                </div>

                <div className="prop-actions">
                  <button className="action-btn modify">Modify</button>
                  <button className="action-btn remove" onClick={() => handleDelete(hotel.hotelID)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-host-state">
            <h3>You haven't listed any properties yet.</h3>
            <button className="start-hosting-btn" onClick={() => navigate('/host/add')}>
              List Your First Property
            </button>
          </div>
        )}
      </main>
    </div>
  );
}