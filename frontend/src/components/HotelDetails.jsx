import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './HotelDetails.css';

export default function HotelDetails() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/hotels/${id}`)
      .then(res => res.json())
      .then(data => {
        setHotel(data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!hotel) return <div className="error-screen">Hotel not found.</div>;

  return (
    <div className="details-page">
      
      {/* REMOVED: <Header /> */}
      
      <div className="details-container">
        
        {/* 1. Title Section */}
        <div className="details-title-section">
          <h1>{hotel.name}</h1>
          <div className="details-sub-info">
            <span className="location">📍 {hotel.address}</span>
            <span className="stars" style={{color: 'var(--accent-gold)'}}>
               {'★'.repeat(hotel.stars || 5)}
            </span>
          </div>
        </div>

        {/* 2. Gallery */}
        <div className="details-gallery">
          <div className="main-image">
            {/* Placeholder image */}
            <img src="/colorful-modern-hotel-room.jpg" alt="Main View" />
          </div>
          <div className="sub-images">
            <img src="/luxury-hotel-room.png" alt="Detail 1" />
            <img src="/colorful-modern-bedroom-green.jpg" alt="Detail 2" />
          </div>
        </div>

        <div className="details-layout">
          {/* 3. Left Column: Description */}
          <div className="details-left">
            <div className="info-block">
              <h3>About this stay</h3>
              <p>
                Welcome to {hotel.name}, a premium destination offering world-class comfort.
                Located in the heart of {hotel.address}, this property features distinct 
                architectural design and luxury amenities suited for both business and leisure.
              </p>
            </div>

            <hr />

            <div className="info-block">
              <h3>Amenities</h3>
              <ul className="amenities-list">
                <li>Wifi</li>
                <li>Pool</li>
                <li>Spa</li>
                <li>Restaurant</li>
                <li>24/7 Service</li>
              </ul>
            </div>
            
            <hr />
            
            <div className="info-block">
              <h3>Contact Host</h3>
              <p><strong>Phone:</strong> {hotel.phone || "Not Available"}</p>
              <p><strong>Email:</strong> {hotel.email || "Not Available"}</p>
            </div>
          </div>

          {/* 4. Right Column: Sticky Booking Card */}
          <div className="details-right">
            <div className="booking-card">
              <div className="price-header">
                <span className="price">$120</span> 
                <span className="night"> / night</span>
              </div>

              <div className="booking-form">
                <div className="date-row">
                  <div className="date-input">
                    <label>CHECK-IN</label>
                    <input type="date" />
                  </div>
                  <div className="date-input">
                    <label>CHECKOUT</label>
                    <input type="date" />
                  </div>
                </div>
                <div className="guest-select">
                  <label>GUESTS</label>
                  <select>
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                  </select>
                </div>
              </div>

              <button className="reserve-btn">Reserve</button>
              
              <p className="charge-note">You won't be charged yet</p>
              
              <div className="total-price">
                <span>Total</span>
                <span>$120</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}