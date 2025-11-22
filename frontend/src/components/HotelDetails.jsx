import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './HotelDetails.css';

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch hotel data from Spring Boot
  useEffect(() => {
    fetch(`http://localhost:8080/api/hotels/${id}`)
      .then(res => res.json())
      .then(data => {
        setHotel(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching hotel:", err);
        setLoading(false);
      });
  }, [id]);

  // Handle "Reserve" Click -> Go to Booking Page
  const handleReserve = () => {
    // Pass the hotel data to the booking page so it can display the summary
    navigate('/booking', { state: { hotel: hotel } });
  };

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!hotel) return <div className="error-screen">Hotel not found.</div>;

  return (
    <div className="details-page">
      
      <div className="details-container">
        
        {/* 1. Gallery Grid */}
        <div className="gallery-grid">
          <div className="gallery-main">
            <img src="/colorful-modern-hotel-room.jpg" alt="Main View" />
          </div>
          <div className="gallery-side">
            <img src="/luxury-hotel-room.png" alt="Side 1" />
            <div className="gallery-more">
              <img src="/colorful-modern-bedroom-green.jpg" alt="Side 2" />
              <div className="more-overlay">+2 Photos</div>
            </div>
          </div>
        </div>

        {/* 2. Host Info Header */}
        <div className="host-header">
          <div className="host-avatar">
            <div className="avatar-circle">JD</div>
          </div>
          <div className="host-info">
            <span className="hosted-by">Hosted by</span>
            <h3>John Doberman</h3>
            <span className="host-location">New York, United States</span>
          </div>
        </div>

        <div className="details-layout">
          
          {/* --- LEFT COLUMN (Content) --- */}
          <div className="details-left">
            
            {/* Title & Location */}
            <div className="title-section">
              <div className="title-row">
                <h1>{hotel.name}</h1>
                <div className="title-actions">
                  <button className="action-btn">♡</button>
                  <button className="action-btn">🔗</button>
                </div>
              </div>
              <p className="location-text">📍 {hotel.address}</p>
            </div>

            {/* Feature Icons */}
            <div className="features-row">
              <div className="feature-box">
                <span className="feature-icon">🛏️</span>
                <span>2 Bedrooms</span>
              </div>
              <div className="feature-box">
                <span className="feature-icon">🚿</span>
                <span>2 Bathrooms</span>
              </div>
              <div className="feature-box">
                <span className="feature-icon">🚗</span>
                <span>2 Car Areas</span>
              </div>
              <div className="feature-box">
                <span className="feature-icon">🐾</span>
                <span>Pets Allowed</span>
              </div>
            </div>

            {/* Description */}
            <div className="section-block">
              <h3>Apartment Description</h3>
              <p>
                Experience luxury and comfort at {hotel.name}. Located in the heart of 
                {hotel.address}, this property features distinct architectural design 
                and luxury amenities suited for both business and leisure travelers.
                <br /><br />
                Whether you are looking for a relaxing weekend getaway or a long-term stay,
                we provide everything you need for a perfect experience.
              </p>
            </div>

            {/* Amenities */}
            <div className="section-block">
              <h3>Offered Amenities</h3>
              <div className="amenities-grid">
                <div className="amenity-item"><span>🍳</span> Kitchen</div>
                <div className="amenity-item"><span>❄️</span> Air Conditioner</div>
                <div className="amenity-item"><span>🧺</span> Washer</div>
                <div className="amenity-item"><span>📺</span> TV with Netflix</div>
                <div className="amenity-item"><span>🅿️</span> Free Parking</div>
                <div className="amenity-item"><span>🌳</span> Balcony or Patio</div>
              </div>
              <button className="outline-btn">Show All Amenities</button>
            </div>

            {/* Safety */}
            <div className="section-block">
              <h3>Safety and Hygiene</h3>
              <div className="amenities-grid">
                <div className="amenity-item"><span>🧯</span> Fire Extinguisher</div>
                <div className="amenity-item"><span>🧹</span> Daily Cleaning</div>
                <div className="amenity-item"><span>🚑</span> First Aid Kit</div>
                <div className="amenity-item"><span>🚨</span> Smoke Detector</div>
              </div>
            </div>

            {/* Reviews */}
            <div className="section-block">
              <div className="reviews-header">
                <h3>Reviews</h3>
                <span className="review-score">★ {hotel.stars || 5}.0</span>
              </div>
              
              <div className="reviews-list">
                <div className="review-card">
                  <div className="reviewer-info">
                    <div className="avatar-small">AS</div>
                    <div>
                      <strong>Alice Smith</strong>
                      <p className="review-date">June 12, 2024</p>
                    </div>
                  </div>
                  <p className="review-text">
                    "Very clean and modern. Loved the amenities and the location was perfect."
                  </p>
                </div>
              </div>
              
              <button className="outline-btn">Show All Reviews</button>
            </div>

          </div>

          {/* --- RIGHT COLUMN (Sticky Booking Card) --- */}
          <div className="details-right">
            <div className="booking-card">
              <div className="price-header">
                {/* Fallback price if DB is empty */}
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
                    <option>3 Guests</option>
                  </select>
                </div>
              </div>

              {/* Navigation to Booking Page */}
              <button className="reserve-btn" onClick={handleReserve}>
                Reserve Now
              </button>
              
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