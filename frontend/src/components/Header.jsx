import { useState } from 'react'
import './Header.css'

export default function Header({ onOpenLogin }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">Good Innez</div>
        <div className="header-right-group">
          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            <a href="#hotels">Find a Hotel</a>
            <a href="#guides">Local Guides</a>
            <a href="#partners">Our Partners</a>
          </nav>

          <div className="header-actions">

            <button className="book-btn">
              Book now
            </button>
            
            {/* The Login Button */}
            <button className="login-burger-btn" onClick={onOpenLogin}>
              <span className="burger-icon">☰</span>
            </button>

            {/* Mobile Navigation Toggle (Only shows on small screens) */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ⋮ 
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}