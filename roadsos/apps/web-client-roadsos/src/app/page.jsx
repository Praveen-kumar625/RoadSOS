/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

"use client";
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { ShieldAlert, Activity, MapPin, BrainCircuit, PlayCircle, Zap, Cpu, History } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import PrivacyConsent from '../shared/components/PrivacyConsent';

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState(null);
  const [activeEvents, setActiveEvents] = useState({});
  const [chartData, setChartData] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [health, setHealth] = useState({ uptime: 0, memory: 0, lastLatency: 0 });

  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('live_telemetry', (data) => {
      setTelemetry(data);
      setChartData(prev => [...prev, { time: new Date().toLocaleTimeString(), gForce: Math.abs(data.telemetry.accelerometer.x) }].slice(-20));
    });
    
    socket.on('system_health', setHealth);
    
    socket.on('emergency_orchestration_update', (state) => {
      setActiveEvents(prev => ({ ...prev, [state.id]: state }));
      if (state.status === 'DISPATCHED') setIsSimulating(false);
    });
    
    return () => socket.disconnect();
  }, []);

  const triggerDemo = async () => {
    setIsSimulating(true);
    await fetch('http://localhost:5000/api/v1/simulation/trigger-demo', { method: 'POST' });
  };

  return (
    <div className="min-h-screen bg-[#020202] text-slate-100 p-6 font-sans">
      {/* 100% SOLID HEADER */}
      <header className="flex justify-between items-center mb-8 bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-3xl shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="bg-red-600 p-4 rounded-3xl shadow-[0_0_30px_rgba(220,38,38,0.4)] animate-pulse">
            <ShieldAlert className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter">RoadSoS <span className="text-red-500 italic underline decoration-4 underline-offset-8">PRO</span></h1>
            <div className="flex gap-4 mt-2">
               <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">SYSTEM_HEALTH: NOMINAL</span>
               <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">M2M_LATENCY: {health.lastLatency}ms</span>
            </div>
          </div>
        </div>

        <button 
          onClick={triggerDemo}
          disabled={isSimulating}
          className="group flex items-center gap-4 bg-white text-black hover:bg-red-600 hover:text-white disabled:bg-slate-800 text-sm px-10 py-5 rounded-3xl font-black transition-all active:scale-95 shadow-2xl"
        >
          {isSimulating ? <Zap className="animate-bounce" /> : <PlayCircle className="w-6 h-6" />}
          INITIATE GLOBAL SOS SIMULATION
        </button>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Observability Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-gradient-to-br from-cyan-900/20 to-black border border-white/10 rounded-[2.5rem] p-8">
            <h3 className="text-[10px] font-black text-cyan-400 mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
              <Activity className="w-4 h-4" /> Real-time Impact Telemetry
            </h3>
            <div className="h-48 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <Line type="monotone" dataKey="gForce" stroke="#06b6d4" strokeWidth={4} dot={false} isAnimationActive={false} />
                  <YAxis hide domain={[0, 30]} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {telemetry && (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">Velocity</p>
                  <p className="text-4xl font-black text-white">{telemetry.telemetry.speed_kmh}<span className="text-xs ml-1 opacity-40">KM/H</span></p>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">G-Force</p>
                  <p className="text-4xl font-black text-red-500">{Math.max(Math.abs(telemetry.telemetry.accelerometer.x), Math.abs(telemetry.telemetry.accelerometer.y)).toFixed(1)}G</p>
                </div>
              </div>
            )}
          </div>

          {/* Engine Health Panel */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
            <h3 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.3em] flex items-center gap-3">
              <Cpu className="w-4 h-4 text-emerald-400" /> Infrastructure Health
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl">
                  <span className="text-xs font-mono text-slate-500">API Uptime</span>
                  <span className="text-xs font-mono text-emerald-400">{Math.floor(health.uptime)}s</span>
               </div>
               <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl">
                  <span className="text-xs font-mono text-slate-500">RAM Load</span>
                  <span className="text-xs font-mono text-cyan-400">{Math.round(health.memory / 1024 / 1024)}MB</span>
               </div>
            </div>
          </div>
        </div>

        {/* The "Heart": Multi-Agent Orchestrator */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 min-h-[700px] shadow-inner relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 blur-[100px] rounded-full"></div>
            
            <h3 className="text-[10px] font-black text-slate-400 mb-10 uppercase tracking-[0.3em] flex items-center gap-3">
              <History className="w-4 h-4 text-purple-400" /> Active Emergency Lifecycles
            </h3>

            {Object.values(activeEvents).length === 0 ? (
              <div className="h-[400px] flex flex-col items-center justify-center opacity-20">
                <ShieldAlert className="w-24 h-24 mb-6" />
                <p className="font-mono text-xs tracking-[0.5em] uppercase">Security Armed & Persistent</p>
              </div>
            ) : (
              <div className="space-y-10">
                {Object.values(activeEvents).map(event => (
                  <div key={event.id} className="bg-black/60 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500">
                    <div className="bg-white/5 p-6 flex justify-between items-center px-10">
                       <div className="flex items-center gap-4">
                          <span className="bg-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">CRITICAL INCIDENT</span>
                          <span className="text-xs font-mono text-slate-500">ID: {event.id}</span>
                       </div>
                       <div className="flex gap-4">
                          <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                            Est. Time Saved: 14 MIN
                          </span>
                          <div className="text-xs font-black text-purple-400 uppercase tracking-widest">Priority Score: {event.priorityScore}</div>
                       </div>
                    </div>

                    <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
                      <div className="space-y-8">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Coordinated Response Unit</p>
                        <div className="space-y-4">
                          {event.responders.map((r, i) => (
                            <div key={i} className="flex items-center justify-between bg-white/5 p-5 rounded-[1.5rem] border border-white/5 hover:border-emerald-500/40 transition-all cursor-default">
                              <div className="flex items-center gap-5">
                                <div className="p-3 bg-black/40 rounded-2xl text-emerald-500 border border-emerald-500/10">
                                  <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-sm font-black text-white">{r.name}</p>
                                  <p className="text-[10px] text-slate-500 font-mono uppercase">{r.category} • DISPATCHED</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="bg-purple-900/10 border border-purple-500/20 rounded-[2rem] p-8">
                           <h4 className="text-[10px] font-black text-purple-400 uppercase mb-4 tracking-[0.2em] flex items-center gap-2">
                              Aegis-Core Intelligence Log
                           </h4>
                           <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
                             "{event.explanation}"
                           </p>
                        </div>

                        {/* MINI MAP COMPONENT */}
                        <div className="bg-black border border-white/10 rounded-[2rem] h-56 relative overflow-hidden flex items-center justify-center">
                           <div className="w-64 h-64 border border-red-500/20 rounded-full absolute animate-[ping_5s_linear_infinite]"></div>
                           <div className="w-32 h-32 border border-red-500/40 rounded-full absolute animate-[ping_2s_linear_infinite]"></div>
                           <div className="w-3 h-3 bg-red-500 rounded-full z-10 shadow-[0_0_20px_#ef4444]"></div>
                           <p className="absolute bottom-6 font-mono text-[8px] text-slate-600 uppercase tracking-widest">Aegis Dynamic Spatial View v2.0</p>
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
      <PrivacyConsent />
    </div>
  );
}
