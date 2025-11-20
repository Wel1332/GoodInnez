// src/components/HeroSection.jsx
import { useState, useEffect, useRef } from 'react';
import './HeroSection.css';

// --- Cebu Specific Recommendations ---
const popularDestinations = [
  { id: 1, name: "Cebu City", sub: "City · Central Visayas", icon: "📍" },
  { id: 2, name: "Mactan, Lapu-Lapu", sub: "Island · Near Airport", icon: "✈️" },
  { id: 3, name: "Moalboal", sub: "Municipality · South Cebu", icon: "🤿" },
  { id: 4, name: "Bantayan Island", sub: "Island · North Cebu", icon: "🏝️" },
  { id: 5, name: "Oslob", sub: "Municipality · Whale Shark Watching", icon: "🐋" },
];

export default function HeroSection({ onSearch }) {
  const [activeTab, setActiveTab] = useState('hotels');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
    rooms: '1',
  });

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectLocation = (locationName) => {
    setSearchParams(prev => ({ ...prev, location: locationName }));
    setShowSuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ ...searchParams, type: activeTab });
    }
  };

  const getGuestLabel = () => {
    if (activeTab === 'activities') return 'Participants';
    if (activeTab === 'rooms') return 'No. of Rooms';
    return 'Guests';
  };

  const handleDateBlur = (e) => {
    if (!e.target.value) e.target.type = 'text';
  };

  return (
    <section className="hero">
      <div className="hero-content">
        
        {/* --- The Unified Container --- */}
        <div className="glass-search-container">
          
          {/* Top Part: Glass Header */}
          <div className="glass-header">
            <h1 className="hero-title">FIND</h1>
            <div className="search-tabs">
              <button className={`tab ${activeTab === 'hotels' ? 'active' : ''}`} onClick={() => setActiveTab('hotels')}>Hotels</button>
              <button className={`tab ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>Rooms</button>
              <button className={`tab ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>Activities</button>
            </div>
          </div>

          {/* Bottom Part: White Form */}
          <form className="inner-search-form" onSubmit={handleSearch}>
            
            {/* --- LOCATION FIELD WITH DROPDOWN --- */}
            <div className="search-field location-field" ref={wrapperRef}>
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder={activeTab === 'activities' ? "Where to go?" : "Which city?"}
                value={searchParams.location}
                onChange={handleChange}
                onFocus={() => setShowSuggestions(true)} 
                onClick={() => setShowSuggestions(true)} /* FIX: Open on click too */
                autoComplete="off"
              />

              {/* The Dropdown */}
              {showSuggestions && (
                <div className="suggestions-dropdown">
                  <div className="dropdown-header">Popular destinations</div>
                  {popularDestinations.map((item) => (
                    <div 
                      key={item.id} 
                      className="suggestion-item"
                      onClick={() => handleSelectLocation(item.name)}
                    >
                      <div className="suggestion-icon">{item.icon}</div>
                      <div className="suggestion-text">
                        <div className="suggestion-name">{item.name}</div>
                        <div className="suggestion-sub">{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="search-field">
              <label>{activeTab === 'activities' ? 'Date' : 'Check In'}</label>
              <input 
                type={searchParams.checkIn ? 'date' : 'text'}
                name="checkIn" 
                placeholder={activeTab === 'activities' ? "Select Date" : "Add Dates"}
                onFocus={(e) => e.target.type = 'date'} 
                onBlur={handleDateBlur}
                onChange={handleChange} 
                value={searchParams.checkIn}
              />
            </div>

            {activeTab !== 'activities' && (
              <div className="search-field">
                <label>Check Out</label>
                <input 
                  type={searchParams.checkOut ? 'date' : 'text'}
                  name="checkOut" 
                  placeholder="Add Dates" 
                  onFocus={(e) => e.target.type = 'date'} 
                  onBlur={handleDateBlur}
                  onChange={handleChange} 
                  value={searchParams.checkOut}
                />
              </div>
            )}

            <div className="search-field">
              <label>{getGuestLabel()}</label>
              <input
                type="number"
                name={activeTab === 'rooms' ? 'rooms' : 'guests'}
                min="1"
                placeholder={activeTab === 'rooms' ? "1 Room" : "1 Person"}
                value={activeTab === 'rooms' ? searchParams.rooms : searchParams.guests}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="search-btn">🔍</button>
          </form>

        </div>
      </div>
    </section>
  );
}