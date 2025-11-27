import React from 'react';
import './NotificationsPage.css';

const BellIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>);
const CloseIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);

export default function NotificationsPage() {
  return (
    <div className="notif-page">
      {/* REMOVED: <Header ... /> */}
      
      <main className="notif-container">
        <div className="notif-card-main">
          <div className="notif-header">
            <h1>All Notifications</h1>
            <button className="mark-read-btn">Mark all as read</button>
          </div>

          <div className="notif-list">
            <div className="notif-row unread">
               <div className="notif-icon alert"><BellIcon /></div>
               <div className="notif-details">
                 <h4>Invite Your Friends!</h4>
                 <p>Get $50 credit for every friend who books a trip with your referral code.</p>
                 <span className="time">Just now</span>
               </div>
               <button className="dismiss-btn"><CloseIcon /></button>
            </div>

            <div className="notif-row">
               <div className="notif-icon"><BellIcon /></div>
               <div className="notif-details">
                 <h4>Booking Confirmed</h4>
                 <p>Your reservation at Luxury Hotel Stay is confirmed for March 12.</p>
                 <span className="time">2 hours ago</span>
               </div>
               <button className="dismiss-btn"><CloseIcon /></button>
            </div>

            <div className="notif-row">
               <div className="notif-icon"><BellIcon /></div>
               <div className="notif-details">
                 <h4>New Privacy Alert</h4>
                 <p>We've updated our privacy policy to better protect your data.</p>
                 <span className="time">12 Mar 2021</span>
               </div>
               <button className="dismiss-btn"><CloseIcon /></button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}