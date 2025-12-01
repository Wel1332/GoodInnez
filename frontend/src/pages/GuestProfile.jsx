import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import './GuestProfile.css';

// --- ICONS ---
const CheckIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);

export default function GuestProfile({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('profile'); 
  const [bookingTab, setBookingTab] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. NEW: Form State for Editing ---
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    email: '',
    phone: ''
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/');
    else {
      // Initialize form with user data
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        address: user.address || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user, navigate]);

  // Handle Tab Switching
  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

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

  // --- 2. NEW: Input Change Handler ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 3. NEW: Save Profile Handler ---
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      // Call the update API (Ensure updateGuest is in api.js)
      await api.updateGuest(user.guestID, formData);
      alert("Profile updated successfully!");
      // Optional: Reload to show new data if your app doesn't auto-refresh user context
      // window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    }
  };

  const handleCancel = async (id) => { /* ... cancel logic ... */ };

  const filteredBookings = bookings.filter(booking => {
    const checkOutDate = new Date(booking.checkoutTime);
    return bookingTab === 'upcoming' ? checkOutDate >= new Date() : checkOutDate < new Date();
  });

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* Sidebar (Left) */}
        <div className="profile-sidebar">
          <div className="identity-card">
            <div className="avatar-section">
              <div className="avatar-circle-large">{user.firstName.charAt(0).toUpperCase()}</div>
              <button className="upload-btn">Update Photo</button>
            </div>
            {/* ... Identity Verification Section ... */}
             <div className="identity-section">
              <h3>Identity Verification</h3>
              <p className="identity-desc">Show others you're really you with the identity verification badge.</p>
              <div className="verification-list">
                 <div className="verified-item"><div className="check-circle"><CheckIcon /></div><span>Email Confirmed</span></div>
                 <div className="verified-item"><div className="check-circle"><CheckIcon /></div><span>Mobile Confirmed</span></div>
              </div>
            </div>
            <hr className="sidebar-divider" />
            <div className="user-meta">
               <h3>{user.firstName} confirmed</h3>
               <div className="verified-item"><div className="check-circle"><CheckIcon /></div><span>Payment Methods</span></div>
            </div>
          </div>
        </div>

        {/* Content (Right) */}
        <div className="profile-content">
          
          {/* EDIT PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="content-wrapper fade-in">
               <div className="content-header">
                 <div className="header-text">
                    <h1>Hello, {user.firstName}</h1>
                    <p className="sub-text">Joined in 2024</p>
                 </div>
                 {/* This button can just scroll to form or be decorative since form is below */}
                 <button className="secondary-btn">Edit Profile</button>
               </div>

               {/* --- CONNECTED FORM --- */}
               <form className="modern-form" onSubmit={handleSaveProfile}>
                  
                  <div className="form-row">
                    <div className="input-group">
                        <label>First Name</label>
                        <input 
                          type="text" 
                          name="firstName" 
                          value={formData.firstName} 
                          onChange={handleInputChange} 
                        />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                        <label>Last Name</label>
                        <input 
                          type="text" 
                          name="lastName" 
                          value={formData.lastName} 
                          onChange={handleInputChange} 
                        />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="input-group">
                        <label>Location / Address</label>
                        <input 
                          type="text" 
                          name="address" 
                          placeholder="Add your location"
                          value={formData.address} 
                          onChange={handleInputChange} 
                        />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                        <label>Phone</label>
                        <input 
                          type="text" 
                          name="phone" 
                          placeholder="Add phone number"
                          value={formData.phone} 
                          onChange={handleInputChange} 
                        />
                    </div>
                  </div>

                  <div className="form-actions">
                     <button type="button" className="text-btn">Cancel</button>
                     <button type="submit" className="primary-btn">Save Changes</button>
                  </div>
               </form>
            </div>
          )}

          {/* ... Reservations Tab Code (Unchanged) ... */}
           {activeTab === 'bookings' && (
            <div className="content-wrapper fade-in">
              {/* ... existing reservations code ... */}
              <div className="content-header"><h1>Your Reservations</h1></div>
              {/* ... etc ... */}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}