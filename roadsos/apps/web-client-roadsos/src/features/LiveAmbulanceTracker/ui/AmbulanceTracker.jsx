"use client";
import React, { useEffect, useState } from "react";
import { AlertTriangle, MapPin, Phone, ShieldAlert, Navigation, Loader2 } from "lucide-react";
import Link from "next/link";
import { emergencyService } from "@/shared/api/emergencyService";

export function AmbulanceTracker() {
  const [activeRequest, setActiveRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use a mocked driver and ETA for demo purposes, but the request type is real
  const mockDriver = { name: "Ravi Kumar", rating: "4.8", experience: "10" }

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const reqs = await emergencyService.getActiveRequests();
        if (reqs.length > 0) {
          setActiveRequest(reqs[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();

    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0A0D14]">
        <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
      </div>
    );
  }

  if (!activeRequest) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center bg-[#0A0D14] p-6 text-center">
        <ShieldAlert className="h-24 w-24 text-white/20 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">No Active Emergency</h2>
        <p className="text-white/60 mb-8 max-w-sm">
          You currently have no active emergency requests. If you need help, please initiate a new request.
        </p>
        <Link 
          href="/request"
          className="bg-red-500 text-white font-bold py-4 px-8 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)] active:scale-95 transition-transform"
        >
          Request Emergency Help
        </Link>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-[#1C1C1E] overflow-hidden font-sans selection:bg-red-500/30 flex flex-col md:flex-row">
      
      {/* MAP AREA (Simulated with Grid + Pulse) */}
      <div className="relative flex-1 w-full h-full bg-[#0A0D14] flex items-center justify-center overflow-hidden">
        
        {/* Deep Map Grid Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '100px 100px' }}
        />

        {/* Sonar Ping Animation */}
        <div className="relative flex items-center justify-center h-full w-full">
          
          {/* User Location Marker (Center) */}
          <div className="absolute z-10 flex flex-col items-center">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.6)]">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="mt-2 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/10">
              Your Location
            </div>
          </div>

          {/* Incoming Responder Marker (Offset) */}
          <div className="absolute z-20 flex flex-col items-center" style={{ transform: 'translate(-80px, -120px)' }}>
            
            {/* Pulsing rings around responder */}
            <div className="absolute h-32 w-32 rounded-full border-2 border-red-500/30 animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute h-48 w-48 rounded-full border border-red-500/10 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
            
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.8)]">
              <Navigation className="h-7 w-7 text-white" />
            </div>
            <div className="mt-2 rounded-full bg-red-500/20 backdrop-blur-md px-3 py-1 text-xs font-bold text-red-100 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
              {activeRequest.emergency_type.toUpperCase()} - 2.4km
            </div>
          </div>

        </div>

        {/* Top Header Floating on Map */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-6 z-30">
          <div className="mx-auto max-w-lg bg-[#0A0D14]/80 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
              <AlertTriangle className="h-6 w-6 text-red-500 animate-pulse" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white tracking-wide">Help is on the way</h2>
              <p className="text-sm font-medium text-white/70">Estimated arrival in <span className="text-red-400 font-bold">6 mins</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SHEET / SIDE PANEL */}
      <div className="z-40 w-full md:w-[400px] md:h-full bg-[#1C1C1E] border-t md:border-t-0 md:border-l border-white/10 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Mobile Handle */}
        <div className="w-full flex justify-center py-3 md:hidden">
          <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>

        <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
          
          {/* Driver Profile */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/20 shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mockDriver.name}`} alt="Driver" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white tracking-wide">{mockDriver.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="flex items-center text-yellow-500 text-sm font-bold">
                    ★ {mockDriver.rating}
                  </span>
                  <span className="text-white/30 text-xs">•</span>
                  <span className="text-white/60 text-sm">{mockDriver.experience} yrs exp</span>
                </div>
              </div>
              <a 
                href="tel:+1234567890" 
                className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/20 active:scale-95 transition-transform shrink-0"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="bg-[#0A0D14] rounded-2xl p-4 border border-white/5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-1">Vehicle</p>
                <p className="text-lg font-bold text-white">Advanced Life Support</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-1">Plate</p>
                <p className="text-lg font-bold tracking-widest text-white">MH-12-SOS</p>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="bg-[#0A0D14] rounded-2xl p-4 border border-white/5">
            <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-2">Request Details</p>
            <p className="text-sm text-white/80">{activeRequest.details}</p>
          </div>

          <div className="flex-1" />

          {/* Cancel SOS Button */}
          <button className="w-full bg-white/5 hover:bg-white/10 active:bg-white/20 border border-white/10 text-white font-bold py-4 rounded-2xl transition-colors">
            Cancel Request
          </button>

        </div>
      </div>
    </div>
  );
}
