import React, { useState } from 'react';
import HostHeader from '../../components/HostHeader';
import { Download } from 'lucide-react';

const mockTransactions = [
  { id: 1, title: "Payout for Booking #102", date: "12 Mar 2021", amount: 1000, status: "completed" },
  { id: 2, title: "Payout for Booking #98", date: "10 Mar 2021", amount: 1000, status: "completed" },
];

export default function HostTransactions() {
  const [activeTab, setActiveTab] = useState('completed');

  return (
    <div className="bg-white min-h-screen">
      <HostHeader />
      <main className="max-w-[1200px] mx-auto px-5 py-16">
        <h1 className="text-4xl font-extrabold text-black mb-8">Transaction History</h1>
        
        <div className="flex justify-between items-center border-b border-gray-200 mb-10 pb-4">
          <div className="flex gap-8">
            {['Completed', 'Upcoming', 'Gross Earning'].map(tab => (
               <button 
                 key={tab}
                 className={`pb-4 text-sm font-bold transition-colors border-b-[3px] -mb-[19px] ${activeTab === tab.toLowerCase() ? 'text-black border-black' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                 onClick={() => setActiveTab(tab.toLowerCase())}
               >
                 {tab}
               </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black transition-colors border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
            <Download size={16} /> Download CSV
          </button>
        </div>

        <div className="flex flex-col gap-4">
           {mockTransactions.map(trans => (
              <div key={trans.id} className="bg-gray-50 p-6 rounded-xl flex justify-between items-center hover:bg-gray-100 transition-colors">
                 <div>
                    <h4 className="font-bold text-black mb-1">{trans.title}</h4>
                    <span className="text-sm text-gray-500">{trans.date}</span>
                 </div>
                 <div className="text-xl font-extrabold text-black">$ {trans.amount} USD</div>
              </div>
           ))}
        </div>
      </main>
    </div>
  );
}