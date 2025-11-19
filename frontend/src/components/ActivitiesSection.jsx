// src/components/ActivitiesSection.jsx
import React from 'react';
import ActivityCard from './ActivityCard';
import { activities } from '../data/activities'; 
import './ActivitiesSection.css';

export default function ActivitiesSection() {
  return (
    // No inline style here anymore!
    <section className="activities-section">
      
      <div className="activities-glass-container">
        <h2 className="activities-title">Activities</h2>
        
        <div className="activities-grid">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
        
        <div className="button-container">
          <button className="view-all-btn">View All Hotels</button>
        </div>
      </div>
      
    </section>
  );
}