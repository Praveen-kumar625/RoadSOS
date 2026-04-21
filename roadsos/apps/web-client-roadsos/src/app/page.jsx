/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

"use client";
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { ShieldAlert, Activity, MapPin, BrainCircuit, Car, Info, Siren, Wrench, ShieldCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PrivacyConsent from '../shared/components/PrivacyConsent';

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState(null);
  const [activeEvents, setActiveEvents] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('live_telemetry', (data) => {
      setTelemetry(data);
      setChartData(prev => [...prev, { time: new Date().toLocaleTimeString(), gForce: Math.abs(data.telemetry.accelerometer.x) }].slice(-20));
    });
    
    // Listen for the Winning-Level Orchestration events
    socket.on('emergency_orchestration_update', (state) => {
      setActiveEvents(prev => ({
        ...prev,
        [state.id]: state
      }));
    });
    
    return () => socket.disconnect();
  }, []);

  const getResponderIcon = (category) => {
    switch (cat) {
      case 'hospital': return <Siren className="text-red-500" />;
      case 'police': return <ShieldCheck className="text-blue-500" />;
      case 'towing': return <Car className="text-yellow-500" />;
      case 'puncture': return <Wrench className="text-emerald-500" />;
      default: return <Info />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-slate-100 p-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-red-600 p-2 rounded-lg"><ShieldAlert className="w-8 h-8 text-white" /></div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">RoadSoS <span className="text-red-500">ORCHESTRATOR</span></h1>
            <p className="text-xs font-mono text-slate-500">IIT Madras Hackathon 2026 | Simulation Dashboard</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-xs font-bold text-emerald-500">AI ENGINE ONLINE</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Left: Telemetry & Waveform */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" /> Live Kinetic Waveform
            </h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="gForce" stroke="#22d3ee" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <YAxis hide domain={[0, 30]} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {telemetry && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase">Speed</p>
                  <p className="text-xl font-black">{telemetry.telemetry.speed_kmh} <span className="text-xs font-normal">km/h</span></p>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase">Force</p>
                  <p className="text-xl font-black">{Math.max(Math.abs(telemetry.telemetry.accelerometer.x), Math.abs(telemetry.telemetry.accelerometer.y)).toFixed(1)}G</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Active Orchestrations */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[600px]">
            <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-400" /> Multi-Agent Response Hub
            </h3>

            {Object.values(activeEvents).length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center opacity-20">
                <ShieldAlert className="w-16 h-16 mb-4" />
                <p>System Armed. Listening for triggers...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.values(activeEvents).map(event => (
                  <div key={event.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-right-4">
                    {/* Event Header */}
                    <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-red-600 rounded text-[10px] font-bold uppercase tracking-tighter">Event: {event.id}</div>
                        <div className="text-xs font-mono text-slate-400">{new Date(event.timestamp).toLocaleTimeString()}</div>
                      </div>
                      <div className="text-xs font-bold text-purple-400">PRIORITY SCORE: {event.priorityScore}</div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Responders List */}
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-4 tracking-widest">Coordinated Responders</p>
                        <div className="space-y-3">
                          {event.responders.map((r, i) => (
                            <div key={i} className="flex items-center justify-between bg-black/30 p-3 rounded-xl border border-white/5">
                              <div className="flex items-center gap-3">
                                {r.category === 'hospital' ? <Siren className="w-4 h-4 text-red-500" /> : 
                                 r.category === 'police' ? <ShieldCheck className="w-4 h-4 text-blue-500" /> : 
                                 <Car className="w-4 h-4 text-yellow-500" />}
                                <div>
                                  <p className="text-xs font-bold">{r.name}</p>
                                  <p className="text-[10px] text-slate-500 uppercase">{r.category}</p>
                                </div>
                              </div>
                              <div className="text-[10px] font-mono text-emerald-500">DISPATCHED</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI EXPLANATION PANEL (THE WINNER) */}
                      <div className="bg-purple-900/10 border border-purple-500/20 rounded-2xl p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10"><BrainCircuit className="w-12 h-12" /></div>
                        <h4 className="text-[10px] font-bold text-purple-400 uppercase mb-2 flex items-center gap-2">
                           <Info className="w-3 h-3" /> AI Decision Logic
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed italic">
                          "{event.explanation}"
                        </p>
                        <div className="mt-4 grid grid-cols-3 gap-2">
                           {Object.entries(event.responders[0]?.factors || {}).map(([key, val]) => (
                             <div key={key} className="text-center bg-black/40 p-2 rounded-lg">
                               <p className="text-[8px] uppercase text-slate-500">{key}</p>
                               <p className="text-xs font-bold">{val}</p>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
