import { Card, CardContent } from "@/shared/ui/card"
import { Badge } from "@/shared/ui/badge"
import { Ambulance } from "lucide-react"

export function AmbulanceCard({ ambulance, className }) {
  return (
    <Card className={`bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-2xl ${className}`}>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <img src="https://img.freepik.com/premium-photo/modern-ambulance-vehicle-ready-emergency-responding-white-background-generative-ai_103070-1365.jpg" alt="Ambulance" className="w-full h-full object-cover scale-150" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h4 className="font-bold text-base tracking-tight text-white">Ambulance {ambulance.id}</h4>
            <Badge variant="success" className="px-3 py-1 font-bold text-[9px] uppercase tracking-wider">On the way</Badge>
          </div>
          <p className="text-xs text-white/70">
            {ambulance.distance} km away <span className="mx-2">•</span> ETA {ambulance.eta} mins
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
