import React, { useState } from 'react';
import HostHeader from '../../components/HostHeader';
import './HostTransactions.css';

const mockTransactions = [
  { id: 1, title: "Payout for Booking #102", date: "12 Mar 2021", amount: 1000, status: "completed" },
  { id: 2, title: "Payout for Booking #98", date: "10 Mar 2021", amount: 1000, status: "completed" },
];

export default function HostTransactions() {
  const [activeTab, setActiveTab] = useState('completed');

  return (
    <div className="host-page">
      <HostHeader />
      <main className="host-container">
        <h1>Transaction History</h1>
        
        <div className="trans-tabs">
          {['Completed', 'Upcoming', 'Gross Earning'].map(tab => (
             <button 
               key={tab}
               className={`host-tab ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
               onClick={() => setActiveTab(tab.toLowerCase())}
             >
               {tab}
             </button>
          ))}
        </div>

        <div className="trans-list">
           {mockTransactions.map(trans => (
              <div key={trans.id} className="trans-row">
                 <div className="trans-info">
                    <h4>{trans.title}</h4>
                    <span className="trans-date">{trans.date}</span>
                 </div>
                 <div className="trans-amount">$ {trans.amount} USD</div>
              </div>
           ))}
        </div>
      </main>
    </div>
  );
}