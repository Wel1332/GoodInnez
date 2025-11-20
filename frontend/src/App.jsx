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
  const [showAuth, setShowAuth] = useState(false); // Controls modal visibility
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [currentUser, setCurrentUser] = useState(null); // Tracks logged-in user
  const [searchCriteria, setSearchCriteria] = useState({
    location: '',
    guests: ''
  });

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
    // Scroll to hotels section when search is triggered
    const section = document.getElementById('hotels'); 
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderAuthComponent = () => {
    const commonProps = {
      onClose: () => setShowAuth(false),
    };

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
      {/* Header: Uses Stashed logic for User/Logout */}
      <Header 
        onOpenLogin={() => { setShowAuth(true); setAuthMode('login'); }} 
        user={currentUser}
        onLogout={handleLogout}
      />

      <main>
        {/* Hero: Uses Upstream logic to pass search handler */}
        <HeroSection onSearch={handleSearch} />

        {/* Hotels: Uses Upstream logic for search criteria + Stashed ID for nav */}
        <div id="hotels">
          <HotelsSection searchCriteria={searchCriteria} />
        </div>
        
        <div id="activities">
          <ActivitiesSection />
        </div>
      </main>
      
      <Footer />
      
      {/* Auth Modal: Uses Stashed logic */}
      {showAuth && renderAuthComponent()}
    </div>
  );
}

export default App;