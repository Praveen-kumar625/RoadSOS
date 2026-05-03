import * as React from "react"
import { AmbulanceCard } from "@/entities/ambulance/ui/AmbulanceCard"
import { DriverInfo } from "@/entities/driver/ui/DriverInfo"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"
import { Share2, MapPin, Navigation } from "lucide-react"

export function AmbulanceTracker() {
  const mockAmbulance = { id: "AS-247", distance: "2.4", eta: "6" }
  const mockDriver = { name: "Ravi Kumar", rating: "4.8", experience: "10" }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Map View Mock */}
      <div className="relative flex-1 min-h-[300px] rounded-3xl overflow-hidden bg-slate-900 border border-white/10">
        {/* Mock Map Background */}
        <div className="absolute inset-0 opacity-40 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/77.391,28.535,13,0/600x600?access_token=pk.mock')] bg-cover" />
        
        {/* Route Line Mock */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M20 80 Q 50 50, 80 20" 
            fill="none" 
            stroke="#EF4444" 
            strokeWidth="2" 
            strokeDasharray="4 2"
            className="animate-[dash_2s_linear_infinite]"
          />
        </svg>

        {/* Marker User */}
        <div className="absolute left-[18%] bottom-[18%] -translate-x-1/2 translate-y-1/2">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-8 h-8 rounded-full bg-secondary/30 animate-ping" />
            <div className="w-4 h-4 rounded-full bg-secondary border-2 border-white shadow-lg neon-glow-blue" />
          </div>
        </div>

        {/* Marker Ambulance */}
        <div className="absolute right-[18%] top-[18%] translate-x-1/2 -translate-y-1/2">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-8 h-8 rounded-full bg-primary/30 animate-ping" />
            <div className="w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg neon-glow-red" />
          </div>
        </div>

        {/* Top Floating Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
           <AmbulanceCard ambulance={mockAmbulance} className="w-full max-w-sm glass-card border-none" />
        </div>
      </div>

      <div className="space-y-4">
        <Card className="glass-card">
          <CardContent className="p-6 space-y-6">
            <DriverInfo driver={mockDriver} />
            
            <hr className="border-white/10" />
            
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ambulance Details</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Model</p>
                  <p className="font-bold">Force Traveller</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Reg. No.</p>
                  <p className="font-bold tracking-wider uppercase text-primary">HR 55 AB 1234</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full h-14 rounded-2xl gap-2 border-white/10 hover:bg-white/5">
          <Share2 className="h-5 w-5" /> Share Live Location
        </Button>
      </div>
    </div>
  )
}
