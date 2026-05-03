"use client";

/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * File: src/pages/OnboardingPage/ui/Page.jsx
 * Same-to-Same Implementation of Onboarding Screen
 */

import * as React from "react"
import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { ArrowRight, ShieldCheck, Zap, Globe2 } from "lucide-react"

export function OnboardingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-white p-6 sm:p-8 overflow-y-auto overflow-x-hidden">
      <div className="flex-1 flex flex-col items-center justify-center space-y-10 sm:space-y-16 max-w-sm mx-auto w-full py-8">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
             <div className="absolute inset-0 bg-primary/30 blur-[40px] rounded-full" />
             <div className="relative h-24 w-24 flex items-center justify-center">
                {/* Shield Icon Replacement to match reference */}
                <div className="flex flex-col items-center justify-center relative">
                   {/* Wifi waves */}
                   <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-6">
                     <path d="M12 18C19 13 29 13 36 18" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
                     <path d="M6 12C16 4 32 4 42 12" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
                     <path d="M0 6C12 -3 36 -3 48 6" stroke="#EF4444" strokeWidth="3" strokeLinecap="round"/>
                   </svg>
                   {/* Shield */}
                   <svg width="48" height="56" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                     <path d="M24 0L48 10.5V26.5C48 40.5 37.5 53 24 56C10.5 53 0 40.5 0 26.5V10.5L24 0Z" fill="#1C1C1E" stroke="#EF4444" strokeWidth="2"/>
                     {/* Cross */}
                     <path d="M24 16V40M12 28H36" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round"/>
                   </svg>
                </div>
             </div>
          </div>
          <div className="text-center space-y-1 mt-4">
            <h1 className="text-4xl font-bold tracking-tight">Road<span className="text-primary">SOS</span></h1>
            <p className="text-sm text-white/70 font-medium tracking-wide">Help. Anytime. Anywhere.</p>
          </div>
        </div>

        {/* High-Fidelity Ambulance Image */}
        <div className="relative w-full aspect-[4/3] flex items-center justify-center">
           <div className="absolute w-full h-full bg-primary/20 blur-[80px] rounded-full scale-150 opacity-40" />
           <img 
            src="https://img.freepik.com/premium-photo/ambulance-car-futuristic-city-neon-lights-generative-ai_834602-5360.jpg" 
            alt="High Quality Ambulance"
            className="relative w-full h-full object-cover rounded-2xl drop-shadow-[0_20px_40px_rgba(239,68,68,0.3)] mask-image:linear-gradient(to_bottom,white_60%,transparent_100%)]"
            style={{ WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)' }}
            onError={(e) => { e.target.src = "https://img.freepik.com/premium-photo/modern-ambulance-vehicle-ready-emergency-responding-white-background-generative-ai_103070-1365.jpg" }}
           />
        </div>

        {/* Feature Icons Row */}
        <div className="grid grid-cols-3 gap-4 w-full pt-4">
           <div className="flex flex-col items-center gap-2 text-center">
              <div className="h-10 w-10 flex items-center justify-center mb-1">
                <Globe2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-white">Offline First</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Works even without internet connection</span>
           </div>
           <div className="flex flex-col items-center gap-2 text-center">
              <div className="h-10 w-10 flex items-center justify-center mb-1">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-white">Your Data, Safe</span>
              <span className="text-[10px] text-muted-foreground leading-tight">End to end encrypted & 100% secure</span>
           </div>
           <div className="flex flex-col items-center gap-2 text-center">
              <div className="h-10 w-10 flex items-center justify-center mb-1">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-white">Lightning Fast</span>
              <span className="text-[10px] text-muted-foreground leading-tight">One tap help with live tracking</span>
           </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="space-y-6 pb-10 max-w-sm mx-auto w-full">
        <Link href="/dashboard" className="block w-full group">
          <Button className="w-full h-[60px] rounded-full bg-gradient-to-r from-white/10 to-primary/40 border border-primary/50 text-white text-lg font-medium gap-4 justify-between px-2 pl-8 shadow-sos-btn hover:from-white/10 hover:to-primary/60">
            Get Started
            <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center transition-transform group-active:translate-x-1">
               <ArrowRight className="h-6 w-6 text-white" />
            </div>
          </Button>
        </Link>
        
        <p className="text-center text-sm text-white/70">
          Already have an account? <span className="text-primary font-medium cursor-pointer hover:text-primary/80 transition-all">Sign in</span>
        </p>
      </div>
    </div>
  )
}
