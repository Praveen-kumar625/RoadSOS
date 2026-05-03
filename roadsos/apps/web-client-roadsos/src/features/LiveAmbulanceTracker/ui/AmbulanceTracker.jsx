"use client";

/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * File: src/features/LiveAmbulanceTracker/ui/AmbulanceTracker.jsx
 * Same-to-Same Implementation of Tracking Screen
 */

import * as React from "react"
import { AmbulanceCard } from "@/entities/ambulance/ui/AmbulanceCard"
import { DriverInfo } from "@/entities/driver/ui/DriverInfo"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"
import { Share2, Navigation, MapPin } from "lucide-react"

export function AmbulanceTracker() {
  const mockAmbulance = { id: "AS-247", distance: "2.4", eta: "6" }
  const mockDriver = { name: "Ravi Kumar", rating: "4.8", experience: "10" }

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Map View Section */}
      <div className="relative flex-1 min-h-[350px] rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
        {/* Map Placeholder */}
        <div className="absolute inset-0 bg-[#0A0D14] bg-[url('https://images.unsplash.com/photo-1518558997970-4fdc6ed60742?auto=format&fit=crop&w=800&q=80')] bg-cover opacity-40 mix-blend-luminosity scale-110" />
        
        {/* Mock Path Drawing */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M20 85 C 30 70, 70 30, 80 15" 
            fill="none" 
            stroke="#EF4444" 
            strokeWidth="3" 
            strokeLinecap="round"
            className="animate-route"
          />
        </svg>

        {/* User Location Pulse */}
        <div className="absolute left-[20%] bottom-[15%] -translate-x-1/2 translate-y-1/2">
          <div className="relative">
            <div className="absolute inset-0 h-10 w-10 bg-secondary/30 blur-xl animate-ping" />
            <div className="relative h-5 w-5 rounded-full bg-secondary border-[3px] border-white shadow-neon-blue" />
          </div>
        </div>

        {/* Ambulance Location Pulse */}
        <div className="absolute right-[20%] top-[15%] translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute inset-0 h-12 w-12 bg-primary/30 blur-xl animate-ping" />
            <div className="relative h-6 w-6 rounded-full bg-primary border-[3px] border-white shadow-neon-red flex items-center justify-center">
               <Navigation className="h-3 w-3 text-white fill-current rotate-45" />
            </div>
          </div>
        </div>

        {/* Top Floating Status */}
        <div className="absolute top-6 left-6 right-6">
           <AmbulanceCard ambulance={mockAmbulance} className="w-full border-white/5" />
        </div>

        {/* Map Control Buttons */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
           {[Navigation, MapPin, Share2].map((Icon, i) => (
             <button key={i} className="h-12 w-12 rounded-2xl bg-[#1C1C1E]/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/70 hover:text-white shadow-2xl">
                <Icon className="h-6 w-6" />
             </button>
           ))}
        </div>
      </div>

      {/* Details Bottom Sheet */}
      <div className="space-y-6">
        <Card className="glass-card border-white/5">
          <CardContent className="p-8 space-y-8">
            <DriverInfo driver={mockDriver} />
            
            <div className="h-[1px] w-full bg-white/5" />
            
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-white">Ambulance Details</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center">
                    <img src="https://img.freepik.com/premium-photo/modern-ambulance-vehicle-ready-emergency-responding-white-background-generative-ai_103070-1365.jpg" className="w-8 h-8 object-contain" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70 mb-0.5">Model</p>
                    <p className="text-sm font-medium text-white">Force Traveller</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/70 mb-0.5">Reg. No.</p>
                  <p className="text-sm font-medium text-white">HR 55 AB 1234</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 text-base font-semibold gap-3 bg-transparent hover:bg-white/5">
          <Share2 className="h-5 w-5" /> Share Live Location
        </Button>
      </div>
    </div>
  )
}
