"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, MapPin, Bell, User, History, Settings, LogOut, Menu, X, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsBottomSheetOpen(false);
  }, [pathname]);

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

  // Exclude auth from MainLayout wrapping if needed, but for now we keep it simple.
  const isAuthPage = pathname === '/auth';

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col font-sans selection:bg-red-500/30 overflow-x-hidden">
      
      {/* ======================================================================
          1. MINIMAL GLASSMORPHIC HEADER (Mobile & Desktop)
          ====================================================================== */}
      {!isAuthPage && (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-4 pt-safe-top bg-[#0A0D14]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex flex-col">
            <span className="text-xs text-white/50 uppercase tracking-wider font-semibold">RoadSOS</span>
            <span className="text-lg font-bold text-white tracking-wide">Stay Safe, User</span>
          </div>

          <button 
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition-all border border-white/10 relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-white/80" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          </button>
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
          3. BOTTOM NAVIGATION BAR (Mobile First)
          ====================================================================== */}
      {!isAuthPage && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0D14]/90 backdrop-blur-2xl border-t border-white/10 pb-safe-bottom">
          <div className="flex h-20 items-center justify-around px-4 max-w-md mx-auto">
            <Link 
              href="/dashboard" 
              className="flex flex-col items-center justify-center w-16 h-full gap-1.5 active:scale-95 transition-transform"
            >
              <Home className={`h-6 w-6 ${pathname === '/dashboard' ? 'text-red-500' : 'text-white/40'}`} />
              <span className={`text-[10px] font-bold tracking-wide ${pathname === '/dashboard' ? 'text-red-500' : 'text-white/40'}`}>Home</span>
            </Link>

            <Link 
              href="/tracking" 
              className="flex flex-col items-center justify-center w-16 h-full gap-1.5 active:scale-95 transition-transform"
            >
              <MapPin className={`h-6 w-6 ${pathname === '/tracking' ? 'text-blue-500' : 'text-white/40'}`} />
              <span className={`text-[10px] font-bold tracking-wide ${pathname === '/tracking' ? 'text-blue-500' : 'text-white/40'}`}>Track</span>
            </Link>

            <button 
              onClick={toggleBottomSheet}
              className="flex flex-col items-center justify-center w-16 h-full gap-1.5 active:scale-95 transition-transform"
            >
              <Menu className={`h-6 w-6 ${isBottomSheetOpen ? 'text-white' : 'text-white/40'}`} />
              <span className={`text-[10px] font-bold tracking-wide ${isBottomSheetOpen ? 'text-white' : 'text-white/40'}`}>Menu</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================================
          4. BOTTOM SHEET (Menu Navigation)
          ====================================================================== */}
      <AnimatePresence>
        {isBottomSheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleBottomSheet}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Sheet */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#1C1C1E] rounded-t-3xl border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] pb-safe-bottom"
            >
              <div className="w-full flex justify-center py-4" onClick={toggleBottomSheet}>
                <div className="w-12 h-1.5 bg-white/20 rounded-full" />
              </div>
              
              <div className="px-6 pb-8 space-y-2 max-w-md mx-auto">
                <Link href="/profile" className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 active:bg-white/10 transition-colors border border-white/5 mb-6">
                  <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                    <User className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">My Profile</h3>
                    <p className="text-white/50 text-sm">Manage personal info</p>
                  </div>
                </Link>

                <Link href="/driver" className="flex items-center gap-4 p-4 rounded-2xl active:bg-white/5 transition-colors">
                  <ShieldAlert className="h-6 w-6 text-white/50" />
                  <span className="font-bold text-white/90 text-lg">Responder Hub</span>
                </Link>

                <Link href="/history" className="flex items-center gap-4 p-4 rounded-2xl active:bg-white/5 transition-colors">
                  <History className="h-6 w-6 text-white/50" />
                  <span className="font-bold text-white/90 text-lg">Incident History</span>
                </Link>

                <Link href="/settings" className="flex items-center gap-4 p-4 rounded-2xl active:bg-white/5 transition-colors">
                  <Settings className="h-6 w-6 text-white/50" />
                  <span className="font-bold text-white/90 text-lg">App Settings</span>
                </Link>

                <div className="h-[1px] w-full bg-white/10 my-4" />

                <Link href="/auth" className="flex items-center gap-4 p-4 rounded-2xl active:bg-white/5 transition-colors text-red-500">
                  <LogOut className="h-6 w-6" />
                  <span className="font-bold text-lg">Sign Out</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
