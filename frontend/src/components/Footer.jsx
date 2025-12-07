import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="footer" className="bg-black text-white pt-20 pb-8 border-t border-gray-900">
      <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-extrabold text-gold mb-4">Good Innez</h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">Your premium partner for the best stays and experiences in Cebu City.</p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider mb-6 uppercase">Company</h3>
          <ul className="space-y-3">
            {['About Us', 'Legal Information', 'Contact Us', 'Blogs'].map(item => (
              <li key={item}><a href="#" className="text-gray-400 hover:text-gold text-sm transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider mb-6 uppercase">Help Center</h3>
          <ul className="space-y-3">
            {['Find a Hotel', 'Find Activities', 'Why Us?', 'FAQs', 'Guides'].map(item => (
              <li key={item}><a href="#" className="text-gray-400 hover:text-gold text-sm transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider mb-6 uppercase">Contact Info</h3>
          <div className="space-y-4 text-gray-400 text-sm">
            <p className="flex items-center gap-3"><Phone size={16} className="text-gold"/> 0969696969</p>
            <p className="flex items-center gap-3"><Mail size={16} className="text-gold"/> admin@goodinnez.com</p>
            <p className="flex items-center gap-3"><MapPin size={16} className="text-gold"/> Pasil, Cebu City</p>
          </div>
          <div className="flex gap-4 mt-6">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 bg-white text-black rounded-full flex items-center justify-center hover:bg-gold transition-colors"><Icon size={18} /></a>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-8 pt-8 border-t border-gray-900 text-center">
        <p className="text-gray-600 text-xs">© 2025 Good Innez | All rights reserved</p>
      </div>
    </footer>
  );
}