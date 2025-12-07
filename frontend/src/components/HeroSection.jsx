import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';

const popularDestinations = [
  { id: 1, name: "Cebu City", sub: "City · Central Visayas" },
  { id: 2, name: "Mactan, Lapu-Lapu", sub: "Island · Near Airport" },
  { id: 3, name: "Moalboal", sub: "Municipality · South Cebu" },
  { id: 4, name: "Bantayan Island", sub: "Island · North Cebu" },
  { id: 5, name: "Oslob", sub: "Municipality · Whale Shark Watching" },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hotels');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  const [searchParams, setSearchParams] = useState({ location: '', checkIn: '', checkOut: '', guests: '1', rooms: '1' });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleChange = (e) => setSearchParams(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSelectLocation = (locationName) => { setSearchParams(prev => ({ ...prev, location: locationName })); setShowSuggestions(false); };
  const handleSearch = (e) => { e.preventDefault(); navigate('/search', { state: { ...searchParams, type: activeTab } }); };

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center px-5 bg-[url('/image%202.jpg')] bg-cover bg-center text-white z-0">
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      <div className="relative z-10 w-full max-w-[950px]">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] p-10 shadow-2xl flex flex-col gap-6 overflow-visible">
          <div className="flex flex-col md:flex-row items-baseline gap-8 pl-4">
            <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-lg m-0">FIND</h1>
            <div className="flex gap-6">
              {['hotels', 'rooms', 'activities'].map((tab) => (
                <button key={tab} className={`bg-transparent border-none text-white/80 py-2 text-lg font-bold cursor-pointer border-b-[3px] border-transparent transition-all capitalize ${activeTab === tab ? 'text-white border-white' : 'hover:text-white'}`} onClick={() => setActiveTab(tab)}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={handleSearch} className="bg-white rounded-[24px] p-3 flex flex-col md:flex-row items-center shadow-xl relative z-20">
            <div className="flex-1 w-full relative border-b md:border-b-0 md:border-r border-gray-100 p-4" ref={wrapperRef}>
              <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-1">Location</label>
              <input type="text" name="location" className="w-full bg-transparent text-black text-base font-medium outline-none placeholder-gray-400" placeholder={activeTab === 'activities' ? "Where to go?" : "Which city?"} value={searchParams.location} onChange={handleChange} onFocus={() => setShowSuggestions(true)} autoComplete="off" />
              {showSuggestions && (
                <div className="absolute top-[110%] left-0 w-[350px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 px-5 py-2 uppercase tracking-wide">Popular destinations</div>
                  {popularDestinations.map((item) => (
                    <div key={item.id} className="flex items-center px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none" onClick={() => handleSelectLocation(item.name)}>
                      <div className="text-lg mr-4 bg-gray-100 w-10 h-10 flex items-center justify-center rounded-full text-gray-600"><MapPin size={18}/></div>
                      <div><div className="text-sm font-bold text-gray-800">{item.name}</div><div className="text-xs text-gray-500">{item.sub}</div></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Check In */}
            <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-gray-100 p-4">
              <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-1">{activeTab === 'activities' ? 'Date' : 'Check In'}</label>
              <input type="text" name="checkIn" className="w-full bg-transparent text-black text-base font-medium outline-none placeholder-gray-400" placeholder="Add Dates" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => !e.target.value && (e.target.type = 'text')} onChange={handleChange} value={searchParams.checkIn} />
            </div>
            {/* Check Out */}
            {activeTab !== 'activities' && (
              <div className="flex-1 w-full border-b md:border-b-0 md:border-r border-gray-100 p-4">
                <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-1">Check Out</label>
                <input type="text" name="checkOut" className="w-full bg-transparent text-black text-base font-medium outline-none placeholder-gray-400" placeholder="Add Dates" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => !e.target.value && (e.target.type = 'text')} onChange={handleChange} value={searchParams.checkOut} />
              </div>
            )}
            {/* Guests */}
            <div className="flex-1 w-full p-4">
              <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-1">{activeTab === 'activities' ? 'Participants' : activeTab === 'rooms' ? 'No. of Rooms' : 'Guests'}</label>
              <input type="number" name={activeTab === 'rooms' ? 'rooms' : 'guests'} min="1" className="w-full bg-transparent text-black text-base font-medium outline-none placeholder-gray-400" placeholder={activeTab === 'rooms' ? "1 Room" : "1 Person"} value={activeTab === 'rooms' ? searchParams.rooms : searchParams.guests} onChange={handleChange} />
            </div>
            <button type="submit" className="bg-black text-white w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 hover:bg-gold hover:text-black transition-all shadow-lg shrink-0 m-2">
              <Search size={24} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}