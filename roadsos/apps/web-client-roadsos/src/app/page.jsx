/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * Project: RoadSoS (IIT Madras Hackathon)
 */

"use client";
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { ShieldAlert, Activity, MapPin, BrainCircuit } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [emergency, setEmergency] = useState(null);

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
    socket.on('emergency_alert', setEmergency);
    
    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 p-8 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      <header className="relative z-10 flex justify-between items-center mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-10 h-10 text-red-500 animate-pulse" />
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white">RoadSoS</h1>
            <p className="text-xs text-cyan-400 font-mono">Divine Coder | IIT Madras</p>
          </div>
        </div>
        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-mono">M2M Socket Online</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Activity className="text-cyan-400"/> Live Edge Telemetry</h2>
            {telemetry ? (
              <div className="space-y-4 font-mono text-sm">
                <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                  <p className="text-slate-400">Speed (km/h)</p>
                  <p className="text-3xl text-white font-black">{telemetry.telemetry.speed_kmh}</p>
                </div>
                <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                  <p className="text-slate-400">Max G-Force</p>
                  <p className="text-3xl text-white font-black">{Math.max(Math.abs(telemetry.telemetry.accelerometer.x), Math.abs(telemetry.telemetry.accelerometer.y)).toFixed(2)}G</p>
                </div>
              </div>
            ) : <p className="text-slate-500 animate-pulse font-mono">Awaiting sensor data...</p>}
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><BrainCircuit className="text-purple-400"/> Open-LLM Analysis</h2>
            {aiData ? (
              <div className={"p-4 rounded-xl border " + (aiData.isCrash ? "bg-red-500/20 border-red-500/50" : "bg-emerald-500/10 border-emerald-500/30")}>
                <p className="text-sm text-slate-400">Aegis-Core Verdict</p>
                <p className={"text-2xl font-black " + (aiData.isCrash ? "text-red-400" : "text-emerald-400")}>
                  {aiData.severity}
                </p>
                <p className="text-xs mt-2 font-mono opacity-70">Confidence: {(aiData.confidence * 100).toFixed(1)}%</p>
              </div>
            ) : <p className="text-slate-500 font-mono">Model standing by...</p>}
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl h-72">
            <h2 className="text-lg font-bold mb-4 text-slate-300">Impact Waveform (G-Force)</h2>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="time" stroke="#ffffff50" fontSize={10} />
                <YAxis stroke="#ffffff50" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                <Line type="monotone" dataKey="gForce" stroke="#06b6d4" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><MapPin className="text-emerald-400"/> Dynamic Routing Hub</h2>
            {emergency ? (
              <div className="absolute inset-0 bg-red-950/80 z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
                <ShieldAlert className="w-24 h-24 text-red-500 mb-4 animate-bounce" />
                <h2 className="text-4xl font-black text-white mb-2">SOS DISPATCHED</h2>
                <div className="bg-black/50 border border-red-500/30 p-4 rounded-xl inline-block mt-4">
                  <p className="text-red-300 text-sm mb-1">Trauma Center Locked</p>
                  <p className="text-xl font-bold text-white">{emergency.dispatched_to && emergency.dispatched_to.name}</p>
                </div>
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                 <div className="w-64 h-64 border border-emerald-500/20 rounded-full absolute animate-[ping_3s_linear_infinite]"></div>
                 <div className="w-32 h-32 border border-emerald-500/40 rounded-full absolute animate-[ping_2s_linear_infinite]"></div>
                 <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_20px_#10b981]"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
