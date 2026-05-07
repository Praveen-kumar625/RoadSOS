"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, ChevronRight, Maximize2, Ambulance, Wrench, Shield, Car, Loader2 } from "lucide-react";
import Link from "next/link";
import { emergencyService } from "@/shared/api/emergencyService";

export function Dashboard() {
  const [activeRequests, setActiveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const reqs = await emergencyService.getActiveRequests();
        setActiveRequests(reqs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();

    // Set an interval to poll for updates
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const hasActiveEmergency = activeRequests.length > 0;
  const latestEmergency = activeRequests[0];

  return (
    <div className="space-y-8 pb-10">
      {/* Emergency Alert Banner */}
      <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl flex items-center gap-5 shadow-lg cursor-pointer transition-transform active:scale-[0.98]">
        <div className="h-14 w-14 rounded-2xl bg-red-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
          <AlertTriangle className="h-8 w-8 text-white stroke-[2.5]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-red-500 tracking-wide text-lg">Active Alert</h3>
          <p className="text-sm text-white/80 font-medium leading-tight mt-1">
            Severe accident reported on I-95 North. Expect delays and route diversions.
          </p>
        </div>
        <ChevronRight className="h-6 w-6 text-red-500 shrink-0" />
      </div>

      {/* Quick Action Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-wide">Emergency Services</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/request?type=ambulance" className="flex flex-col items-center justify-center gap-3 bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 active:bg-white/5 transition-colors">
            <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <Ambulance className="h-8 w-8 text-red-500" />
            </div>
            <span className="font-semibold text-white">Ambulance</span>
          </Link>
          
          <Link href="/request?type=towing" className="flex flex-col items-center justify-center gap-3 bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 active:bg-white/5 transition-colors">
            <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Car className="h-8 w-8 text-blue-500" />
            </div>
            <span className="font-semibold text-white">Tow Truck</span>
          </Link>

          <Link href="/request?type=mechanic" className="flex flex-col items-center justify-center gap-3 bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 active:bg-white/5 transition-colors">
            <div className="h-16 w-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Wrench className="h-8 w-8 text-yellow-500" />
            </div>
            <span className="font-semibold text-white">Mechanic</span>
          </Link>

          <Link href="/request?type=police" className="flex flex-col items-center justify-center gap-3 bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 active:bg-white/5 transition-colors">
            <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-purple-500" />
            </div>
            <span className="font-semibold text-white">Police</span>
          </Link>
        </div>
      </div>

      {/* Live Status Widget */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-wide">Live Tracking</h2>
          {hasActiveEmergency && (
            <Link href="/tracking" className="text-sm font-bold text-red-500 hover:text-red-400">View Map</Link>
          )}
        </div>
        
        {loading ? (
          <div className="h-[240px] border border-white/10 bg-[#1C1C1E] rounded-3xl flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white/30 animate-spin" />
          </div>
        ) : hasActiveEmergency ? (
          <div className="relative overflow-hidden rounded-3xl h-[240px] border border-white/10 bg-[#1C1C1E]">
            {/* Map Background Pattern (Simulated) */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
              <div className="flex items-start justify-between">
                <div className="bg-[#0A0D14]/90 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-xl max-w-[200px]">
                  <p className="text-xs text-white/50 mb-1 font-semibold uppercase tracking-wider">Responder Status</p>
                  <p className="text-2xl font-bold text-red-500">Dispatched</p>
                  <p className="text-sm font-medium text-white/80 mt-1 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    {latestEmergency.emergency_type.toUpperCase()}
                  </p>
                </div>
                <Link href="/tracking" className="h-12 w-12 rounded-2xl bg-[#0A0D14]/90 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-xl hover:bg-white/5 transition-colors">
                  <Maximize2 className="h-6 w-6 text-white/80" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[240px] border border-white/10 bg-[#1C1C1E] rounded-3xl flex flex-col items-center justify-center text-center p-6">
            <Shield className="h-12 w-12 text-white/20 mb-3" />
            <p className="text-white/80 font-medium">No Active Requests</p>
            <p className="text-white/50 text-sm mt-1">Your emergency requests will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
