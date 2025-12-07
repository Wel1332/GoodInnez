import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityCard from './ActivityCard';
import { activities } from '../data/activities'; 

export default function ActivitiesSection() {
  const navigate = useNavigate();
  return (
    <section id="activities" className="relative py-32 min-h-[800px] flex items-center justify-center bg-[url('/activities-bg.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 w-full max-w-[1200px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[50px] p-12 shadow-2xl">
        <h2 className="text-4xl font-extrabold text-white mb-12 text-center">Activities</h2>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {activities.map((activity) => (<ActivityCard key={activity.id} activity={activity} />))}
        </div>
        <div className="flex justify-center">
          <button className="bg-black/80 backdrop-blur-md text-white px-10 py-4 rounded-full font-bold hover:bg-gold hover:text-black transition-all border border-white/10" onClick={() => navigate('/search')}>View All Hotels</button>
        </div>
      </div>
    </section>
  );
}