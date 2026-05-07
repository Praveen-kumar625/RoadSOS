"use client";

import React, { useEffect, useState, useRef } from "react";
import { AlertTriangle, Ambulance, Wrench, Shield, Car, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { emergencyService } from "@/shared/api/emergencyService";
import { supabase } from "@/shared/api/supabase";
import { motion } from "framer-motion";

// -----------------------------------------------------------------------------
// SWIPE TO SOS COMPONENT
// -----------------------------------------------------------------------------
const SwipeToSOS = () => {
  const router = useRouter();
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  const handleDragEnd = (event, info) => {
    if (info.offset.x > 180) {
      triggerEmergency();
    }
  };

  const triggerEmergency = () => {
    setIsUnlocked(true);
    setTimeout(() => {
      router.push("/request?type=ambulance");
    }, 300);
  };

  return (
    <div className="w-full bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/10 rounded-full h-[72px] p-2 flex items-center relative overflow-hidden shadow-2xl mt-auto">
      {/* Background Track Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-white/40 font-bold uppercase tracking-[0.2em] text-sm animate-pulse">
          {isUnlocked ? "DISPATCHING..." : "Swipe to SOS"}
        </span>
      </div>

      {/* Screen Reader & Keyboard Fallback */}
      <button 
        onClick={triggerEmergency}
        className="sr-only focus:not-sr-only focus:absolute focus:inset-0 focus:z-50 focus:bg-red-500 focus:text-white focus:font-bold focus:rounded-full"
        aria-label="Activate Emergency SOS"
      >
        Trigger SOS
      </button>

      {/* Swipeable Thumb */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 220 }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={isUnlocked ? { x: 220, scale: 0.9 } : { x: 0 }}
        className="h-14 w-14 rounded-full bg-emergency-gradient flex items-center justify-center shadow-sos-btn cursor-grab active:cursor-grabbing z-10 relative"
      >
        <AlertTriangle className="h-6 w-6 text-white stroke-[2.5]" />
        
        {/* Shimmer effect on the thumb */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[30deg] animate-[shimmer_2s_infinite]" />
        </div>
      </motion.div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// DASHBOARD VIEW
// -----------------------------------------------------------------------------
export function Dashboard() {
  const [activeRequests, setActiveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;

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
    
    // Initial fetch
    fetchRequests();

    // 1. Subscribe to Supabase Realtime (WebSockets)
    let channel;
    if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      channel = supabase
        .channel('public:emergency_requests')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'emergency_requests' },
          (payload) => {
            console.log('Realtime Dashboard Update:', payload);
            fetchRequests(); // Keep state synced with backend
          }
        )
        .subscribe();
    }

    // 2. Fallback Polling (for local storage or socket failure)
    interval = setInterval(fetchRequests, 10000);
    
    return () => {
      clearInterval(interval);
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const hasActiveEmergency = activeRequests.length > 0;
  const latestEmergency = activeRequests[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col min-h-[calc(100vh-160px)] px-4 py-4 space-y-6"
    >
      
      {/* 1. Live Tracking Widget */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider">Live Status</h2>
          {hasActiveEmergency && (
            <Link href="/tracking" className="text-xs font-bold text-red-500 flex items-center gap-1 hover:text-red-400">
              Open Map <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </div>
        
        <div className="relative overflow-hidden rounded-3xl min-h-[160px] bg-[#1C1C1E]/50 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col justify-center">
          
          {/* Subtle Map Texture Background */}
          <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />

          {loading ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-8 w-8 text-white/30 animate-spin" />
            </div>
          ) : hasActiveEmergency ? (
            <div className="relative z-10 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]"></span>
                  </div>
                  <span className="text-white font-bold text-lg">Dispatched</span>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-red-500 text-xs font-bold uppercase tracking-wider">
                  {latestEmergency.emergency_type}
                </div>
              </div>
              
              <div className="bg-[#0A0D14]/60 rounded-2xl p-4 border border-white/5">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-white/40 uppercase font-semibold mb-1">ETA</p>
                    <p className="text-2xl font-black text-white">6 Mins</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40 uppercase font-semibold mb-1">Distance</p>
                    <p className="text-lg font-bold text-white/80">2.4 km</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 z-10">
              <Shield className="h-10 w-10 text-white/20 mb-3" />
              <p className="text-white/80 font-bold text-lg">System Ready</p>
              <p className="text-white/40 text-sm mt-1">No active emergencies.</p>
            </div>
          )}
        </div>
      </motion.div>

      <div className="flex-1" />

      {/* 2. Glassmorphic 2x2 Grid (Bottom 40%) */}
      <motion.div variants={itemVariants} className="space-y-3 mt-auto">
        <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider px-1">Quick Request</h2>
        
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "ambulance", label: "Ambulance", icon: Ambulance, color: "text-red-500", bg: "bg-red-500/10" },
            { id: "towing", label: "Tow Truck", icon: Car, color: "text-blue-500", bg: "bg-blue-500/10" },
            { id: "mechanic", label: "Mechanic", icon: Wrench, color: "text-yellow-500", bg: "bg-yellow-500/10" },
            { id: "police", label: "Police", icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10" },
          ].map((item) => (
            <Link 
              key={item.id}
              href={`/request?type=${item.id}`} 
              className="flex flex-col items-center justify-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl min-h-[120px] active:scale-95 transition-all shadow-lg overflow-hidden relative"
            >
              {/* Highlight gradient on active/hover could be added here */}
              <div className={`h-14 w-14 rounded-full ${item.bg} flex items-center justify-center border border-white/5`}>
                <item.icon className={`h-7 w-7 ${item.color}`} />
              </div>
              <span className="font-bold text-white text-sm tracking-wide">{item.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 3. Swipe to SOS Slider */}
      <motion.div variants={itemVariants} className="pt-4 pb-2">
        <SwipeToSOS />
      </motion.div>
      
    </motion.div>
  );
}
