import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Guest Pages
import LandingPage from './pages/LandingPage';
import ListingPage from './pages/ListingPage';
import HotelDetails from './pages/HotelDetails';
import BookingPage from './pages/BookingPage';
import GuestProfile from './pages/GuestProfile';
import MyBookings from './pages/MyBookings';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import BookingSuccess from './pages/BookingSuccess';

// Host Pages
import HostProperties from './pages/host/HostProperties';
import AddProperty from './pages/host/AddProperty';
import HostReservations from './pages/host/HostReservations';
import HostDashboard from './pages/host/HostDashboard';
import HostTransactions from './pages/host/HostTransactions';

// Store
import { useAuthStore } from './store/authStore';

import './App.css';

function App() {
  const { user, logout } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // --- Handlers ---
  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleLoginSuccess = (userData) => {
    setShowAuth(false);
  };

  const handleLogout = async () => {
    await logout();
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
    <ErrorBoundary>
      <Router>
        <div className="app">
          <Toaster position="top-right" />
          
          <Header 
            onOpenAuth={handleOpenAuth} 
            user={user}
            onLogout={handleLogout}
          />

          <main>
            <Routes>
              {/* Guest Routes - Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/search" element={<ListingPage />} />
              <Route path="/listings" element={<ListingPage />} />
              <Route path="/hotel/:id" element={<HotelDetails user={user} />} />
              
              {/* Protected Guest Routes */}
              <Route 
                path="/booking" 
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <GuestProfile onLogout={handleLogout} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-bookings" 
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages" 
                element={
                  <ProtectedRoute>
                    <MessagesPage onLogout={handleLogout} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute>
                    <NotificationsPage onLogout={handleLogout} />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Partner/Host Routes */}
              <Route 
                path="/host" 
                element={
                  <ProtectedRoute requiresPartner={true}>
                    <HostProperties />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/host/properties" 
                element={
                  <ProtectedRoute requiresPartner={true}>
                    <HostProperties />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/host/add" 
                element={
                  <ProtectedRoute requiresPartner={true}>
                    <AddProperty />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/host/reservations" 
                element={
                  <ProtectedRoute requiresPartner={true}>
                    <HostReservations />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/host/dashboard" 
                element={
                  <ProtectedRoute requiresPartner={true}>
                    <HostDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/host/transactions" 
                element={
                  <ProtectedRoute requiresPartner={true}>
                    <HostTransactions />
                  </ProtectedRoute>
                } 
              />

              {/* --- NEW ROUTE FOR EDITING --- */}
              <Route 
                path="/host/edit/:id" 
                element={
                  <ProtectedRoute requiresPartner={true}>
                    <AddProperty />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          
          <Footer />
          
          {showAuth && renderAuthComponent()}
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;