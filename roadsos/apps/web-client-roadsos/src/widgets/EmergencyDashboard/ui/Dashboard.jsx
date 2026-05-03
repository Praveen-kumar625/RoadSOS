"use client";

/**
 * Team Name: Divine coder
 * Team Lead: Praveen kumar
 * File: src/widgets/EmergencyDashboard/ui/Dashboard.jsx
 * Same-to-Same Implementation of Dashboard Screen
 */

import * as React from "react"
import { Menu, Bell, AlertTriangle, ChevronRight, Maximize2 } from "lucide-react"
import { Card, CardContent } from "@/shared/ui/card"
import { ActionGrid } from "./ActionGrid"
import { BottomNav } from "./BottomNav"

export function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-white pb-32 overflow-x-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between p-6 pt-10">
        <button className="h-12 w-12 icon-container">
          <Menu className="h-7 w-7 text-white" />
        </button>
        <h1 className="text-xl font-bold tracking-tight">Road<span className="text-primary">SOS</span></h1>
        <button className="relative h-12 w-12 icon-container">
          <Bell className="h-7 w-7 text-white" />
          <span className="absolute top-3.5 right-3.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-[#0A0D14]" />
        </button>
      </header>

      <main className="flex-1 px-6 space-y-10">
        
        {/* Emergency Alert Banner */}
        <div className="bg-emergency-gradient p-5 rounded-[32px] flex items-center gap-5 shadow-sos-btn cursor-pointer transition-transform active:scale-[0.98]">
          <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-8 w-8 text-white stroke-[2.5]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white tracking-wide">Emergency Alert</h3>
            <p className="text-[11px] text-white/90 font-medium leading-tight">
              Heavy traffic on NH-44 near Sector 62. Ambulance response may be delayed.
            </p>
          </div>
          <ChevronRight className="h-6 w-6 text-white/60 shrink-0" />
        </div>

        {/* Live Status Widget */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-base font-semibold text-white">Live Status</h2>
            <button className="text-sm font-medium text-primary">View All</button>
          </div>
          
          <Card className="relative glass-card border-none overflow-hidden h-[220px]">
            <CardContent className="p-0 h-full">
              {/* Map Preview with specific dark style */}
              <div className="h-full w-full bg-[#1C1C1E] bg-[url('https://images.unsplash.com/photo-1518558997970-4fdc6ed60742?auto=format&fit=crop&w=800&q=80')] bg-cover opacity-60 mix-blend-luminosity" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="bg-[#1C1C1E]/90 backdrop-blur-xl rounded-[24px] p-4 border border-white/10 shadow-2xl">
                    <p className="text-xs text-white/70 mb-1">Nearest Ambulance</p>
                    <p className="text-2xl font-bold text-[#4ADE80]">2.4 km away</p>
                    <p className="text-sm font-medium text-white/70 mt-1">ETA 6 mins</p>
                  </div>
                  <button className="h-12 w-12 rounded-2xl bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-xl">
                    <Maximize2 className="h-6 w-6 text-white" />
                  </button>
                </div>
                
                {/* Visual Route dots exactly like reference */}
                <div className="flex items-center gap-3 px-5 py-3 bg-black/40 backdrop-blur-md rounded-full self-start border border-white/5">
                   <div className="relative">
                      <div className="absolute inset-0 bg-secondary/40 blur-md rounded-full" />
                      <div className="relative w-2.5 h-2.5 rounded-full bg-secondary shadow-neon-blue" />
                   </div>
                   <div className="flex gap-1.5 opacity-40">
                      {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white" />)}
                   </div>
                   <div className="relative">
                      <div className="absolute inset-0 bg-primary/40 blur-md rounded-full" />
                      <div className="relative w-2.5 h-2.5 rounded-full bg-primary shadow-neon-red" />
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Grid */}
        <div className="space-y-6">
          <h2 className="text-base font-semibold text-white px-2">How can we help?</h2>
          <ActionGrid />
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
