import { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HotelsSection from './components/HotelsSection';
import ActivitiesSection from './components/ActivitiesSection';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState({ location: '', guests: '' });

  // --- HANDLERS ---
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowAuth(false);
    alert(`Welcome back, ${user.firstName}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    alert("You have been logged out.");
  };

  const handleSearch = (criteria) => {
    setSearchCriteria(criteria);
    const section = document.getElementById('hotels'); 
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  // --- NEW: Universal Auth Opener ---
  // This allows the Header to specify 'login' or 'signup'
  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuth(true);
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
    } else if (authMode === 'signup') {
      return (
        <Signup
          {...commonProps}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    }
    return null;
  };

  return (
    <div className="app">
      {/* UPDATE: Pass openAuthModal instead of onOpenLogin */}
      <Header 
        onOpenAuth={openAuthModal} 
        user={currentUser}
        onLogout={handleLogout}
      />

      <main>
        <HeroSection onSearch={handleSearch} />
        <div id="hotels"><HotelsSection searchCriteria={searchCriteria} /></div>
        <div id="activities"><ActivitiesSection /></div>
      </main>
      
      <Footer />
      {showAuth && renderAuthComponent()}
    </div>
  );
}

export default App;