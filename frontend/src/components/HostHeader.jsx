import React from 'react';
import { NavLink } from 'react-router-dom';
import './HostHeader.css';

export default function HostHeader() {
  return (
    <div className="host-nav-bar">
      <div className="host-nav-container">
        <NavLink 
          to="/host/properties" 
          className={({ isActive }) => isActive ? "host-link active" : "host-link"}
        >
          Properties
        </NavLink>
        
        <NavLink 
          to="/host/reservations" 
          className={({ isActive }) => isActive ? "host-link active" : "host-link"}
        >
          Reservations
        </NavLink>
        
        <NavLink 
          to="/host/transactions" 
          className={({ isActive }) => isActive ? "host-link active" : "host-link"}
        >
          Transactions
        </NavLink>
        
        <NavLink 
          to="/host/add" 
          className="host-link add-new"
        >
          + List New Property
        </NavLink>
      </div>
    </div>
  );
}