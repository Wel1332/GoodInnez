import { useRef } from 'react'
import { hotels } from '../data/hotels'
import HotelCard from './HotelCard'
import './HotelsSection.css'

export default function HotelsSection() {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    const scrollAmount = 320
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="hotels-section">
      <div className="section-header">
        <h2>Nearby Hostels in Cebu City</h2>
        <button className="map-btn">📍 Show On Map</button>
      </div>

      <div className="hotels-container">
        <div className="hotels-scroll" ref={scrollRef}>
          {hotels.map(hotel => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </section>
  )
}
