import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './MyBookings.css';

export default function MyBookings({ user }) {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    fetch('http://localhost:8080/api/bookings')
      .then(res => res.json())
      .then(data => {
        // Filter bookings for this user
        const myBookings = data.filter(b => b.guestID === user.guestID);
        setBookings(myBookings);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await api.cancelBooking(id);
        setBookings(prev => prev.filter(b => b.bookingID !== id));
        alert("Reservation cancelled.");
      } catch (error) {
        alert("Failed to cancel.");
      }
    }
  };

  const now = new Date();
  const filteredBookings = bookings.filter(booking => {
    const checkOutDate = new Date(booking.checkoutTime);
    return activeTab === 'upcoming' ? checkOutDate >= now : checkOutDate < now;
  });

  if (!user) return null;

  return (
    <div className="bookings-page">
      <main className="bookings-container">
        <h1 className="page-title">Reservations</h1>

        <div className="tabs-header">
          <button 
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`} 
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`} 
            onClick={() => setActiveTab('past')}
          >
            Past
          </button>
        </div>

        <div className="bookings-list">
          {loading ? (
            <p>Loading your reservations...</p>
          ) : filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking.bookingID} className="reservation-card">
                <div className="res-image">
                   <img src="/colorful-modern-hotel-room.jpg" alt="Property" />
                </div>
                <div className="res-details">
                  <h3>Luxury Hotel Stay (Booking #{booking.bookingID})</h3>
                  <div className="res-meta">
                    <div className="meta-item">
                      <span className="label">Check In:</span>
                      <span className="value">{new Date(booking.checkinTime).toLocaleDateString()}</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Check Out:</span>
                      <span className="value">{new Date(booking.checkoutTime).toLocaleDateString()}</span>
                    </div>
                    <div className="meta-item">
                      <span className="label">Total Price:</span>
                      <span className="value price">${booking.totalPrice}</span>
                    </div>
                  </div>
                </div>
                <div className="res-action">
                  {activeTab === 'upcoming' ? (
                    <button className="cancel-btn" onClick={() => handleCancel(booking.bookingID)}>
                      Cancel Reservation
                    </button>
                  ) : (
                    <button className="review-btn">Leave a Review</button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No {activeTab} reservations found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}