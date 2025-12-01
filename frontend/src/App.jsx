import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Components (Reusable UI) ---
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';

// --- Guest Pages ---
import LandingPage from './pages/LandingPage';
import ListingPage from './pages/ListingPage';
import HotelDetails from './pages/HotelDetails';
import BookingPage from './pages/BookingPage';
import GuestProfile from './pages/GuestProfile';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';

// --- Host Pages ---
import HostProperties from "./pages/host/HostProperties";
import AddProperty from "./pages/host/AddProperty";
import HostReservations from "./pages/host/HostReservations";
import HostDashboard from './pages/host/HostDashboard';
import HostTransactions from './pages/host/HostTransactions';

import './App.css';

function App() {
  // --- Auth State ---
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  
  // New state to track if the user clicked "Become a Partner"
  const [isPartnerFlow, setIsPartnerFlow] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  // --- Handlers ---
  const handleOpenAuth = (mode = 'login', isPartner = false) => {
    setAuthMode(mode);
    setIsPartnerFlow(isPartner); // Set flow type based on button clicked
    setShowAuth(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowAuth(false);
    setIsPartnerFlow(false); // Reset flow
    alert(`Welcome back, ${user.firstName}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    alert("You have been logged out.");
  };

  const renderAuthComponent = () => {
    const commonProps = { 
        onClose: () => setShowAuth(false),
        isPartnerFlow: isPartnerFlow // Pass flow state to modals
    };
    
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
            {/* --- GUEST ROUTES --- */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<ListingPage />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
            
            {/* Protected Guest Routes */}
            <Route path="/booking" element={<BookingPage user={currentUser} />} />
            <Route path="/profile" element={<GuestProfile user={currentUser} onLogout={handleLogout} />} />
            <Route path="/messages" element={<MessagesPage user={currentUser} onLogout={handleLogout} />} />
            <Route path="/notifications" element={<NotificationsPage user={currentUser} onLogout={handleLogout} />} />

            {/* --- HOST ROUTES --- */}
            <Route path="/host" element={<HostProperties user={currentUser} />} />
            <Route path="/host/properties" element={<HostProperties user={currentUser} />} />
            <Route path="/host/add" element={<AddProperty user={currentUser} />} />
            <Route path="/host/reservations" element={<HostReservations user={currentUser} />} />
            <Route path="/host" element={<HostDashboard user={currentUser} />} />
            <Route path="/host/transactions" element={<HostTransactions />} />

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