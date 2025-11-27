import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import './BookingPage.css';

export default function BookingPage({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { hotel, dates } = location.state || {}; 
  const safeHotel = hotel || {
    name: "Sample Hotel",
    address: "Cebu City",
    price: "1000",
    image: "/colorful-modern-hotel-room.jpg"
  };

  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    email: user ? user.email : '',
    phone: user ? user.phone : '',
    specialRequests: ''
  });

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to book a room.");
      return;
    }
    const bookingPayload = {
      checkinTime: dates?.checkIn ? `${dates.checkIn}T14:00:00` : null,
      checkoutTime: dates?.checkOut ? `${dates.checkOut}T11:00:00` : null,
      totalPrice: safeHotel.price || 1000,
      guest: { guestID: user.guestID }, 
      room: { roomID: 1 }
    };

    try {
      await api.createBooking(bookingPayload);
      alert("Booking Successful! Thank you.");
      navigate('/');
    } catch (error) {
      console.error("Booking Error:", error);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="booking-page">
      
      <main className="booking-container">
        
        <div className="booking-layout">
          
          {/* --- LEFT SIDE: Form Section --- */}
          <div className="booking-left">
            <h1>Reservation Form</h1>
            <p className="sub-text">
              Please review your details and complete the reservation.
            </p>

            <button type="button" className="back-link" onClick={() => navigate(-1)}>
              &larr; Back
            </button>

            {/* The Actual Form */}
            <form className="reservation-form" onSubmit={handleConfirm}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.fullName} 
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="input-field" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  className="input-field" 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Special Requests</label>
                <textarea 
                  rows="4" 
                  className="input-field"
                  placeholder="Any special requirements?"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="confirm-btn">Confirm Booking</button>
            </form>
          </div>

          {/* --- RIGHT SIDE: Summary Card --- */ }
          <div className="booking-right">
            <div className="summary-card">
              
              {/* Hotel Header */}
              <div className="summary-header">
                <div className="summary-image-box">
                   <img src={safeHotel.image || "/colorful-modern-hotel-room.jpg"} alt={safeHotel.name} />
                </div>
                <div className="summary-info">
                  <h3>{safeHotel.name}</h3>
                  <p className="summary-address">{safeHotel.address}</p>
                  
                  {/* Show Dates if available */}
                  {dates && (
                    <p style={{fontSize:'0.8rem', color:'#666', marginTop:'5px'}}>
                      <strong>Check-in:</strong> {dates.checkIn} <br/>
                      <strong>Check-out:</strong> {dates.checkOut}
                    </p>
                  )}
                </div>
              </div>

              <hr className="divider" />

              {/* Price Details */}
              <div className="price-details">
                <div className="price-row">
                  <span>Price per night</span>
                  <span>$ {safeHotel.price || 1000}</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>$ {safeHotel.price || 1000}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}