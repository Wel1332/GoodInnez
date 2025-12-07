import React from 'react';
import { Bell, X } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="bg-gray-50 min-h-screen pt-28 pb-16">
      <main className="max-w-[800px] mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-black">Notifications</h1>
                <button className="text-gray-400 font-bold hover:text-black">Mark all read</button>
            </div>
            <div className="flex flex-col">
                {[1,2,3].map(i => (
                    <div key={i} className="flex gap-6 p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors items-start">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-black shrink-0"><Bell size={20}/></div>
                        <div className="flex-1">
                            <h4 className="font-bold text-black mb-1">New Reservation Alert</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">Alice Smith booked Luxury Room for Dec 24.</p>
                            <span className="text-xs text-gray-400 font-bold mt-2 block">2 hours ago</span>
                        </div>
                        <button className="text-gray-300 hover:text-black"><X size={20}/></button>
                    </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}