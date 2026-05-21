"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { AlertTriangle, Ambulance, Wrench, Shield, Car, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { emergencyService } from "@/shared/api/emergencyService";
import { supabase } from "@/shared/api/supabase";
import { motion } from "framer-motion";

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const QUICK_REQUEST_ITEMS = [
  { id: "ambulance", label: "Ambulance", icon: Ambulance, color: "text-red-500", bg: "bg-red-500/10" },
  { id: "towing", label: "Tow Truck", icon: Car, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "mechanic", label: "Mechanic", icon: Wrench, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { id: "police", label: "Police", icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10" },
];

// -----------------------------------------------------------------------------
// SWIPE TO SOS COMPONENT
// -----------------------------------------------------------------------------
const SwipeToSOS = React.memo(() => {
  const router = useRouter();
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  const triggerEmergency = useCallback(() => {
    setIsUnlocked(true);
    setTimeout(() => {
      router.push("/request?type=ambulance");
    }, 300);
  }, [router]);

  const handleDragEnd = useCallback((event, info) => {
    if (info.offset.x > 180) {
      triggerEmergency();
    }
  }, [triggerEmergency]);

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
});
SwipeToSOS.displayName = "SwipeToSOS";

// -----------------------------------------------------------------------------
// DASHBOARD VIEW
// -----------------------------------------------------------------------------
export function Dashboard() {
  const [activeRequests, setActiveRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      const reqs = await emergencyService.getActiveRequests();
      setActiveRequests(reqs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let interval;
    // Initial fetch
    fetchRequests();

    // 1. Subscribe to Supabase Realtime (WebSockets)
    let channel;
    if (supabase && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      channel = supabase
        .channel('public:emergency_requests')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'emergency_requests' },
          (payload) => {
            fetchRequests(); // Keep state synced with backend
          }
        )
        .subscribe();
    }

    // 2. Fallback Polling (for local storage or socket failure)
    interval = setInterval(fetchRequests, 10000);
    
    return () => {
      clearInterval(interval);
      if (supabase && channel) supabase.removeChannel(channel);
    };
  }, [fetchRequests]);

  const hasActiveEmergency = activeRequests.length > 0;
  const latestEmergency = activeRequests[0];

  return (
    <motion.div 
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="show"
      className="flex flex-col min-h-[calc(100vh-160px)] px-6 py-6 space-y-8"
    >
      
      {/* 1. Live Tracking Widget */}
      <motion.div variants={ITEM_VARIANTS} className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Deployment Status</h2>
          {hasActiveEmergency && (
            <Link href="/tracking" className="text-xs font-bold text-red-500 flex items-center gap-1 hover:text-red-400 transition-colors">
              Live Map <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
        
        <div className="relative overflow-hidden rounded-[32px] min-h-[180px] bg-[#1C1C1E]/40 backdrop-blur-2xl border border-white/5 shadow-2xl flex flex-col justify-center">
          
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-screen pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

          {loading ? (
            <div className="flex items-center justify-center p-6">
              <Loader2 className="h-8 w-8 text-white/20 animate-spin" />
            </div>
          ) : hasActiveEmergency ? (
            <div className="relative z-10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 shadow-[0_0_15px_rgba(239,68,68,1)]"></span>
                  </div>
                  <span className="text-white font-black text-xl tracking-tight uppercase italic">Active SOS</span>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest">
                  {latestEmergency.emergency_type}
                </div>
              </div>
              
              <div className="bg-[#0A0D14]/80 rounded-[24px] p-5 border border-white/5 shadow-inner">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Time to Arrival</p>
                    <p className="text-3xl font-black text-white italic">06:42</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Range</p>
                    <p className="text-xl font-bold text-white/80">2.4 km</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 z-10">
              <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white/20" />
              </div>
              <p className="text-white/90 font-black text-lg uppercase tracking-tight italic">System Nominal</p>
              <p className="text-white/30 text-xs mt-1 font-medium tracking-wide">No active deployment detected.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* 2. Glassmorphic 2x2 Grid */}
      <motion.div variants={ITEM_VARIANTS} className="space-y-4">
        <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] px-1">Network Services</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: "ambulance", label: "Ambulance", icon: Ambulance, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
            { id: "towing", label: "Tow Truck", icon: Car, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { id: "mechanic", label: "Mechanic", icon: Wrench, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
            { id: "police", label: "Police", icon: Shield, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
          ].map((item) => (
            <Link 
              key={item.id}
              href={`/request?type=${item.id}`} 
              className={`flex flex-col items-center justify-center gap-4 bg-white/[0.03] backdrop-blur-2xl border border-white/5 rounded-[32px] min-h-[140px] active:scale-95 transition-all shadow-xl group relative overflow-hidden`}
            >
              {/* Highlight Gradient on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              <div className={`h-16 w-16 rounded-[20px] ${item.bg} flex items-center justify-center border ${item.border} transition-transform group-hover:scale-110 duration-500`}>
                <item.icon className={`h-8 w-8 ${item.color}`} />
              </div>
              <span className="font-black text-white text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="flex-1 min-h-[20px]" />

      {/* 3. Swipe to SOS Slider */}
      <motion.div variants={ITEM_VARIANTS} className="pb-4">
        <SwipeToSOS />
      </motion.div>
      
    </motion.div>
  );
}
