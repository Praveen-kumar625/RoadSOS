"use client";

import React, { useEffect, useState } from "react";
import { Navigation, Clock, CheckCircle, AlertTriangle, Loader2, BellRing } from "lucide-react";
import { emergencyService } from "@/shared/api/emergencyService";
import { supabase } from "@/shared/api/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/shared/hooks/useNotifications";

export function DriverDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { permission, requestPermission, triggerLocalNotification } = useNotifications();

  useEffect(() => {
    let interval;
    
    const fetchRequests = async () => {
      try {
        const reqs = await emergencyService.getActiveRequests();
        setRequests(reqs);
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
          { event: 'INSERT', schema: 'public', table: 'emergency_requests' },
          (payload) => {
            console.log('Realtime Emergency Update:', payload);
            
            // Trigger Push Notification for new emergency
            if (payload.new && payload.new.status === 'pending') {
              triggerLocalNotification("🚨 URGENT: New Emergency Request", {
                body: `${payload.new.emergency_type.toUpperCase()} required at ${payload.new.location}`,
                data: { url: "/driver" }
              });
            }

            fetchRequests(); // Re-fetch or manually mutate state
          }
        )
        .subscribe();
    }

    // 2. Fallback Polling (for local mock storage or if sockets fail)
    interval = setInterval(fetchRequests, 5000);

    return () => {
      clearInterval(interval);
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const handleAccept = async (id) => {
    // Optimistic UI update
    setRequests(prev => prev.filter(req => req.id !== id));
    
    // If we have Supabase, actually update the status
    if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      await supabase
        .from('emergency_requests')
        .update({ status: 'accepted' })
        .eq('id', id);
    } else {
      // Mock update for local storage
      const existing = JSON.parse(localStorage.getItem('mock_emergencies') || '[]');
      const updated = existing.map(req => req.id === id ? { ...req, status: 'accepted' } : req);
      localStorage.setItem('mock_emergencies', JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-6 pb-20 p-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Responder Hub</h1>
          <p className="text-white/60 text-sm">You are currently online and available.</p>
        </div>
        <div className="flex items-center gap-3">
          {permission !== 'granted' && (
            <button 
              onClick={requestPermission}
              className="h-10 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-full flex items-center gap-2 text-sm font-bold border border-red-500/30 transition-colors"
            >
              <BellRing className="h-4 w-4" />
              <span className="hidden sm:inline">Enable Alerts</span>
            </button>
          )}
          <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
            <div className="h-4 w-4 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-white/50 text-sm uppercase tracking-wider font-semibold mb-2">
        <AlertTriangle className="h-4 w-4" />
        Pending Emergencies ({requests.length})
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border border-white/5 bg-[#1C1C1E] rounded-3xl p-10 flex flex-col items-center justify-center text-center"
        >
          <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-white/20" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No pending requests</h2>
          <p className="text-white/50 text-sm">Stay alert. New requests will appear here immediately.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {requests.map((req) => (
              <motion.div 
                key={req.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#1C1C1E] border border-red-500/30 rounded-3xl p-5 shadow-[0_10px_30px_rgba(239,68,68,0.1)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4">
                  <span className="bg-red-500/20 text-red-500 text-xs font-bold px-3 py-1 rounded-full border border-red-500/30">
                    URGENT
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">
                  {req.emergency_type.toUpperCase()}
                </h3>
                <p className="text-white/70 text-sm mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  {req.location.substring(0, 50)}...
                </p>
                
                <div className="bg-[#0A0D14] rounded-xl p-3 border border-white/5 mb-4">
                  <p className="text-white/80 text-sm italic">"{req.details}"</p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => handleAccept(req.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <Navigation className="h-5 w-5" />
                    Accept & Route
                  </button>
                  <button className="h-[48px] w-[48px] bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                    <Clock className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
