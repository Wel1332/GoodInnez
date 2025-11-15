import { useState } from 'react'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import HotelsSection from './components/HotelsSection'
import ActivitiesSection from './components/ActivitiesSection'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <HeroSection />
      <HotelsSection />
      <ActivitiesSection />
      <Footer />
    </div>
  )
}

export default App
