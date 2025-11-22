// src/App.jsx
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

import './App.css';

function App() {
  // --- Auth State ---
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
        
        {/* ✅ GLOBAL HEADER: This sits outside Routes, so it appears on EVERY page */}
        <Header 
          onOpenAuth={handleOpenAuth} 
          user={currentUser}
          onLogout={handleLogout}
        />

        <main>
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Search Results */}
            <Route path="/search" element={<ListingPage />} />
            
            {/* Hotel Details */}
            <Route path="/hotel/:id" element={<HotelDetails />} />
            
            {/* Booking Page */}
            <Route path="/booking" element={<BookingPage />} />
          </Routes>
        </main>
        
        {/* ✅ GLOBAL FOOTER: Appears on every page */}
        <Footer />
        
        {/* Global Auth Modal */}
        {showAuth && renderAuthComponent()}
      </div>
    </Router>
  );
}

export default App;