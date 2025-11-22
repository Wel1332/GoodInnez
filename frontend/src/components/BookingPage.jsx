import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BookingPage.css';

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const hotel = location.state?.hotel || {
    name: "Sample Hotel",
    address: "Cebu City, Philippines",
    price: "1000",
    image: "/colorful-modern-hotel-room.jpg"
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    alert("Booking Confirmed! (Mock)");
    navigate('/');
  };

  return (
    <div className="booking-page">
      {/* REMOVED: <Header /> */}

      <main className="booking-container">
        
        <div className="booking-layout">
          
          {/* --- LEFT SIDE: Form Section --- */}
          <div className="booking-left">
            <h1>Reservation Form</h1>
            <p className="sub-text">
              Sample reservation form to be provided for the concept and further design...
            </p>

            <button type="button" className="back-link" onClick={() => navigate('/')}>
              &larr; Go To Home
            </button>

            {/* The Actual Form */}
            <form className="reservation-form" onSubmit={handleConfirm}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="John Doe" className="input-field" required />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" className="input-field" required />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+63 900 000 0000" className="input-field" />
              </div>

              <div className="form-group">
                <label>Special Requests</label>
                <textarea rows="4" placeholder="Any special requirements?" className="input-field"></textarea>
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
                   <img src={hotel.image || "/colorful-modern-hotel-room.jpg"} alt={hotel.name} />
                </div>
                <div className="summary-info">
                  <h3>{hotel.name}</h3>
                  <p className="summary-address">{hotel.address}</p>
                  <div className="summary-amenities">
                    <span>1 Bedroom</span> • <span>1 Bathroom</span> • <span>1 Parking</span>
                  </div>
                </div>
              </div>

              <hr className="divider" />

              {/* Price Details */}
              <div className="price-details">
                <h4>Price Details</h4>
                <div className="price-row">
                  <span>Short Period</span>
                  <span>$ {hotel.price || 1000}</span>
                </div>
                <div className="price-row">
                  <span>Medium Period</span>
                  <span>$ 2000</span>
                </div>
                <div className="price-row">
                  <span>Long Period</span>
                  <span>$ 5000</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}