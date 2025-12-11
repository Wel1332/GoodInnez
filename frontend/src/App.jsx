import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import ErrorBoundary from './components/ErrorBoundary';

// Import the Component Map for Dynamic Routing
import { COMPONENT_MAP } from './utils/componentMap';

// Store
import { useAuthStore } from './store/authStore';

import './App.css';

function App() {
  const { user, logout } = useAuthStore();
  const [dbRoutes, setDbRoutes] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // --- Dynamic Routing: Fetch Routes from Database ---
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        // Determine role to send to backend
        const role = user ? user.userType : 'PUBLIC';
        
        // Fetch routes allowed for this role
        const response = await fetch(`http://localhost:8080/api/routes?role=${role}`);
        if (response.ok) {
          const data = await response.json();
          setDbRoutes(data);
        } else {
          console.error("Failed to fetch routes");
        }
      } catch (error) {
        console.error("Error loading routes:", error);
      }
    };

    fetchRoutes();
  }, [user]); // Re-fetch whenever user logs in/out

  // --- Handlers ---
  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleLoginSuccess = (userData) => {
    setShowAuth(false);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const renderAuthComponent = () => {
    const commonProps = { onClose: () => setShowAuth(false) };
    
    if (authMode === 'login') {
      return (
        <Login 
          {...commonProps} 
          onSwitchToSignup={() => setAuthMode('signup')} 
          onLoginSuccess={handleLoginSuccess} 
        />
      );
    } else {
      return (
        <Signup 
          {...commonProps} 
          onSwitchToLogin={() => setAuthMode('login')} 
        />
      );
    }
  };

  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <Toaster position="top-right" />
          
          <Header 
            onOpenAuth={handleOpenAuth} 
            user={user}
            onLogout={handleLogout}
          />

          <main>
            <Routes>
              {/* --- DYNAMIC ROUTES FROM DATABASE --- */}
              {dbRoutes.map((route) => {
                // Map the string key from DB (e.g., "HostDashboard") to the actual Component
                const Component = COMPONENT_MAP[route.componentKey];
                
                // Only render if the component exists in our map
                if (Component) {
                  return (
                    <Route 
                      key={route.id || route.path} 
                      path={route.path} 
                      element={<Component />} 
                    />
                  );
                }
                return null;
              })}

              {/* Fallback Route for 404 */}
              <Route path="*" element={
                <div className="min-h-[50vh] flex flex-col items-center justify-center">
                  <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
                  <p className="text-gray-500">Page not found</p>
                </div>
              } />
            </Routes>
          </main>
          
          <Footer />
          
          {showAuth && renderAuthComponent()}
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;