// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import LandingPage from './components/LandingPage';
import ListingPage from './components/ListingPage';
import HotelDetails from './components/HotelDetails';
import BookingPage from './components/BookingPage';
import './App.css';

function App() {
  // Auth State
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const renderAuthComponent = () => {
    const commonProps = { onClose: () => setShowAuth(false) };
    return authMode === 'login' ? (
      <Login {...commonProps} onSwitchToSignup={() => setAuthMode('signup')} onLoginSuccess={handleLoginSuccess} />
    ) : (
      <Signup {...commonProps} onSwitchToLogin={() => setAuthMode('login')} />
    );
  };

  return (
    <Router>
      <div className="app">
        <Header 
          onOpenLogin={() => { setShowAuth(true); setAuthMode('login'); }} 
          user={currentUser}
          onLogout={handleLogout}
        />

        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<ListingPage />} />
            <Route path="/hotel/:id" element={<HotelDetails />} />
            <Route path="/booking" element={<BookingPage />} />
          </Routes>
        </main>
        
        <Footer />
        
        {showAuth && renderAuthComponent()}
      </div>
    </Router>
  );
}

export default App;