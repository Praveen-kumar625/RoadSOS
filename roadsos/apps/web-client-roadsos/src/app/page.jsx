/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

"use client";
import React from 'react';
import { useEmergencyLifecycle } from '../shared/hooks/useEmergencyLifecycle';
import { ShieldAlert, Activity, MapPin } from 'lucide-react';

export default function Dashboard() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const { activeEvents } = useEmergencyLifecycle(apiUrl);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <header className="flex justify-between items-center mb-12 bg-white/5 border border-white/10 p-8 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
        <div className="flex items-center gap-8">
          <div className="bg-red-600 p-5 rounded-3xl shadow-[0_0_40px_rgba(220,38,38,0.5)]">
            <ShieldAlert className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter">RoadSoS <span className="text-red-500 italic">PRO</span></h1>
            <p className="text-xs font-mono text-slate-500 mt-2 uppercase tracking-widest">Optimized Kernel v2.0</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-12 lg:col-span-8 space-y-12">
          {Object.values(activeEvents).map(event => (
            <div key={event.id} className="bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-[4rem] p-12 shadow-2xl">
              <span className="bg-red-600 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">CRITICAL SOS</span>
              <h2 className="text-3xl font-black mt-6">Incident {event.id}</h2>
              <div className="grid grid-cols-2 gap-12 mt-12">
                <div className="bg-white/5 p-8 rounded-[2.5rem]">
                   <p className="text-[10px] font-black text-slate-500 uppercase">Responder</p>
                   <p className="text-xl font-black">{event.assigned_responder?.name || 'Searching...'}</p>
                </div>
                <div className="bg-black rounded-[3rem] h-64 relative overflow-hidden">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-red-500/10 rounded-full animate-ping"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
