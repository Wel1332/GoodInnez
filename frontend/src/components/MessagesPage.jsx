import React, { useState } from 'react';
// REMOVED: import Header from './Header'; 
import './MessagesPage.css';

// Icons
const SendIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>);

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(1);
  
  // Mock Data
  const conversations = [
    { id: 1, name: "John Doberman", date: "10:30 AM", preview: "Confirming your arrival time...", avatar: "JD", active: true },
    { id: 2, name: "Harry Parker", date: "Yesterday", preview: "Thanks for the great review!", avatar: "HP", active: false },
    { id: 3, name: "Peter Potter", date: "12 Mar", preview: "Is the pool open late?", avatar: "PP", active: false },
  ];

  return (
    <div className="messages-page">
      {/* REMOVED: <Header ... /> */}
      
      <div className="messages-container">
        
        {/* --- Sidebar List --- */}
        <div className="msg-sidebar">
          <div className="msg-header">
            <h1>Messages</h1>
            <span className="msg-count">3 new</span>
          </div>
          <div className="msg-list">
            {conversations.map(chat => (
              <div 
                key={chat.id} 
                className={`msg-item ${activeChat === chat.id ? 'active' : ''}`}
                onClick={() => setActiveChat(chat.id)}
              >
                <div className="msg-avatar">{chat.avatar}</div>
                <div className="msg-info">
                  <div className="msg-top">
                    <span className="msg-name">{chat.name}</span>
                    <span className="msg-time">{chat.date}</span>
                  </div>
                  <p className="msg-preview">{chat.preview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Chat Window --- */}
        <div className="chat-window">
          
          <div className="chat-header">
            <div className="chat-user-info">
              <div className="msg-avatar small">JD</div>
              <h3>John Doberman</h3>
            </div>
            <button className="chat-action-btn">⋮</button>
          </div>

          <div className="chat-content">
            <div className="message received">
              <p>Hello! Just wanted to confirm your arrival time for tomorrow.</p>
              <span className="time">10:30 AM</span>
            </div>
            <div className="message sent">
              <p>Hi John! We should be there around 2 PM.</p>
              <span className="time">10:32 AM</span>
            </div>
            <div className="message received">
              <p>Perfect. The key will be at the front desk. Safe travels!</p>
              <span className="time">10:33 AM</span>
            </div>
          </div>

          <div className="chat-input-wrapper">
            <input type="text" placeholder="Type a message..." />
            <button className="send-btn"><SendIcon /></button>
          </div>

        </div>

      </div>
    </div>
  );
}