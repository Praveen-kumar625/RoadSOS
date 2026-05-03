"use client";

/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * File: apps/web-client-roadsos/src/features/OfflineDataSync/OfflineDataSync.jsx
 */
import * as React from "react";
import { WifiOff } from "lucide-react";

export function OfflineDataSync() {
  const [isOffline, setIsOffline] = React.useState(false);

  React.useEffect(() => {
    // Determine initial state
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div 
      role="alert"
      aria-live="assertive"
      className="fixed top-0 left-0 right-0 z-[100] bg-orange-500 text-white px-4 py-3 shadow-lg flex items-center justify-between border-b border-orange-400 animate-in slide-in-from-top"
    >
      <div className="flex items-center gap-3 max-w-md mx-auto w-full">
        <div className="p-2 bg-black/20 rounded-full shrink-0">
          <WifiOff className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-wide">You are currently offline</span>
          <span className="text-xs text-white/90">SOS requests will be routed via SMS automatically.</span>
        </div>
      </div>
    </div>
  );
}
