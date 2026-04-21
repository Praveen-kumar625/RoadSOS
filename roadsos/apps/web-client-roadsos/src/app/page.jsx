/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

"use client";
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { ShieldAlert, Activity, MapPin, BrainCircuit, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [sosState, setSosState] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('live_telemetry', (data) => {
      setTelemetry(data);
      setChartData(prev => {
        const newData = [...prev, { time: new Date().toLocaleTimeString(), gForce: Math.abs(data.telemetry.accelerometer.x) }];
        return newData.slice(-14);
      });
    });
    
    socket.on('ai_analysis', setAiData);
    
    // Listen for the new State Machine updates
    socket.on('emergency_alert_update', (state) => {
      setSosState(state);
    });
    
    return () => socket.disconnect();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ANALYZING': return 'text-yellow-400';
      case 'DISPATCHED': return 'text-blue-400';
      case 'FAILED': return 'text-red-500';
      default: return 'text-emerald-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-8 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-900/10 blur-[120px] rounded-full pointer-events-none"></div>

      <header className="relative z-10 flex justify-between items-center mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-10 h-10 text-red-500" />
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white">RoadSoS <span className="text-red-500 text-sm font-mono ml-2">PRO</span></h1>
            <p className="text-xs text-cyan-400 font-mono">Divine Coder | System Design Certified</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-mono">Resilience Layer: ACTIVE</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-4 space-y-6">
          {/* Telemetry Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity className="text-cyan-400"/> Live Edge Telemetry</h2>
            {telemetry ? (
              <div className="space-y-4 font-mono">
                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                  <span className="text-slate-400 text-xs uppercase">Velocity</span>
                  <span className="text-2xl text-white font-bold">{telemetry.telemetry.speed_kmh} <span className="text-xs font-normal">km/h</span></span>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                  <span className="text-slate-400 text-xs uppercase">Force</span>
                  <span className="text-2xl text-white font-bold">{Math.max(Math.abs(telemetry.telemetry.accelerometer.x), Math.abs(telemetry.telemetry.accelerometer.y)).toFixed(2)}G</span>
                </div>
              </div>
            ) : <p className="text-slate-500 animate-pulse font-mono">Awaiting sensor link...</p>}
          </div>

          {/* AI Decision Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><BrainCircuit className="text-purple-400"/> Aegis-Core Verdict</h2>
            {aiData ? (
              <div className={"p-4 rounded-xl border " + (aiData.isCrash ? "bg-red-500/10 border-red-500/30" : "bg-emerald-500/10 border-emerald-500/30")}>
                <p className={"text-3xl font-black " + (aiData.isCrash ? "text-red-400" : "text-emerald-400")}>
                  {aiData.severity}
                </p>
                <p className="text-xs mt-1 font-mono text-slate-500 italic">Validated via Qwen-2.5 Hybrid Inferencing</p>
              </div>
            ) : <p className="text-slate-500 font-mono italic">AI standing by for events...</p>}
          </div>
        </div>

        {/* Impact Visualization & Dispatcher Hub */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl h-64">
            <h2 className="text-lg font-bold mb-4 text-slate-300">Kinetic Waveform</h2>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#ffffff20" fontSize={10} domain={[0, 30]} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '10px' }} />
                <Line type="step" dataKey="gForce" stroke="#06b6d4" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* THE HEART: SOS Lifecycle Hub */}
          <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[300px]">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2 uppercase tracking-widest"><MapPin className="text-red-500"/> Emergency Orchestration Hub</h2>
            
            {!sosState ? (
              <div className="h-full w-full flex flex-col items-center justify-center opacity-40">
                 <div className="w-48 h-48 border-2 border-dashed border-slate-700 rounded-full flex items-center justify-center animate-spin-slow">
                    <MapPin className="w-8 h-8 text-slate-700" />
                 </div>
                 <p className="mt-4 text-slate-600 font-mono text-sm">System armed. Scanning for crash triggers.</p>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${getStatusColor(sosState.status)}`}>
                    {sosState.status === 'ANALYZING' ? <Loader2 className="w-12 h-12 animate-spin" /> : 
                     sosState.status === 'FAILED' ? <AlertCircle className="w-12 h-12" /> :
                     <CheckCircle2 className="w-12 h-12" />}
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-white">{sosState.status}</h3>
                    <p className="text-slate-400 font-mono text-sm">TRACKING ID: {sosState.id}</p>
                  </div>
                </div>

                {sosState.status === 'DISPATCHED' && (
                  <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-700">
                    <div className="bg-white/5 p-6 rounded-2xl border border-blue-500/20">
                      <p className="text-blue-400 text-xs font-bold uppercase mb-1">Assigned Responder</p>
                      <p className="text-xl font-bold text-white">{sosState.responder?.name || 'Local Emergency Unit'}</p>
                      <p className="text-xs text-slate-500 mt-1 capitalize">Type: {sosState.responder?.category}</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-emerald-500/20 text-center">
                      <p className="text-emerald-400 text-xs font-bold uppercase mb-1">Estimated Arrival</p>
                      <p className="text-4xl font-black text-white">{sosState.eta} <span className="text-sm font-normal">MIN</span></p>
                    </div>
                  </div>
                )}

                {sosState.status === 'FAILED' && (
                  <div className="bg-red-900/20 p-6 rounded-2xl border border-red-500/30">
                    <p className="text-red-400 font-bold mb-1">CRITICAL SYSTEM ERROR</p>
                    <p className="text-sm text-slate-300 font-mono">{sosState.lastError}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
