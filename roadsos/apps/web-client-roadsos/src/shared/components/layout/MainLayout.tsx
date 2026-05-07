"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, X, AlertTriangle, MapPin, 
  ShieldAlert, User, Home, Bell, 
  History, Settings, PhoneCall
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu gracefully on route transitions
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when the off-canvas menu is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMenu = () => setIsMobileMenuOpen((prev) => !prev);

  // Core navigation mappings contextual to RoadSOS
  const navItems = [
    { name: "Emergency Dashboard", href: "/dashboard", icon: Home },
    { name: "Live Tracking", href: "/tracking", icon: MapPin },
    { name: "Responder Hub", href: "/driver", icon: ShieldAlert },
    { name: "Incident History", href: "/history", icon: History },
    { name: "Sign In", href: "/auth", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col md:flex-row font-sans selection:bg-red-500/30">
      
      {/* ======================================================================
          1. FIXED TOP HEADER (Mobile & Desktop)
          ====================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 md:h-20 w-full items-center justify-between border-b border-white/10 bg-[#0A0D14]/90 px-4 backdrop-blur-md md:pl-72 md:pr-8">
        
        {/* Mobile Left: Logo */}
        <div className="flex items-center gap-3 md:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <ShieldAlert className="h-6 w-6" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold tracking-wide">RoadSOS</span>
        </div>

        {/* Desktop Left: Contextual Page Title */}
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-white/90 tracking-wide">
            {navItems.find((item) => item.href === pathname)?.name || "Emergency Services"}
          </h1>
        </div>

        {/* Right Actions: Notifications & Mobile Hamburger */}
        <div className="flex items-center gap-2">
          <button 
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"
            aria-label="View recent alerts"
          >
            <Bell className="h-6 w-6 text-white/80" />
          </button>
          
          <button 
            type="button"
            onClick={toggleMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 transition-colors md:hidden"
          >
            <Menu className="h-6 w-6 text-white/90" />
          </button>

          {/* Desktop User Profile */}
          <button className="hidden md:flex h-11 w-11 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 ml-2">
            <User className="h-5 w-5 text-white/80" />
          </button>
        </div>
      </header>

      {/* ======================================================================
          2. PERSISTENT LEFT SIDEBAR (Desktop Only)
          ====================================================================== */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-white/10 bg-[#1C1C1E] md:flex">
        <div className="flex h-20 items-center gap-3 px-6 border-b border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/20">
            <ShieldAlert className="h-6 w-6" aria-hidden="true" />
          </div>
          <span className="text-2xl font-bold tracking-wide">RoadSOS</span>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-white/40">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex h-12 items-center gap-3 rounded-xl px-4 transition-all ${
                  isActive 
                    ? "bg-red-500/10 text-red-500 font-semibold border border-red-500/20" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-red-500" : "text-white/50"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Emergency Call CTA */}
        <div className="p-4">
          <a 
            href="tel:911" 
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-red-500 font-bold text-white shadow-lg shadow-red-500/30 transition-transform hover:scale-[1.02] active:scale-95"
          >
            <PhoneCall className="h-5 w-5" />
            Call Emergency (911)
          </a>
        </div>
      </aside>

      {/* ======================================================================
          3. OFF-CANVAS RIGHT SIDEBAR (Mobile Only)
          ====================================================================== */}
      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
      
      {/* Drawer */}
      <div 
        id="mobile-menu"
        className={`fixed right-0 top-0 z-50 flex h-screen w-4/5 max-w-sm flex-col bg-[#1C1C1E] shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <span className="font-bold text-lg text-white/90">Menu</span>
          <button 
            type="button"
            onClick={toggleMenu}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20"
            aria-label="Close menu"
          >
            <X className="h-6 w-6 text-white/90" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex h-14 items-center gap-4 rounded-2xl px-4 transition-all ${
                  isActive 
                    ? "bg-red-500/10 text-red-500 font-semibold border border-red-500/20" 
                    : "text-white/70 active:bg-white/5"
                }`}
              >
                <Icon className={`h-6 w-6 ${isActive ? "text-red-500" : "text-white/50"}`} />
                <span className="text-lg">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* User Profile Hook in Mobile */}
        <div className="border-t border-white/10 p-4">
          <Link href="/profile" className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 active:bg-white/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <User className="h-6 w-6 text-white/80" />
            </div>
            <div>
              <div className="font-medium text-white/90">John Doe</div>
              <div className="text-sm text-white/50">View Profile</div>
            </div>
          </Link>
        </div>
      </div>

      {/* ======================================================================
          4. MAIN CONTENT AREA
          ====================================================================== */}
      <main className="mt-16 mb-20 flex-1 md:ml-64 md:mt-20 md:mb-0">
        <div className="mx-auto max-w-5xl p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* ======================================================================
          5. BOTTOM FIXED ACTION BAR (Mobile Only)
          ====================================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex h-20 items-center justify-around border-t border-white/10 bg-[#0A0D14]/90 px-2 backdrop-blur-md pb-safe md:hidden">
        
        <Link 
          href="/dashboard" 
          className="flex flex-col items-center justify-center w-16 h-full gap-1 active:scale-95 transition-transform"
          aria-label="Navigate to Dashboard"
        >
          <Home className={`h-6 w-6 ${pathname === '/dashboard' ? 'text-red-500' : 'text-white/50'}`} />
          <span className={`text-[10px] font-medium ${pathname === '/dashboard' ? 'text-white' : 'text-white/50'}`}>Home</span>
        </Link>

        {/* Central Prominent SOS Button */}
        <div className="relative -top-6">
          <Link 
            href="/request" 
            className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-transform active:scale-90"
            aria-label="Initiate new SOS Request"
          >
            <AlertTriangle className="h-8 w-8" />
          </Link>
        </div>

        <Link 
          href="/tracking" 
          className="flex flex-col items-center justify-center w-16 h-full gap-1 active:scale-95 transition-transform"
          aria-label="Navigate to Live Tracking"
        >
          <MapPin className={`h-6 w-6 ${pathname === '/tracking' ? 'text-red-500' : 'text-white/50'}`} />
          <span className={`text-[10px] font-medium ${pathname === '/tracking' ? 'text-white' : 'text-white/50'}`}>Track</span>
        </Link>
        
      </div>
    </div>
  );
}
