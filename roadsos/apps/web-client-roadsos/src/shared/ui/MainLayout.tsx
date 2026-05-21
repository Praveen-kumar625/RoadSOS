"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, MapPin, Bell, User, History, Settings, LogOut, Menu, X, ShieldAlert, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/shared/api/supabase";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const pathname = usePathname();

  useEffect(() => {
    setIsBottomSheetOpen(false);
  }, [pathname]);

  // Fetch Auth Session
  useEffect(() => {
    if (!supabase) return;

    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.full_name) {
        // Grab first name
        const firstName = session.user.user_metadata.full_name.split(" ")[0];
        setUserName(firstName);
      }
    };
    
    fetchUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.user_metadata?.full_name) {
        setUserName(session.user.user_metadata.full_name.split(" ")[0]);
      } else {
        setUserName("User");
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isBottomSheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isBottomSheetOpen]);

  const toggleBottomSheet = () => setIsBottomSheetOpen((prev) => !prev);
  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };

  const isAuthPage = pathname === '/auth';

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col font-sans selection:bg-red-500/30 overflow-x-hidden">
      
      {/* ======================================================================
          1. MINIMAL GLASSMORPHIC HEADER (Mobile & Desktop)
          ====================================================================== */}
      {!isAuthPage && (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-4 pt-safe-top bg-[#0A0D14]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] text-red-500 uppercase tracking-[0.2em] font-black">RoadSOS</span>
            <span className="text-sm font-bold text-white/90 tracking-wide">Stay Safe, {userName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all border border-white/10 relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-white/70" />
              <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            </button>

            <button 
              onClick={toggleBottomSheet}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all border border-white/10"
              aria-label="Menu"
            >
              <AnimatePresence mode="wait">
                {isBottomSheetOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X className="h-5 w-5 text-white/70" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu className="h-5 w-5 text-white/70" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </header>
      )}

      {/* ======================================================================
          2. MAIN CONTENT AREA
          ====================================================================== */}
      <main className={`flex-1 flex flex-col ${!isAuthPage ? "mt-16 pb-24" : ""} pb-safe-bottom`}>
        <div className="w-full max-w-md mx-auto h-full flex-1">
          {children}
        </div>
      </main>

      {/* ======================================================================
          3. SOS-ORIENTED BOTTOM NAVIGATION
          ====================================================================== */}
      {!isAuthPage && (
        <div className="fixed bottom-0 left-0 right-0 z-40 pb-safe-bottom px-6 mb-4">
          <div className="max-w-md mx-auto relative flex items-center justify-between bg-[#1C1C1E]/60 backdrop-blur-3xl border border-white/10 rounded-[32px] h-20 px-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            
            {/* Nav Items */}
            <Link 
              href="/dashboard" 
              className="flex-1 flex flex-col items-center justify-center gap-1 active:scale-90 transition-all"
            >
              <Home className={`h-5 w-5 ${pathname === '/dashboard' ? 'text-white' : 'text-white/30'}`} />
              <span className={`text-[9px] font-black uppercase tracking-widest ${pathname === '/dashboard' ? 'text-white' : 'text-white/30'}`}>Home</span>
            </Link>

            {/* CENTRAL SOS TRIGGER */}
            <div className="relative -top-8 px-2">
              <Link href="/request?type=ambulance" className="block">
                <div className="h-20 w-20 rounded-full bg-red-600 flex items-center justify-center shadow-[0_10px_30px_rgba(220,38,38,0.5)] border-4 border-[#0A0D14] active:scale-90 transition-all group">
                   <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-20" />
                   <AlertTriangle className="h-10 w-10 text-white stroke-[2.5] group-hover:rotate-12 transition-transform" />
                </div>
              </Link>
            </div>

            <Link 
              href="/tracking" 
              className="flex-1 flex flex-col items-center justify-center gap-1 active:scale-90 transition-all"
            >
              <MapPin className={`h-5 w-5 ${pathname === '/tracking' ? 'text-white' : 'text-white/30'}`} />
              <span className={`text-[9px] font-black uppercase tracking-widest ${pathname === '/tracking' ? 'text-white' : 'text-white/30'}`}>Track</span>
            </Link>

          </div>
        </div>
      )}

      {/* ======================================================================
          4. PREMIUM SIDEBAR (Menu Navigation)
          ====================================================================== */}
      <AnimatePresence mode="wait">
        {isBottomSheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleBottomSheet}
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
            />
            
            {/* Sidebar */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-[80%] max-w-[320px] bg-[#0A0D14] border-l border-white/5 shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex flex-col">
                  <span className="text-[10px] text-red-500 font-black tracking-[0.3em] uppercase">Security</span>
                  <span className="text-2xl font-black italic tracking-tighter uppercase text-white">Menu</span>
                </div>
                <button onClick={toggleBottomSheet} className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <X className="h-5 w-5 text-white/50" />
                </button>
              </div>

              <div className="flex-1 space-y-2">
                <Link href="/profile" onClick={toggleBottomSheet} className="flex items-center gap-4 p-5 rounded-3xl bg-white/[0.03] border border-white/5 mb-6 group active:scale-95 transition-all">
                  <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                    <User className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-white text-sm uppercase tracking-wider">{userName}</h3>
                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Verified User</p>
                  </div>
                </Link>

                <div className="space-y-1">
                  {[
                    { href: "/driver", icon: ShieldAlert, label: "Responder Hub", color: "text-blue-500" },
                    { href: "/history", icon: History, label: "Incident History", color: "text-emerald-500" },
                    { href: "/settings", icon: Settings, label: "System Config", color: "text-purple-500" },
                  ].map((item) => (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      onClick={toggleBottomSheet}
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group"
                    >
                      <item.icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform`} />
                      <span className="font-black text-white/70 text-xs uppercase tracking-[0.1em] group-hover:text-white">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-auto space-y-6">
                <div className="h-[1px] w-full bg-white/5" />
                <button 
                  onClick={() => { handleSignOut(); toggleBottomSheet(); }} 
                  className="w-full flex items-center justify-between p-6 rounded-[24px] bg-red-500/5 border border-red-500/10 text-red-500 active:scale-95 transition-all"
                >
                  <span className="font-black uppercase italic tracking-tighter text-lg">Sign Out</span>
                  <LogOut className="h-6 w-6" />
                </button>
                <div className="text-center">
                  <p className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">RoadSOS v2.4.0-Hardened</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
