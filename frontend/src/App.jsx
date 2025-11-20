// src/App.jsx
import { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HotelsSection from './components/HotelsSection';
import ActivitiesSection from './components/ActivitiesSection';
import Footer from './components/Footer';
import Login from './components/Login';
import './App.css';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    location: '',
    guests: ''
  });

  const handleSearch = (criteria) => {
    setSearchCriteria(criteria);
    const section = document.getElementById('hotels-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app">
      <Header onOpenLogin={() => setShowLogin(true)} />
      <main>
        <HeroSection onSearch={handleSearch} />
        <HotelsSection searchCriteria={searchCriteria} />
        
        <ActivitiesSection />
      </main>
      <Footer />
      
      {showLogin && (
        <Login onClose={() => setShowLogin(false)} />
      )}
    </div>
  );
}

export default App;