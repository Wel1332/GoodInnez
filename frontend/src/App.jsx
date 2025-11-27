import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';

// Pages
import LandingPage from './components/LandingPage';
import ListingPage from './components/ListingPage';
import HotelDetails from './components/HotelDetails';
import BookingPage from './components/BookingPage';
import GuestProfile from './components/GuestProfile';
import MessagesPage from './components/MessagesPage'; // New Import
import NotificationsPage from './components/NotificationsPage'; // New Import

import './App.css';

function App() {
  // --- Global Auth State ---
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [currentUser, setCurrentUser] = useState(null);

  // --- Handlers ---

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowAuth(false);
    alert(`Welcome back, ${user.firstName}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    alert("You have been logged out.");
  };

  const renderAuthComponent = () => {
    const commonProps = { onClose: () => setShowAuth(false) };
    
    if (authMode === 'login') {
      return (
        <Login 
          {...commonProps} 
          onSwitchToSignup={() => setAuthMode('signup')} 
          onLoginSuccess={handleLoginSuccess} 
        />
      );
    } else {
      return (
        <Signup 
          {...commonProps} 
          onSwitchToLogin={() => setAuthMode('login')} 
        />
      );
    }
  };

  return (
    <Router>
      <div className="app">
        
        {/* Global Header */}
        <Header 
          onOpenAuth={handleOpenAuth} 
          user={currentUser}
          onLogout={handleLogout}
        />

        <main>
          <Routes>
            {/* 1. Home Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* 2. Search Results */}
            <Route path="/search" element={<ListingPage />} />
            
            {/* 3. Hotel Details */}
            <Route path="/hotel/:id" element={<HotelDetails />} />
            
            {/* 4. Booking Page */}
            <Route path="/booking" element={<BookingPage user={currentUser} />} />

            {/* 5. User Profile Dashboard */}
            <Route path="/profile" element={<GuestProfile user={currentUser} onLogout={handleLogout} />} />

            {/* 6. Messages Page (New Route) */}
            <Route path="/messages" element={<MessagesPage user={currentUser} onLogout={handleLogout} />} />

            {/* 7. Notifications Page (New Route) */}
            <Route path="/notifications" element={<NotificationsPage user={currentUser} onLogout={handleLogout} />} />
          </Routes>
        </main>
        
        {/* Global Footer */}
        <Footer />
        
        {/* Auth Modal */}
        {showAuth && renderAuthComponent()}
      </div>
    </Router>
  );
}

export default App;