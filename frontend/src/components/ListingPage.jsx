import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ListingPage.css';

const categories = ["All Rooms", "Standard", "Deluxe", "Suite", "Family", "Ocean View"];

export default function ListingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeCategory, setActiveCategory] = useState("All Rooms");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = location.state || {}; 
  const searchLocation = searchParams.location || ""; 

  useEffect(() => {
    fetch('http://localhost:8080/api/hotels')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      })
      .then(data => {
        const filtered = searchLocation 
          ? data.filter(h => 
              (h.name && h.name.toLowerCase().includes(searchLocation.toLowerCase())) ||
              (h.address && h.address.toLowerCase().includes(searchLocation.toLowerCase()))
            )
          : data;

        setHotels(filtered);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error loading hotels:", error);
        setLoading(false);
      });
  }, [searchLocation]);

  const handleCardClick = (id) => {
    navigate(`/hotel/${id}`);
  };

  return (
    <div className="listing-container">
        
        {/* --- Filter Bar --- */}
        <div className="filter-bar">
          <div className="categories">
            {categories.map((cat) => (
              <button 
                key={cat}
                className={`cat-link ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="filter-btn">Filters ⚙️</button>
        </div>

        {/* --- Search Results Header --- */}
        <div className="results-header">
          <h2>
            {searchLocation ? `Stays in "${searchLocation}"` : "All Available Stays"}
          </h2>
          <p>{hotels.length} properties found</p>
        </div>

        {/* --- Listings Grid --- */}
        {loading ? (
          <div className="loading-container">
            <p>Loading properties...</p>
          </div>
        ) : (
          <div className="listings-grid">
            {hotels.map((hotel, index) => (
              <div 
                key={hotel.hotelID || index} 
                className="listing-card"
                onClick={() => handleCardClick(hotel.hotelID)}
              >
                
                <div className="listing-image-box">
                  <img 
                    src={index % 2 === 0 ? 
                      "/colorful-modern-hotel-room.jpg" : 
                      "/luxury-hotel-room.png"
                    } 
                    alt={hotel.name} 
                  />
                  <button className="card-heart" onClick={(e) => e.stopPropagation()}>♡</button>
                  <div className="card-price">$100 - 300 / night</div>
                </div>
                
                <div className="listing-info">
                  <div className="listing-title-row">
                    <h3>{hotel.name}</h3>
                    <div className="star-rating">
                      {'★'.repeat(hotel.stars || 0)}
                      <span className="star-empty">{'★'.repeat(5 - (hotel.stars || 0))}</span>
                    </div>
                  </div>
                  
                  <p className="listing-location">📍 {hotel.address}</p>
                  <p className="listing-phone">📞 {hotel.phone || "Contact for details"}</p>
                  
                  <button className="check-rates-btn">Check Rates</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && hotels.length === 0 && (
          <div className="no-results">
            <h3>No properties found matching your search.</h3>
          </div>
        )}

        <div className="pagination">Pagination or Load on scroll...</div>

    </div>
  );
}