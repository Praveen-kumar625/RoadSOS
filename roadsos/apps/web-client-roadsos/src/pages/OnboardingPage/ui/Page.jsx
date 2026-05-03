"use client";

import * as React from "react"
import { Button } from "@/shared/ui/button"
import { ArrowRight, Shield, Zap, WifiOff } from "lucide-react"

export function OnboardingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white p-8">
      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
             <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
             <div className="relative h-24 w-24 rounded-3xl bg-primary flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.4)]">
                <div className="text-4xl font-black italic tracking-tighter text-white">SOS</div>
             </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-black tracking-tighter italic">Road<span className="text-primary">SOS</span></h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">Help. Anytime. Anywhere.</p>
          </div>
        </div>

        {/* Hero Illustration Placeholder */}
        <div className="relative w-full aspect-square max-w-[280px]">
           <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl opacity-50" />
           <img 
            src="https://img.freepik.com/free-vector/modern-ambulance-concept-illustration_114360-19275.jpg" 
            alt="Ambulance"
            className="relative w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(239,68,68,0.3)] contrast-125 saturate-150"
           />
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 w-full">
           <div className="flex flex-col items-center gap-2 text-center">
              <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <WifiOff className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Offline First</span>
           </div>
           <div className="flex flex-col items-center gap-2 text-center">
              <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Data Safe</span>
           </div>
           <div className="flex flex-col items-center gap-2 text-center">
              <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Lightning Fast</span>
           </div>
        </div>
      </div>

      <div className="space-y-6 pb-8">
        <Button variant="emergency" size="xl" className="w-full h-16 text-lg font-bold gap-2">
          Get Started <ArrowRight className="h-5 w-5" />
        </Button>
        
        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <span className="text-primary font-bold cursor-pointer">Sign in</span>
        </p>
      </div>
    </div>
  )
}
