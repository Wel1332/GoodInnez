import { useState, useEffect, useRef } from 'react'
import './Header.css'

export default function Header({ onOpenAuth, user, onLogout }) {
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false) 
  const dropdownRef = useRef(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAuthDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to close menu when an item is clicked
  const handleMenuClick = (action) => {
    setAuthDropdownOpen(false);
    if (action) action();
  };

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
            <button className="book-btn">Book now</button>
            
            {/* AUTH DROPDOWN AREA */}
            <div className="auth-dropdown-container" ref={dropdownRef}>
                
                {user ? (
                    // --- LOGGED IN VIEW ---
                    <div className="user-profile-group">
                        {/* 1. The User Avatar (Just Visual) */}
                        <div className="user-avatar" title={`Logged in as ${user.firstName}`}>
                            {user.firstName.charAt(0).toUpperCase()}
                        </div>

                        {/* 2. The Burger Button (Opens Menu) */}
                        <button 
                            className={`login-burger-btn ${authDropdownOpen ? 'active' : ''}`}
                            onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                        >
                            <span className="burger-icon">☰</span>
                        </button>
                    </div>
                ) : (
                    // --- LOGGED OUT VIEW ---
                    <button 
                        className={`login-burger-btn ${authDropdownOpen ? 'active' : ''}`}
                        onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                    >
                        <span className="burger-icon">☰</span>
                    </button>
                )}

                {/* --- THE DROPDOWN MENU CONTENT --- */}
                {authDropdownOpen && (
                    <div className="auth-dropdown-menu">
                        {user ? (
                            // LOGGED IN OPTIONS
                            <>
                                <button onClick={() => handleMenuClick(() => console.log("Messages"))}>
                                    Messages
                                </button>
                                <button onClick={() => handleMenuClick(() => console.log("Notifications"))}>
                                    Notifications
                                </button>
                                <button onClick={() => handleMenuClick(() => console.log("Reservations"))}>
                                    Reservations
                                </button>
                                <button onClick={() => handleMenuClick(() => console.log("Account"))}>
                                    Account
                                </button>
                                <button onClick={() => handleMenuClick(() => console.log("Help Center"))}>
                                    Help Center
                                </button>
                                
                                <div className="menu-divider"></div>
                                
                                <button className="logout-btn" onClick={() => handleMenuClick(onLogout)}>
                                    Log out
                                </button>
                            </>
                        ) : (
                            // LOGGED OUT OPTIONS
                            <>
                                <button onClick={() => handleMenuClick(() => onOpenAuth('login'))}>
                                    Login
                                </button>
                                <button onClick={() => handleMenuClick(() => onOpenAuth('signup'))}>
                                    Sign Up
                                </button>
                                <div className="menu-divider"></div>
                                <button onClick={() => handleMenuClick()}>
                                    Help Center
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>

          </div>
        </div>
      </div>
    </header>
  )
}