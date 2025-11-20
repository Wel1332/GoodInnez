import { useState } from 'react'
import './Header.css'

export default function Header({ onOpenLogin, user, onLogout }) {
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
            
            <button className="login-burger-btn" onClick={onOpenLogin}>
              <span className="burger-icon">☰</span>
            </button>
            {/* Logic: Show Initial if User exists, otherwise Show Burger */}
            {user ? (
                <button 
                    className="login-burger-btn" 
                    onClick={onLogout}
                    title={`Logged in as ${user.firstName}`}
                    style={{ fontWeight: 'bold', color: '#fbbf24', borderColor: '#fbbf24' }}
                >
                    {user.firstName.charAt(0).toUpperCase()}
                </button>
            ) : (
                <button className="login-burger-btn" onClick={onOpenLogin}>
                    <span className="burger-icon">☰</span>
                </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}