import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Components (Reusable UI) ---
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';

// --- Pages (Full Screens) ---
import LandingPage from './pages/LandingPage';
import ListingPage from './pages/ListingPage';
import HotelDetails from './pages/HotelDetails';
import BookingPage from './pages/BookingPage';
import GuestProfile from './pages/GuestProfile';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';

import './App.css';

function App() {
  // --- Auth State ---
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
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
        
        <Header 
          onOpenAuth={handleOpenAuth} 
          user={currentUser}
          onLogout={handleLogout}
        />

        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<ListingPage />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
            <Route path="/booking" element={<BookingPage user={currentUser} />} />
            <Route path="/profile" element={<GuestProfile user={currentUser} onLogout={handleLogout} />} />
            <Route path="/messages" element={<MessagesPage user={currentUser} onLogout={handleLogout} />} />
            <Route path="/notifications" element={<NotificationsPage user={currentUser} onLogout={handleLogout} />} />
          </Routes>
        </main>
        
        <Footer />
        
        {showAuth && renderAuthComponent()}
      </div>
    </Router>
  );
}

export default App;