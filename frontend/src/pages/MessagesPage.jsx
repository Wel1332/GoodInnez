import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(1);
  return (
    <div className="bg-gray-50 h-screen pt-20 flex justify-center pb-8">
      <div className="w-[90%] max-w-[1200px] bg-white rounded-3xl shadow-sm border border-gray-200 grid grid-cols-[350px_1fr] overflow-hidden">
        <div className="border-r border-gray-100 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h1 className="text-2xl font-extrabold">Messages</h1><span className="bg-gold text-white px-2 py-1 rounded-full text-xs font-bold">2 New</span></div>
            <div className="overflow-y-auto flex-1">
                {[1,2].map(id => (
                    <div key={id} onClick={() => setActiveChat(id)} className={`flex gap-4 p-5 cursor-pointer border-b border-gray-50 hover:bg-gray-50 ${activeChat === id ? 'bg-gray-50 border-l-4 border-l-black' : ''}`}>
                        <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold">JD</div>
                        <div><div className="flex justify-between mb-1"><span className="font-bold text-sm">John Doe</span><span className="text-xs text-gray-400">10:30 AM</span></div><p className="text-sm text-gray-500 truncate">Confirming your arrival...</p></div>
                    </div>
                ))}
            </div>
        </div>
        <div className="flex flex-col bg-white">
            <div className="p-6 border-b border-gray-100 flex items-center gap-4"><div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">JD</div><h3 className="font-bold">John Doe</h3></div>
            <div className="flex-1 bg-gray-50 p-8 flex flex-col gap-4 overflow-y-auto">
                <div className="self-start bg-white p-4 rounded-2xl rounded-bl-none shadow-sm max-w-[70%]"><p>Hello!</p></div>
                <div className="self-end bg-black text-white p-4 rounded-2xl rounded-br-none max-w-[70%]"><p>Hi there!</p></div>
            </div>
            <div className="p-6 bg-white border-t border-gray-100 flex gap-4"><input type="text" placeholder="Type a message..." className="flex-1 p-4 border border-gray-200 rounded-full outline-none focus:border-black bg-gray-50" /><button className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"><Send size={20}/></button></div>
        </div>
      </div>
    </div>
  );
}