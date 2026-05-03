import * as React from "react"
import { Menu, Bell, AlertTriangle, ChevronRight, Maximize2 } from "lucide-react"
import { Card, CardContent } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { ActionGrid } from "./ActionGrid"
import { BottomNav } from "./BottomNav"

export function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-emergency-bg text-white pb-32">
      {/* Top Header */}
      <header className="flex items-center justify-between p-6 pt-8">
        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-black tracking-tighter italic">Road<span className="text-primary">SOS</span></h1>
        <button className="relative h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10">
          <Bell className="h-6 w-6" />
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-primary border-2 border-[#0A0D14]" />
        </button>
      </header>

      <main className="flex-1 px-6 space-y-8">
        {/* Emergency Alert Banner */}
        <div className="emergency-gradient p-4 rounded-3xl flex items-center gap-4 shadow-lg neon-glow-red cursor-pointer">
          <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm">Emergency Alert</h3>
            <p className="text-[10px] text-white/80 line-clamp-2">
              Heavy traffic on NH-44 near Sector 62. Ambulance response may be delayed.
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-white/50 shrink-0" />
        </div>

        {/* Live Status Widget */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Live Status</h2>
            <button className="text-xs font-bold text-primary">View All</button>
          </div>
          
          <Card className="relative glass-card border-white/5 overflow-hidden">
            <CardContent className="p-0">
              {/* Map Preview Background */}
              <div className="h-48 w-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/77.391,28.535,14,0/400x200?access_token=pk.mock')] bg-cover opacity-60" />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className="bg-emergency-bg/80 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Nearest Ambulance</p>
                    <p className="text-2xl font-black text-secondary">2.4 km away</p>
                    <p className="text-xs font-medium text-white/60">ETA 6 mins</p>
                  </div>
                  <button className="h-10 w-10 rounded-xl bg-emergency-bg/80 backdrop-blur-md border border-white/10 flex items-center justify-center">
                    <Maximize2 className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Visual Route indicator in map */}
                <div className="flex items-center gap-2 px-4 py-2 bg-emergency-bg/40 backdrop-blur-sm rounded-full self-start">
                   <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                   <div className="w-12 h-[1px] bg-secondary/30 flex justify-between items-center">
                      <div className="w-0.5 h-0.5 rounded-full bg-secondary" />
                      <div className="w-0.5 h-0.5 rounded-full bg-secondary" />
                      <div className="w-0.5 h-0.5 rounded-full bg-secondary" />
                   </div>
                   <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Grid */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">How can we help?</h2>
          <ActionGrid />
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
