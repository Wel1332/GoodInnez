import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import './GuestProfile.css';

// --- ICONS (SVGs for Professional Look) ---
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default function GuestProfile({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('profile'); 
  const [bookingTab, setBookingTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle Tab Switching via Header Dropdown State
  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  // Fetch Bookings
  useEffect(() => {
    if (user) {
      fetch('http://localhost:8080/api/bookings')
        .then(res => res.json())
        .then(data => {
          const myBookings = data.filter(b => b.guestID === user.guestID);
          setBookings(myBookings);
          setLoading(false);
        })
        .catch(err => setLoading(false));
    }
  }, [user]);

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await api.cancelBooking(id);
        setBookings(prev => prev.filter(b => b.bookingID !== id));
      } catch (error) {
        alert("Failed to cancel.");
      }
    }
  };

  const now = new Date();
  const filteredBookings = bookings.filter(booking => {
    const checkOutDate = new Date(booking.checkoutTime);
    return bookingTab === 'upcoming' ? checkOutDate >= now : checkOutDate < now;
  });

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* --- LEFT SIDEBAR (Identity Card) --- */}
        <div className="profile-sidebar">
          <div className="identity-card">
            
            <div className="avatar-section">
              <div className="avatar-circle-large">
                 {user.firstName.charAt(0).toUpperCase()}
              </div>
              <button className="upload-btn">Update Photo</button>
            </div>

            <div className="identity-section">
              <div className="section-icon">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3>Identity Verification</h3>
              <p className="identity-desc">
                Show others you're really you with the identity verification badge.
              </p>
              
              <div className="verification-list">
                 <div className="verified-item">
                    <div className="check-circle"><CheckIcon /></div>
                    <span>Email Confirmed</span>
                 </div>
                 <div className="verified-item">
                    <div className="check-circle"><CheckIcon /></div>
                    <span>Mobile Confirmed</span>
                 </div>
              </div>
            </div>

            <hr className="sidebar-divider" />

            <div className="user-meta">
               <h3>{user.firstName} confirmed</h3>
               <div className="verified-item">
                  <div className="check-circle"><CheckIcon /></div>
                  <span>Payment Methods</span>
               </div>
            </div>

          </div>
        </div>

        {/* --- RIGHT CONTENT --- */}
        <div className="profile-content">
          
          {/* VIEW: EDIT PROFILE */}
          {activeTab === 'profile' && (
            <div className="content-wrapper fade-in">
               <div className="content-header">
                 <div className="header-text">
                    <h1>Hello, {user.firstName}</h1>
                    <p className="sub-text">Joined in 2024</p>
                 </div>
                 <button className="secondary-btn">Edit Profile</button>
               </div>

               <form className="modern-form">
                  <div className="form-row">
                    <div className="input-group">
                        <label>About</label>
                        <textarea rows="4" placeholder="Tell us a little about yourself..."></textarea>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="input-group">
                        <label>Location</label>
                        <input type="text" placeholder={user.address || "Where do you live?"} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                        <label>Work</label>
                        <input type="text" placeholder="What do you do?" />
                    </div>
                  </div>

                  <div className="form-actions">
                     <button type="button" className="text-btn">Cancel</button>
                     <button type="button" className="primary-btn">Save Changes</button>
                  </div>
               </form>
            </div>
          )}

          {/* VIEW: RESERVATIONS */}
          {activeTab === 'bookings' && (
            <div className="content-wrapper fade-in">
              <div className="content-header">
                 <h1>Your Reservations</h1>
              </div>
              
              <div className="tabs-wrapper">
                <button 
                  className={`tab-link ${bookingTab === 'upcoming' ? 'active' : ''}`} 
                  onClick={() => setBookingTab('upcoming')}
                >
                  Upcoming
                </button>
                <button 
                  className={`tab-link ${bookingTab === 'past' ? 'active' : ''}`} 
                  onClick={() => setBookingTab('past')}
                >
                  Past
                </button>
              </div>

              <div className="bookings-grid-list">
                {loading ? <div className="loading-spinner"></div> : filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <div key={booking.bookingID} className="booking-card-row">
                      <div className="booking-img">
                         <img src="/colorful-modern-hotel-room.jpg" alt="Room" />
                      </div>
                      <div className="booking-details">
                        <div className="booking-main">
                            <h4>Luxury Hotel Stay</h4>
                            <span className="booking-id">Room #{booking.roomID}</span>
                        </div>
                        <div className="booking-meta">
                            <div className="date-range">
                                <span>{new Date(booking.checkinTime).toLocaleDateString()}</span>
                                <span className="arrow">→</span>
                                <span>{new Date(booking.checkoutTime).toLocaleDateString()}</span>
                            </div>
                            <span className="total-price">${booking.totalPrice}</span>
                        </div>
                      </div>
                      <div className="booking-actions">
                        {bookingTab === 'upcoming' ? (
                           <button className="danger-btn" onClick={() => handleCancel(booking.bookingID)}>Cancel</button>
                        ) : (
                           <button className="secondary-btn">Leave Review</button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🧳</div>
                    <h3>No {bookingTab} trips found</h3>
                    <p>Time to dust off your bags and start planning your next adventure.</p>
                    <button className="primary-btn" onClick={() => navigate('/')}>Start Exploring</button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}