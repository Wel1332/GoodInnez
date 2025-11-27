import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header({ onOpenAuth, user, onLogout }) {
  const navigate = useNavigate(); 
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
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

  const handleMenuClick = (action) => {
    setAuthDropdownOpen(false);
    if (action) action();
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Good Innez</div>
        
        <div className="header-right-group">
          <nav className="nav">
            <a href="#hotels">Find a Hotel</a>
            <a href="#guides">Local Guides</a>
            <a href="#partners">Our Partners</a>
          </nav>

          <div className="header-actions">
            <button className="book-btn" onClick={() => onOpenAuth('login')}>Book now</button>
            
            <div className="auth-dropdown-container" ref={dropdownRef}>
                {user ? (
                    // LOGGED IN VIEW
                    <div className="user-profile-group">
                        <div className="user-avatar" title={`Logged in as ${user.firstName}`}>
                            {user.firstName.charAt(0).toUpperCase()}
                        </div>
                        <button 
                            className={`login-burger-btn ${authDropdownOpen ? 'active' : ''}`}
                            onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                        >
                            <span className="burger-icon">☰</span>
                        </button>
                    </div>
                ) : (
                    // GUEST VIEW
                    <button 
                        className={`login-burger-btn ${authDropdownOpen ? 'active' : ''}`}
                        onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                    >
                        <span className="burger-icon">☰</span>
                    </button>
                )}

                {/* DROPDOWN MENU */}
                {authDropdownOpen && (
                    <div className="auth-dropdown-menu">
                        {user ? (
                            <>
                                {/* --- UPDATED LINKS --- */}
                                <button onClick={() => handleMenuClick(() => navigate('/messages'))}>
                                    Messages
                                </button>
                                <button onClick={() => handleMenuClick(() => navigate('/notifications'))}>
                                    Notifications
                                </button>
                                
                                <div className="menu-divider"></div>

                                <button onClick={() => handleMenuClick(() => navigate('/profile'))}>
                                    My Profile
                                </button>
                                <button onClick={() => handleMenuClick(() => navigate('/profile'))}>
                                    Reservations
                                </button>
                                
                                <div className="menu-divider"></div>
                                
                                <button className="logout-btn" onClick={() => handleMenuClick(onLogout)}>
                                    Log out
                                </button>
                            </>
                        ) : (
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