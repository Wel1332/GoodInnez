import { useState } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import HotelsSection from './components/HotelsSection'
import ActivitiesSection from './components/ActivitiesSection'
import Footer from './components/Footer'
import Login from './components/Login'
import './App.css'

function App() {
  const [showLogin, setShowLogin] = useState(false)
  return (
    <div className="app">
      <Header onOpenLogin={() => setShowLogin(true)} />
      <HeroSection />
      <HotelsSection />
      <ActivitiesSection />
      <Footer />
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)} 
          onSwitchToSignup={() => console.log("Switch to signup")}
        />
      )}
    </div>
  )
}

export default App
