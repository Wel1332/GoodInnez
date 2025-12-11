import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, User, LogOut, MessageSquare, Bell, CalendarDays, Building2, HelpCircle, LogIn, UserPlus } from 'lucide-react';

export default function Header({ onOpenAuth, user, onLogout }) {
  const navigate = useNavigate(); 
  const location = useLocation();
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

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-[#1a1a1a] border-b border-[#333] sticky top-0 z-50 py-4 px-8">
      <div className="max-w-[1900px] mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-white cursor-pointer hover:text-gold transition-colors" onClick={() => navigate('/')}>
          Good Innez
        </div>
        
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-8 items-center">
            {[{id: 'hotels', label: 'Find a Hotel'}, {id: 'activities', label: 'Local Guides'}, {id: 'footer', label: 'Our Partners'}].map(link => (
              <a 
                key={link.id} 
                href={`#${link.id}`} 
                onClick={(e) => { e.preventDefault(); scrollToSection(link.id); }}
                className="text-gray-300 hover:text-gold transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            
            {/* BUTTON 1: FOR PUBLIC & GUESTS -> Opens Signup */}
            {(!user || user.userType === 'guest') && (
              <button 
                className="hidden md:block bg-gold text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-yellow-600 transition-colors"
                onClick={() => onOpenAuth('signup')}
              >
                Become a Partner
              </button>
            )}

            {/* BUTTON 2: FOR PARTNERS -> Goes to Dashboard */}
            {user && user.userType === 'employee' && (
               <button 
                className="hidden md:block bg-gold text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-yellow-600 transition-colors"
                onClick={() => navigate('/host/properties')}
              >
                Host Dashboard
              </button>
            )}
            
            <div className="relative" ref={dropdownRef}>
                <button 
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white hover:border-gold hover:text-gold transition-all"
                    onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                >
                    {user ? (
                       <span className="font-bold text-sm">{user.firstName.charAt(0).toUpperCase()}</span>
                    ) : (
                       <Menu size={20} />
                    )}
                </button>

                {authDropdownOpen && (
                    <div className="absolute top-[120%] right-0 w-48 bg-[#1a1a1a] border border-white/20 rounded-xl shadow-2xl overflow-hidden py-2 backdrop-blur-md">
                        {user ? (
                            <>
                                <button className="w-full text-left px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-gold flex items-center gap-3 text-sm transition-colors" onClick={() => handleMenuClick(() => navigate('/messages'))}><MessageSquare size={16} /> Messages</button>
                                <button className="w-full text-left px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-gold flex items-center gap-3 text-sm transition-colors" onClick={() => handleMenuClick(() => navigate('/notifications'))}><Bell size={16} /> Notifications</button>
                                <div className="h-px bg-white/10 my-1"></div>
                                <button className="w-full text-left px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-gold flex items-center gap-3 text-sm transition-colors" onClick={() => handleMenuClick(() => navigate('/profile'))}><User size={16} /> My Profile</button>
                                <button className="w-full text-left px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-gold flex items-center gap-3 text-sm transition-colors" onClick={() => handleMenuClick(() => navigate('/my-bookings'))}><CalendarDays size={16} /> My Bookings</button>
                                <div className="h-px bg-white/10 my-1"></div>
                                
                                {/* Menu Item for Dashboard (For mobile/extra visibility) */}
                                {user.userType === 'employee' && (
                                  <button className="w-full text-left px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-gold flex items-center gap-3 text-sm transition-colors" onClick={() => handleMenuClick(() => navigate('/host/properties'))}><Building2 size={16} /> Host Dashboard</button>
                                )}
                                
                                <div className="h-px bg-white/10 my-1"></div>
                                <button className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-900/20 flex items-center gap-3 text-sm transition-colors" onClick={() => handleMenuClick(onLogout)}><LogOut size={16} /> Log out</button>
                            </>
                        ) : (
                            <>
                                <button className="w-full text-left px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-gold flex items-center gap-3 text-sm transition-colors" onClick={() => handleMenuClick(() => onOpenAuth('login'))}><LogIn size={16} /> Login</button>
                                <button className="w-full text-left px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-gold flex items-center gap-3 text-sm transition-colors" onClick={() => handleMenuClick(() => onOpenAuth('signup'))}><UserPlus size={16} /> Sign Up</button>
                                <div className="h-px bg-white/10 my-1"></div>
                                <button className="w-full text-left px-4 py-3 text-gray-200 hover:bg-white/10 hover:text-gold flex items-center gap-3 text-sm transition-colors" onClick={() => handleMenuClick()}><HelpCircle size={16} /> Help Center</button>
                            </>
                        )}
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}