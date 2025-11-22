import { useState, useEffect, useRef } from 'react'
import './Header.css'

// 1. FIX: Prop name must be 'onOpenAuth' to match App.jsx
export default function Header({ onOpenAuth, user, onLogout }) {
  
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false) 
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAuthDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">Good Innez</div>
        
        <div className="header-right-group">
          <nav className="nav">
            <a href="#hotels">Find a Hotel</a>
            <a href="#guides">Local Guides</a>
            <a href="#partners">Our Partners</a>
          </nav>

          <div className="header-actions">
            
            {/* 2. FIX: Add onClick to the Book Now button */}
            <button 
              className="book-btn" 
              onClick={() => onOpenAuth('login')}
            >
              Book now
            </button>
            
            {/* AUTH BUTTON AREA */}
            <div className="auth-dropdown-container" ref={dropdownRef}>
                {user ? (
                    // LOGGED IN: Show Initial
                    <button 
                        className="login-burger-btn" 
                        onClick={onLogout}
                        title={`Logged in as ${user.firstName}`}
                        style={{ fontWeight: 'bold', color: '#fbbf24', borderColor: '#fbbf24' }}
                    >
                        {user.firstName.charAt(0).toUpperCase()}
                    </button>
                ) : (
                    // LOGGED OUT: Show Burger with Dropdown
                    <>
                        <button 
                            className={`login-burger-btn ${authDropdownOpen ? 'active' : ''}`}
                            onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                        >
                            <span className="burger-icon">☰</span>
                        </button>

                        {/* THE DROPDOWN MENU */}
                        {authDropdownOpen && (
                            <div className="auth-dropdown-menu">
                                {/* 3. FIX: Ensure these call onOpenAuth */}
                                <button onClick={() => {
                                    onOpenAuth('login');
                                    setAuthDropdownOpen(false);
                                }}>
                                    Login
                                </button>
                                <button onClick={() => {
                                    onOpenAuth('signup');
                                    setAuthDropdownOpen(false);
                                }}>
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}