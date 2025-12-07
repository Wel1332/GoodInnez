import React from 'react';
import { NavLink } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function HostHeader() {
  const linkClasses = ({ isActive }) => 
    `text-gray-500 font-semibold text-[0.95rem] py-4 px-2 border-b-[3px] transition-all hover:text-black ${
      isActive ? "text-black border-black" : "border-transparent"
    }`;

  return (
    <div className="bg-white border-b border-gray-200 px-8 mt-20">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center">
        <div className="flex gap-8">
            <NavLink to="/host/properties" className={linkClasses}>Properties</NavLink>
            <NavLink to="/host/reservations" className={linkClasses}>Reservations</NavLink>
            <NavLink to="/host/transactions" className={linkClasses}>Transactions</NavLink>
        </div>
        
        <NavLink 
          to="/host/add" 
          className="text-gold font-semibold text-[0.95rem] flex items-center gap-1 hover:text-yellow-600 transition-colors"
        >
          <Plus size={16} /> List New Property
        </NavLink>
      </div>
    </div>
  );
}