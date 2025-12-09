import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';

// Guest Pages
import LandingPage from './pages/LandingPage';
import ListingPage from './pages/ListingPage';
import HotelDetails from './pages/HotelDetails';
import BookingPage from './pages/BookingPage';
import GuestProfile from './pages/GuestProfile';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import BookingSuccess from './pages/BookingSuccess';

// Host Pages
import HostProperties from './pages/host/HostProperties';
import AddProperty from './pages/host/AddProperty';
import HostReservations from './pages/host/HostReservations';
import HostDashboard from './pages/host/HostDashboard';
import HostTransactions from './pages/host/HostTransactions';

import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('goodinnez_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // --- Handlers ---
  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleLoginSuccess = (user) => {
    localStorage.setItem('goodinnez_user', JSON.stringify(user));
    setCurrentUser(user);
    setShowAuth(false);
    alert(`Welcome back, ${user.firstName}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('goodinnez_user');
    setCurrentUser(null);
    alert("You have been logged out.");
    window.location.href = '/';
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
            {/* Guest Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<ListingPage />} />
            <Route path="/hotel/:id" element={<HotelDetails user={currentUser} />} />
            
            {/* Protected Guest Routes */}
            <Route path="/booking" element={<BookingPage user={currentUser} />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/profile" element={<GuestProfile user={currentUser} onLogout={handleLogout} />} />
            <Route path="/messages" element={<MessagesPage user={currentUser} onLogout={handleLogout} />} />
            <Route path="/notifications" element={<NotificationsPage user={currentUser} onLogout={handleLogout} />} />

            {/* Host Routes */}
            <Route path="/host" element={<HostProperties user={currentUser} />} />
            <Route path="/host/properties" element={<HostProperties user={currentUser} />} />
            <Route path="/host/add" element={<AddProperty user={currentUser} />} />
            <Route path="/host/reservations" element={<HostReservations user={currentUser} />} />
            <Route path="/host/dashboard" element={<HostDashboard user={currentUser} />} />
            <Route path="/host/transactions" element={<HostTransactions user={currentUser} />} />

          </Routes>
        </main>
        
        <Footer />
        
        {showAuth && renderAuthComponent()}
      </div>
    </Router>
  );
}

export default App;