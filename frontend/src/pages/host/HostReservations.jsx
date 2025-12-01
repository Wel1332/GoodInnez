import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import HostHeader from '../../components/HostHeader';
import './HostReservations.css';

export default function HostReservations({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming'); 
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    fetch('http://localhost:8080/api/bookings')
      .then(res => res.json())
      .then(data => {
        setReservations(data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
     alert("Booking Approved!");
  };

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
    <div className="host-page">
      <HostHeader />
      <main className="host-container">
        <h1>Reservations</h1>
        
        <div className="host-tabs">
          {['Upcoming', 'Past', 'Rejected'].map(tab => (
            <button 
              key={tab}
              className={`host-tab ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="res-list">
          {loading ? <p>Loading...</p> : filteredList.length > 0 ? (
            filteredList.map(res => (
              <div key={res.bookingID} className="host-res-card">
                <div className="res-img-square">
                   <img src="/colorful-modern-hotel-room.jpg" alt="Room" />
                </div>
                <div className="res-info-block">
                  <h3>Fully Furnished Apartment (Room #{res.roomID})</h3>
                  <div className="res-meta-row">
                    <span>Check In: {new Date(res.checkinTime).toLocaleDateString()}</span>
                    <span className="bullet">•</span>
                    <span>Guest ID: {res.guestID}</span>
                  </div>
                  <p className="res-total">Total: ${res.totalPrice}</p>
                </div>
                <div className="res-actions-block">
                  {activeTab === 'upcoming' && (
                    <>
                      <button className="approve-btn" onClick={() => handleApprove(res.bookingID)}>Approve</button>
                      <button className="reject-btn" onClick={() => handleReject(res.bookingID)}>Reject</button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-dashboard"><p>No {activeTab} reservations.</p></div>
          )}
        </div>
      </main>
    </div>
  );
}