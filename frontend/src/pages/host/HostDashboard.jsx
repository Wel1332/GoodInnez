import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import './HostDashboard.css';

// --- ICONS ---
const HomeIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>);
const CalendarIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>);
const DollarIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>);
const ChatIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>);
const BellIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>);
const UserIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const SendIcon = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>);

export default function HostDashboard({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties'); // properties, reservations, transactions, messages, notifications, profile
  
  // Data States
  const [myHotels, setMyHotels] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  // Fetch Data based on Tab
  useEffect(() => {
    setLoading(true);
    if (activeTab === 'properties') {
      api.getHotels().then(data => { setMyHotels(data); setLoading(false); });
    } else if (activeTab === 'reservations') {
      fetch('http://localhost:8080/api/bookings').then(res => res.json()).then(data => { setReservations(data); setLoading(false); });
    } else {
      setLoading(false); // Other tabs are static/mock for now
    }
  }, [activeTab]);

  // Handlers (Same as before)
  const handleDeleteProperty = async (id) => { /* ... delete logic ... */ };
  const handleApprove = (id) => alert(`Booking ${id} Approved!`);
  const handleReject = (id) => alert(`Booking ${id} Rejected.`);

  return (
    <div className="host-page">
      <div className="host-container">
        
        {/* --- SIDEBAR --- */}
        <div className="host-sidebar">
          <div className="host-profile-card">
            <div className="host-avatar">{user?.firstName.charAt(0).toUpperCase()}</div>
            <h3>{user?.firstName} {user?.lastName}</h3>
            <span className="host-badge">SUPERHOST</span>
          </div>
          
          <div className="host-menu">
            <button className={`host-menu-item ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => setActiveTab('properties')}>
              <HomeIcon /> My Properties
            </button>
            <button className={`host-menu-item ${activeTab === 'reservations' ? 'active' : ''}`} onClick={() => setActiveTab('reservations')}>
              <CalendarIcon /> Reservations
            </button>
            <button className={`host-menu-item ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>
              <DollarIcon /> Transactions
            </button>
            
            <div className="menu-divider"></div>
            
            <button className={`host-menu-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
              <ChatIcon /> Messages
            </button>
            <button className={`host-menu-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
              <BellIcon /> Notifications
            </button>
            <button className={`host-menu-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
              <UserIcon /> Account
            </button>
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="host-content">
          
          {/* 1. PROPERTIES (Existing) */}
          {activeTab === 'properties' && (
            <div className="content-wrapper fade-in">
              <div className="content-header-row">
                <h1>Listed Properties</h1>
                <button className="add-btn" onClick={() => navigate('/host/add')}>+ Add New</button>
              </div>
              <div className="host-grid-list">
                {myHotels.map(hotel => (
                  <div key={hotel.hotelID} className="host-item-card">
                    <div className="host-img-box"><img src="/colorful-modern-hotel-room.jpg" alt="Hotel" /></div>
                    <div className="host-info">
                      <h4>{hotel.name}</h4>
                      <p>{hotel.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. RESERVATIONS (Existing) */}
          {activeTab === 'reservations' && (
            <div className="content-wrapper fade-in">
               <h1>Reservations</h1>
               {/* ... your reservation list code ... */}
            </div>
          )}

          {/* 3. TRANSACTIONS (Existing) */}
          {activeTab === 'transactions' && (
             <div className="content-wrapper fade-in">
               <h1>Transaction History</h1>
               {/* ... your transaction list code ... */}
             </div>
          )}

          {/* 4. MESSAGES (New - Matches host messages.jpg) */}
          {activeTab === 'messages' && (
            <div className="content-wrapper fade-in full-height">
                <div className="messages-container">
                    <div className="msg-sidebar">
                        <h2 className="msg-header">All Messages</h2>
                        <div className="msg-list">
                            <div className="msg-item active">
                                <div className="msg-avatar">JD</div>
                                <div className="msg-text-group">
                                    <div className="msg-top"><strong>John Doberman</strong><span>10:30 AM</span></div>
                                </div>
                            </div>
                            <div className="msg-item">
                                <div className="msg-avatar">HP</div>
                                <div className="msg-text-group">
                                    <div className="msg-top"><strong>Harry Parker</strong><span>Yesterday</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="msg-window">
                         <div className="chat-empty-state">
                             <h3>Message Body</h3>
                             <p>Select a conversation to start messaging</p>
                         </div>
                         <div className="chat-input-area">
                             <input type="text" placeholder="Type your message..." />
                             <button className="chat-send-btn"><SendIcon /></button>
                         </div>
                    </div>
                </div>
            </div>
          )}

          {/* 5. NOTIFICATIONS (New - Matches Host Notifications.jpg) */}
          {activeTab === 'notifications' && (
            <div className="content-wrapper fade-in">
                <h1>All Notifications</h1>
                <div className="notifications-list">
                    <div className="notif-card">
                        <div className="notif-body">
                            <strong>New Reservation Alert</strong>
                            <span>12 Mar 2021</span>
                        </div>
                        <button className="notif-close">×</button>
                    </div>
                    <div className="notif-card">
                        <div className="notif-body">
                            <strong>John Doe cancelled the reservation.</strong>
                            <span>12 Mar 2021</span>
                        </div>
                        <button className="notif-close">×</button>
                    </div>
                </div>
            </div>
          )}

          {/* 6. ACCOUNT PROFILE (New - Matches host account.jpg) */}
          {activeTab === 'profile' && (
            <div className="content-wrapper fade-in">
               <div className="content-header-row">
                  <h1>Hello, {user.firstName}</h1>
                  <button className="secondary-btn">Edit Profile</button>
               </div>
               <div className="host-id-card">
                  <div className="avatar-large">{user.firstName.charAt(0)}</div>
                  <button className="upload-text">Upload a Photo</button>
                  
                  <h3>Identity Verification</h3>
                  <p className="id-desc">Show others you're really you with the identity verification badge.</p>
                  
                  <div className="verified-item">✓ Email Confirmed</div>
                  <div className="verified-item">✓ Mobile Confirmed</div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}