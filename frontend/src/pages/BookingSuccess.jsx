import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, CalendarDays } from 'lucide-react';
import './BookingSuccess.css';

export default function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = location.state || {}; // Get ID passed from BookingPage

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">
          <CheckCircle size={64} color="#1e8e3e" />
        </div>
        
        <h1>Booking Confirmed!</h1>
        <p className="success-sub">
          You are all set! We have sent a confirmation email to your inbox.
        </p>

        {bookingId && (
          <div className="booking-id-box">
            <span>Booking ID:</span>
            <strong>#{bookingId}</strong>
          </div>
        )}

        <div className="success-actions">
          <button className="primary-btn" onClick={() => navigate('/profile', { state: { tab: 'bookings' } })}>
            <CalendarDays size={18} /> View My Bookings
          </button>
          
          <button className="secondary-btn" onClick={() => navigate('/')}>
            <Home size={18} /> Return Home
          </button>
        </div>
      </div>
    </div>
  );
}