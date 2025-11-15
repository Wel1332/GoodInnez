// src/components/HeroSection.jsx
import { useState } from 'react'
import './HeroSection.css'

export default function HeroSection() {
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: '1',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setSearchParams(prev => ({ ...prev, [name]: value }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('[v0] Search parameters:', searchParams)
  }

  return (
    <section className="hero">
      <div className="hero-content">

        {/* --- 1. The Main Glass Container --- */}
        <div className="search-container-glass">
          
          {/* --- Top Part: Title + Tabs (Transparent) --- */}
          <div className="search-header">
            <h1 className="hero-title">FIND</h1>
            <div className="search-tabs">
              <button className="tab active">Hotels</button>
              <button className="tab">Rooms</button>
              <button className="tab">Activities</button>
            </div>
          </div>

          {/* --- Bottom Part: The Solid White Form --- */}
          <form className="search-form-white" onSubmit={handleSearch}>
            <div className="search-field">
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="City"
                value={searchParams.location}
                onChange={handleChange}
              />
            </div>

            <div className="search-field">
              <label>Check In</label>
              <input
                type="text" 
                name="checkIn"
                placeholder="Add Dates"
                value={searchParams.checkIn}
                onChange={handleChange}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
              />
            </div>

            <div className="search-field">
              <label>Check Out</label>
              <input
                type="text" 
                name="checkOut"
                placeholder="Add Dates"
                value={searchParams.checkOut}
                onChange={handleChange}
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
              />
            </div>

            <div className="search-field">
              <label>Guests</label>
              <input
                type="text"
                name="guests"
                placeholder="Add Guests"
                value={searchParams.guests}
                onChange={handleChange}
                onFocus={(e) => (e.target.type = 'number')}
                onBlur={(e) => (e.target.type = 'text')}
              />
            </div>

            <button type="submit" className="search-btn">
              🔍
            </button>
          </form>

        </div> 
        {/* --- End of Main Glass Container --- */}

      </div>
    </section>
  )
}